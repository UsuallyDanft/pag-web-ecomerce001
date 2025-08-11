
import React from 'react';
import ProductCard from './ProductCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './ProductContainer.css';

const ProductContainer = ({
  title = '',
  products = [],
  sortOptions = [],
  onSortChange = () => {},
  currentSort = '',
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  categories = [],
  currentCategory = null,
  onCategoryChange = () => {}
}) => {
  
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    // Si el valor es vacío, pasar null; si no, pasar el valor
    onCategoryChange(value === '' ? null : value);
  };

  return (
    <div className="products-container">
      <div className="products-header">
        {title && <h2>{title}</h2>}
        <div className="product-controls">
          <div className="select-wrapper">
            <select
              className="category-select"
              value={currentCategory || ''}
              onChange={handleCategoryChange}
              title="Filtrar por categoría"
            >
              <option value="">Todos los productos</option>
              {categories
                .filter(category => category.slug && category.name)
                .map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))
              }
            </select>
          </div>

          <div className="select-wrapper">
            <select 
              className="order-select" 
              value={currentSort} 
              onChange={e => onSortChange(e.target.value)}
              title="Ordenar productos"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="products-list">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '3rem',
            color: 'var(--text-secondary)'
          }}>
            <p>No se encontraron productos para esta categoría.</p>
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="pagination-btn"
          >
            <ArrowLeft />
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="pagination-btn"
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductContainer;
