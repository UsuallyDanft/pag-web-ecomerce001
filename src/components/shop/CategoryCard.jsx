"use client";

import React from 'react';
import './CategoryCard.css';
import { useRouter } from 'next/navigation';

const CategoryCard = ({ category, onView }) => {
  // 1. La validación ahora es más simple
  if (!category || !category.name) {
    return (
      <div className="category-card">
        <div className="category-info">
          <h3 className="category-name">Cargando...</h3>
          <p className="category-description">Cargando descripción...</p>
        </div>
      </div>
    );
  }

  // 2. Desestructuramos los datos directamente del objeto 'category'
  const { name, description, image, slug } = category;

  const router = useRouter();

  // 3. Construimos la URL de la imagen desde la nueva estructura
  const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST;
  const imageUrl = image?.url ? new URL(image.url, strapiHost).href : '/placeholder.png';

  const handleViewProducts = () => {
    if (slug) {
      router.push(`/products?category=${slug}`);
    } else if (onView) {
      onView(category);
    }
  };

  return (
    <div className="category-card">
      <img src={imageUrl} alt={name} className="category-image" />
      <div className="category-info">
        <h3 className="category-name">{name}</h3>
        {/* La descripción parece ser un texto simple en tu API, no enriquecido */}
        <p className="category-description">{description || 'Sin descripción'}</p>
        <div className="category-actions">
          <button className="view-btn" onClick={handleViewProducts}>Ver productos</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;