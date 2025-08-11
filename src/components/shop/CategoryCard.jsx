
import React from 'react';
import { useRouter } from 'next/navigation';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  const router = useRouter();

  const handleClick = () => {
    console.log('Navegando a productos de categoría:', category.slug);
    // Navegar a la página de productos con el parámetro de categoría
    router.push(`/products?category=${category.slug}`);
  };

  // Obtener la URL de la imagen
  const getImageUrl = () => {
    if (!category.image?.data) {
      return '/placeholder.png';
    }

    const imageData = category.image.data;
    const imageUrl = imageData.attributes?.url || imageData.url;
    
    if (!imageUrl) {
      return '/placeholder.png';
    }

    // Si la URL ya es completa, usarla tal como está
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // Si no, construir la URL completa
    return new URL(imageUrl, process.env.NEXT_PUBLIC_STRAPI_HOST).href;
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <div className="category-image">
        <img 
          src={getImageUrl()} 
          alt={category.name}
          onError={(e) => {
            e.target.src = '/placeholder.png';
          }}
        />
      </div>
      <div className="category-info">
        <h3>{category.name}</h3>
        {category.description && (
          <p>{category.description}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
