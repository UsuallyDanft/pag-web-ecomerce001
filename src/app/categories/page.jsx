"use client";

import React, { useState, useEffect } from 'react';
import CategoryContainer from '@/components/shop/CategoryContainer';
import { queryAPI } from '@/components/lib/strapi';
import { useRouter } from 'next/navigation'; // 1. Importa useRouter

export default function CategoriesPage() {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // 2. Inicializa el router

  // 3. Actualiza la función para navegar
  const handleViewCategory = (category) => {
    // Navegamos a la página de productos, pasando el slug en la URL
    router.push(`/products?category=${category.attributes.slug}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await queryAPI('/api/categories?populate=*');
        if (data && data.data) {
          setCategorias(data.data);
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
      </div>

      {isLoading ? (
        <p style={{ textAlign: 'center' }}>Cargando categorías...</p>
      ) : (
        <CategoryContainer categories={categorias} onViewCategory={handleViewCategory} />
      )}
    </div>
  );
}