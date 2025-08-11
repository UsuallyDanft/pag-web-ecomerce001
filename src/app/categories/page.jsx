
"use client";

import React, { useState, useEffect } from 'react';
import CategoryContainer from '@/components/shop/CategoryContainer';
import { queryAPI } from '@/components/lib/strapi';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleViewCategory = (category) => {
    console.log('Navegando a categoría:', category);
    if (category.slug) {
      router.push(`/products?category=${category.slug}`);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("=== CARGANDO CATEGORÍAS EN PÁGINA CATEGORIES ===");
        const data = await queryAPI('/api/categories?populate=*');
        console.log("Respuesta de categorías:", data);

        if (data?.data) {
          // Transformar para estructura consistente
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
        console.error("Error al cargar las categorías:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem', 
          color: 'var(--text-primary)'
        }}>
          Categorías
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-secondary)'
        }}>
          Explora nuestras diferentes categorías de productos
        </p>
      </div>

      {isLoading ? (
        <p style={{ textAlign: 'center' }}>Cargando categorías...</p>
      ) : (
        <CategoryContainer categories={categorias} onViewCategory={handleViewCategory} />
      )}
    </div>
  );
}
