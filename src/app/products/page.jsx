
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState('Todos los Productos');

  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener el slug de la categoría de la URL
  const categorySlug = searchParams.get('category');

  // Cargar categorías al inicio
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("=== CARGANDO CATEGORÍAS ===");
        const data = await queryAPI('/api/categories?populate=*');
        
        if (data && data.data) {
          const transformedCategories = data.data.map(category => ({
            id: category.id,
            slug: category.attributes.slug,
            name: category.attributes.name,
            description: category.attributes.description,
            ...category.attributes
          }));
          
          setCategorias(transformedCategories);
          console.log("Categorías cargadas:", transformedCategories.length);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setCategorias([]);
      }
    };
    fetchCategories();
  }, []);

  // Establecer la categoría inicial basada en la URL
  useEffect(() => {
    if (categorySlug) {
      console.log("Categoría detectada en URL:", categorySlug);
      setSelectedCategory(categorySlug);
    } else {
      setSelectedCategory(null);
    }
  }, [categorySlug]);

  // Actualizar título cuando cambie la categoría o las categorías se carguen
  useEffect(() => {
    if (selectedCategory && categorias.length > 0) {
      const matchingCategory = categorias.find(cat => cat.slug === selectedCategory);
      if (matchingCategory) {
        setCategoryTitle(matchingCategory.name);
      } else {
        setCategoryTitle(selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
      }
    } else {
      setCategoryTitle('Todos los Productos');
    }
  }, [selectedCategory, categorias]);

  // Cargar productos cuando cambie la categoría seleccionada
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("=== CARGANDO PRODUCTOS ===");
        console.log("Categoría seleccionada:", selectedCategory);

        let apiPath = '/api/products?populate=*';
        
        // Solo filtrar si hay una categoría específica seleccionada
        if (selectedCategory) {
          apiPath += `&filters[categories][slug][$eq]=${encodeURIComponent(selectedCategory)}`;
        }

        console.log("URL de la API:", apiPath);
        const data = await queryAPI(apiPath);
        
        if (data && data.data) {
          console.log(`Productos encontrados: ${data.data.length}`);
          
          const transformedProducts = data.data.map(product => {
            const attributes = product.attributes;
            let imageUrl = '/placeholder.png';
            let allImages = [];

            // Procesar imágenes
            const images = attributes.images?.data || [];
            if (Array.isArray(images) && images.length > 0) {
              allImages = images.map(img => {
                const imgData = img.attributes;
                const url = imgData.url;
                return url.startsWith('http') ? url : new URL(url, process.env.NEXT_PUBLIC_STRAPI_HOST).href;
              }).filter(Boolean);

              if (allImages.length > 0) {
                imageUrl = allImages[0];
              }
            }

            // Procesar categorías
            const categoriesData = attributes.categories?.data || [];
            const categories = categoriesData.map(cat => ({
              id: cat.id,
              slug: cat.attributes.slug,
              name: cat.attributes.name,
              ...cat.attributes
            }));

            return {
              id: product.id,
              slug: attributes.slug,
              name: attributes.name,
              description: attributes.description,
              price: attributes.price,
              imageUrl,
              allImages,
              categories,
              stock: attributes.stock,
            };
          });

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
    
    fetchProducts();
  }, [selectedCategory]);

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
    
    // Actualizar el estado local
    setSelectedCategory(categorySlug || null);
    setCurrentPage(1);
    
    // Actualizar la URL
    const params = new URLSearchParams();
    if (categorySlug) {
      params.set('category', categorySlug);
    }
    
    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
    router.push(newUrl, { scroll: false });
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
          {categoryTitle}
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-secondary)'
        }}>
          {selectedCategory 
            ? `Explora los productos de la categoría: ${categoryTitle}` 
            : 'Explora nuestra amplia selección de productos de calidad.'
          }
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
        currentCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
}
