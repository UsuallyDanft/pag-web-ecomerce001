
"use client";

import React from 'react';
import './CategoryCard.css';
import { useRouter } from 'next/navigation';

const CategoryCard = ({ category, onView }) => {
  const router = useRouter();

  if (!category) {
    return (
      <div className="category-card">
        <div className="category-info">
          <h3 className="category-name">Cargando...</h3>
          <p className="category-description">Cargando descripción...</p>
        </div>
      </div>
    );
  }

  console.log('CategoryCard - Categoría recibida:', category);

  const { name, description, image, slug } = category;
  
  // Construir URL de imagen
  const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST;
  const imageUrl = image?.url 
    ? (image.url.startsWith('http') ? image.url : new URL(image.url, strapiHost).href)
    : '/placeholder.png';

  const handleViewProducts = () => {
    if (slug) {
      console.log('Navegando a productos con slug:', slug);
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
        <p className="category-description">{description || 'Sin descripción'}</p>
        <div className="category-actions">
          <button className="view-btn" onClick={handleViewProducts}>
            Ver productos
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
