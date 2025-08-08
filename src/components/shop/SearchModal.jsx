
"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Filter } from 'lucide-react';
import { useCart } from '@/components/context/CartContext';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();

  // Obtener productos y categorías
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchCategories();
    }
  }, [isOpen]);

  // Filtrar productos
  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, priceRange, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/products?populate=*`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`
        }
      });
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`
        }
      });
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.id?.toString() === selectedCategory
      );
    }

    // Filtro por precio
    if (priceRange.min !== '') {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    const productImage = product.images?.data?.[0] ? 
      `${process.env.NEXT_PUBLIC_STRAPI_HOST}${product.images.data[0].url}` : 
      '/placeholder.jpg';

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImage,
      stock: product.stock || 10
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="search-modal-header">
          <div className="search-modal-title">
            <Search className="search-icon" />
            <h2>Buscar productos</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-modal-search">
          <div className="search-input-container">
            <Search className="search-input-icon" />
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="search-modal-filters">
            <div className="filters-row">
              <div className="filter-group">
                <label>Categoría:</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Precio mín:</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
              </div>
              <div className="filter-group">
                <label>Precio máx:</label>
                <input
                  type="number"
                  placeholder="$999"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {/* Contenido de resultados */}
        <div className="search-modal-content">
          {isLoading ? (
            <div className="search-loading">
              <p>Buscando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-search">
              <Search size={48} className="empty-search-icon" />
              <p>No se encontraron productos</p>
              <span>Intenta con otros términos de búsqueda</span>
            </div>
          ) : (
            <div className="search-modal-results">
              <div className="results-header">
                <span>{filteredProducts.length} productos encontrados</span>
              </div>
              <div className="search-modal-items">
                {filteredProducts.map((product) => {
                  const productImage = product.images?.data?.[0] ? 
                    `${process.env.NEXT_PUBLIC_STRAPI_HOST}${product.images.data[0].url}` : 
                    '/placeholder.jpg';

                  return (
                    <div key={product.id} className="search-modal-item">
                      <div className="search-modal-item-image">
                        <img src={productImage} alt={product.name} />
                      </div>
                      <div className="search-modal-item-details">
                        <h3 className="search-modal-item-name">{product.name}</h3>
                        <p className="search-modal-item-description">
                          {product.description?.substring(0, 60)}...
                        </p>
                        <div className="search-modal-item-price">
                          ${product.price?.toFixed(2)}
                        </div>
                      </div>
                      <div className="search-modal-item-actions">
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="add-to-cart-btn"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
