
"use client";

import React from 'react';
import ProductCard from './ProductCard';
import './ProductContainer.css';

const ProductContainer = ({
  title,
  products,
  sortOptions,
  currentSort,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  categories,
  currentCategory,
  onCategoryChange
}) => {
  console.log('ProductContainer - Props recibidas:');
  console.log('- products:', products?.length || 0);
  console.log('- categories:', categories?.length || 0);
  console.log('- currentCategory:', currentCategory);

  return (
    <div className="product-container">
      {title && (
        <div className="container-header">
          <h2 className="container-title">{title}</h2>
        </div>
      )}

      <div className="filters">
        <div className="filter-item">
          <label htmlFor="category-select" className="filter-label">Categoría</label>
          <select
            id="category-select"
            className="category-select"
            value={currentCategory || ''}
            onChange={(e) => {
              console.log('Cambio de select de categoría:', e.target.value);
              onCategoryChange(e.target.value);
            }}
          >
            <option value="">Todos los productos</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="sort-select" className="filter-label">Ordenar por</label>
          <select
            id="sort-select"
            className="order-select"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {products?.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <p>No se encontraron productos para esta categoría.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductContainer;
