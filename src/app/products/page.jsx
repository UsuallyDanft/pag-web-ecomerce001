
"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductContainer from '@/components/shop/ProductContainer';
import { queryAPI } from '@/components/lib/strapi';

const sortOptions = [
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre' },
];

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [currentSort, setCurrentSort] = useState('price-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  // Cargar categorías primero
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("=== CARGANDO CATEGORÍAS ===");
        const data = await queryAPI('/api/categories?populate=*');
        console.log("Respuesta de categorías:", data);

        if (data?.data) {
          // Transformar categorías para estructura consistente
          const transformedCategories = data.data.map(category => ({
            id: category.id,
            slug: category.slug,
            name: category.name,
            description: category.description || '',
            image: category.image
          }));
          
          console.log("Categorías transformadas:", transformedCategories);
          setCategorias(transformedCategories);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setCategorias([]);
      }
    };
    fetchCategories();
  }, []);

  // Sincronizar currentCategory con categorySlug de la URL después de que se carguen las categorías
  useEffect(() => {
    console.log('=== SINCRONIZANDO ESTADO CON URL ===');
    console.log('categorySlug desde URL:', categorySlug);
    console.log('currentCategory actual:', currentCategory);
    
    const targetCategory = categorySlug || '';
    
    if (targetCategory !== currentCategory) {
      console.log('Actualizando currentCategory a:', targetCategory);
      setCurrentCategory(targetCategory);
      setCurrentPage(1); // Resetear página al cambiar categoría
    }
  }, [categorySlug, categorias]); // Dependemos de categorías para asegurar que estén cargadas

  // Cargar productos cuando cambie currentCategory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("=== CARGANDO PRODUCTOS ===");
        console.log("Categoría actual para filtrar:", currentCategory);
        
        let apiPath = '/api/products?populate=*';
        
        // Si hay categoría seleccionada, filtrar por ella
        if (currentCategory && currentCategory !== '') {
          apiPath += `&filters[categories][slug][$eq]=${currentCategory}`;
          console.log("Aplicando filtro de categoría:", currentCategory);
        } else {
          console.log("Cargando todos los productos (sin filtro)");
        }
        
        console.log("URL de API:", apiPath);
        const data = await queryAPI(apiPath);
        console.log("Respuesta de productos:", data);

        if (data?.data) {
          // Transformar productos para estructura consistente
          const transformedProducts = data.data.map(product => {
            let imageUrl = '/placeholder.png';
            let allImages = [];

            // Procesar imágenes
            if (product.images && Array.isArray(product.images)) {
              allImages = product.images.map(img => {
                if (img?.url) {
                  return img.url.startsWith('http') 
                    ? img.url 
                    : new URL(img.url, process.env.NEXT_PUBLIC_STRAPI_HOST).href;
                }
                return null;
              }).filter(Boolean);

              if (allImages.length > 0) {
                imageUrl = allImages[0];
              }
            }

            // Procesar categorías del producto
            const productCategories = product.categories || [];

            return {
              id: product.id,
              slug: product.slug,
              name: product.name,
              description: product.description || '',
              price: product.price || 0,
              imageUrl,
              allImages,
              categories: productCategories,
              stock: product.stock || 0,
            };
          });

          console.log(`Productos transformados: ${transformedProducts.length}`, transformedProducts);
          setProductos(transformedProducts);
        } else {
          console.log("No se encontraron productos");
          setProductos([]);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    // Solo cargar productos si las categorías ya están cargadas o si no hay filtro de categoría
    if (categorias.length > 0 || !currentCategory) {
      fetchProducts();
    }
  }, [currentCategory, categorias]);

  // Obtener el nombre de la categoría actual
  const getCurrentCategoryName = () => {
    if (!currentCategory) return 'Todos los Productos';
    
    const category = categorias.find(cat => cat.slug === currentCategory);
    return category ? category.name : currentCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Ordenar productos
  const sortedProducts = [...productos].sort((a, b) => {
    if (currentSort === 'price-asc') return a.price - b.price;
    if (currentSort === 'price-desc') return b.price - a.price;
    if (currentSort === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  // Paginación
  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSortChange = (sort) => {
    setCurrentSort(sort);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categorySlug) => {
    console.log('Cambio de categoría a:', categorySlug);
    setCurrentCategory(categorySlug);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ 
        padding: '2rem', 
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem', 
          color: 'var(--text-primary)'
        }}>
          {getCurrentCategoryName()}
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-secondary)'
        }}>
          {currentCategory 
            ? `Explora los productos de la categoría: ${getCurrentCategoryName()}` 
            : 'Explora nuestra amplia selección de productos de calidad.'}
        </p>
      </div>
      <ProductContainer
        title=""
        products={paginatedProducts}
        sortOptions={sortOptions}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        categories={categorias}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
}
