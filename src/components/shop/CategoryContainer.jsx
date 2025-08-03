"use client";

import React from 'react';
import CategoryCard from './CategoryCard';
import './CategoryContainer.css';

const CategoryContainer = ({ categories = [], onViewCategory }) => {
  // Si no hay categorías, mostrar un mensaje
  if (!categories || categories.length === 0) {
    return (
      <div className="categories-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      {categories.map(category => (
        <CategoryCard
          key={category.id}
          category={category}
          onView={() => onViewCategory(category)}
        />
      ))}
    </div>
  );
};

export default CategoryContainer;