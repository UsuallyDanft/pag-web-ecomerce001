"use client";
import React, { useState, useEffect } from 'react';
import ProductContainer from '@/components/shop/ProductContainer';
import { queryAPI } from '@/components/lib/strapi';
import { useSearchParams } from 'next/navigation'; // 1. Importa useSearchParams

const sortOptions = [
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre' },
];

const PAGE_SIZE = 8; // Aumentamos el tamaño de página para la página de productos

export default function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [currentSort, setCurrentSort] = useState('price-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. Obtén los parámetros de la URL
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category'); // Obtiene el valor de 'category'

  // useEffect para obtener categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await queryAPI('/api/categories?populate=*');
        if (data && data.data) {
          setCategorias(data.data);
        }
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  // useEffect para obtener productos, dependiente de categorySlug y currentCategory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // 3. Construye la ruta de la API dinámicamente
        let apiPath = '/api/products?populate=*';
        const activeCategory = currentCategory || categorySlug;
        if (activeCategory) {
          // Si hay un slug de categoría, añade el filtro a la ruta
          apiPath += `&filters[categories][slug][$eq]=${activeCategory}`;
        }
        const data = await queryAPI(apiPath);
        console.log("=== RESPUESTA CRUDA DE PRODUCTOS ===", data.data);
        if (data && data.data) {
          // Transformar los datos de Strapi al formato que espera ProductCard
          const transformedProducts = data.data.map(product => {
            const attributes = product.attributes || product;
            let imageUrl = '/placeholder.png';
            let allImages = [];
            
            if (attributes.images && attributes.images.length > 0) {
              // Procesar todas las imágenes del producto
              allImages = attributes.images.map(img => {
                if (img.url) {
                  return new URL(img.url, process.env.NEXT_PUBLIC_STRAPI_HOST).href;
                }
                return null;
              }).filter(url => url !== null);
              
              // Usar la primera imagen como imagen principal
              if (allImages.length > 0) {
                imageUrl = allImages[0];
              }
            }
            
            console.log('Producto:', attributes.name, 'URL de imagen:', imageUrl, 'Todas las imágenes:', allImages);
            const categories = attributes.categories || [];
            return {
              id: product.id,
              slug: attributes.slug,
              name: attributes.name,
              description: attributes.description,
              price: attributes.price,
              imageUrl, // Imagen principal
              allImages, // Todas las imágenes del producto
              categories,
              stock: attributes.stock, // <-- Ahora seguro viene de attributes
            };
          });
          setProductos(transformedProducts);
        } else {
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
  }, [categorySlug, currentCategory]); // 4. El efecto se ejecuta de nuevo si 'categorySlug' o 'currentCategory' cambia

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

  // Cambiar de orden reinicia la página
  const handleSortChange = (sort) => {
    setCurrentSort(sort);
    setCurrentPage(1);
  };

  // Cambiar de categoría reinicia la página
  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setCurrentPage(1);
  };

  if (loading) {
    return <p style={{ textAlign: 'center'  }}>Cargando productos...</p>;
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
          {(currentCategory || categorySlug) ? 
            (currentCategory || categorySlug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
            'Todos los Productos'}
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-secondary)'
        }}>
          {(currentCategory || categorySlug) ? 
            `Explora los productos de la categoría: ${(currentCategory || categorySlug).replace(/-/g, ' ')}` : 
            'Explora nuestra amplia selección de productos de calidad.'}
        </p>
      </div>
      <ProductContainer
        title=""
        products={paginatedProducts} // Pasa los productos filtrados y paginados
        sortOptions={sortOptions}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        categories={categorias}
        currentCategory={currentCategory || categorySlug}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
}
