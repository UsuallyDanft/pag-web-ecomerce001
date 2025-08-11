import React from 'react';
import ProductCard from './ProductCard'; // Importamos el componente de la tarjeta
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './ProductContainer.css'; // Corrige el nombre del archivo de estilos

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
  currentCategory,
  onCategoryChange
}) => {
  return (
    <div className="products-container">
      <div className="products-header">
        {title && <h2>{title}</h2>}
        <div className="product-controls">
          <div className="select-wrapper">
            <select
              className="category-select"
              value={currentCategory === null ? '' : currentCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value === '' ? null : e.target.value)}
              title="Filtrar por categoría"
            >
              <option value="">Todos los productos</option>
              {categories.filter(category => category.slug && category.name).map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
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
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="products-list">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
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