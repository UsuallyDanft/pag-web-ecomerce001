
"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Filter, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/context/CartContext';
import { queryAPI } from '@/components/lib/strapi';
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

  const { addToCart, itemCount, getItemQuantity } = useCart();
  const router = useRouter();

  // Solo obtener categorías al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      // Limpiar estado anterior
      setProducts([]);
      setFilteredProducts([]);
      setSearchQuery('');
      setSelectedCategory('all');
      setPriceRange({ min: '', max: '' });
    }
  }, [isOpen]);

  // Búsqueda dinámica cuando el usuario escribe
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchProducts();
    } else {
      setProducts([]);
      setFilteredProducts([]);
    }
  }, [searchQuery]);

  // Filtrar productos cuando cambien los filtros
  useEffect(() => {
    if (products.length > 0) {
      filterProducts();
    }
  }, [selectedCategory, priceRange, products]);

  const searchProducts = async () => {
    setIsLoading(true);
    try {
      console.log('Buscando productos con query:', searchQuery);
      
      // Usar la misma estructura que en ProductContainer
      let apiPath = '/api/products?populate=*';
      apiPath += `&filters[name][$containsi]=${encodeURIComponent(searchQuery)}`;
      
      console.log('API path:', apiPath);
      
      const data = await queryAPI(apiPath);
      console.log('Respuesta de búsqueda completa:', data);
      
      if (data && data.data && data.data.length > 0) {
        // Usar la misma transformación que en ProductContainer
        const transformedProducts = data.data.map(product => {
          const attributes = product.attributes || product;
          let imageUrl = '/placeholder.png';
          let allImages = [];
          
          // Manejar imágenes igual que en ProductContainer
          const images = attributes.images || [];
          if (Array.isArray(images) && images.length > 0) {
            allImages = images.map(img => {
              if (img.url) {
                return new URL(img.url, process.env.NEXT_PUBLIC_STRAPI_HOST).href;
              }
              return null;
            }).filter(url => url !== null);
            
            if (allImages.length > 0) {
              imageUrl = allImages[0];
            }
          }
          
          // Manejar categorías igual que en ProductContainer
          const categories = attributes.categories || [];
          let category = null;
          
          if (Array.isArray(categories) && categories.length > 0) {
            const firstCategory = categories[0];
            if (firstCategory && firstCategory.attributes) {
              category = {
                id: firstCategory.id,
                name: firstCategory.attributes.name,
                slug: firstCategory.attributes.slug
              };
            }
          }
          
          return {
            id: product.id,
            documentId: product.documentId,
            slug: attributes.slug || '',
            name: attributes.name || 'Sin nombre',
            description: attributes.description || '',
            price: typeof attributes.price === 'number' ? attributes.price : 0,
            stock: attributes.stock || 10,
            imageUrl,
            allImages,
            category
          };
        });
        
        console.log('Productos transformados:', transformedProducts);
        setProducts(transformedProducts);
      } else {
        console.log('No se encontraron productos en la respuesta');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Obteniendo categorías para modal de búsqueda...');
      
      const data = await queryAPI('/api/categories?populate=*');
      console.log('Categorías obtenidas:', data);
      
      if (data && data.data) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        if (!product.category) return false;
        return product.category.id?.toString() === selectedCategory;
      });
    }

    // Filtro por precio
    if (priceRange.min !== '') {
      const minPrice = parseFloat(priceRange.min);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(product => product.price >= minPrice);
      }
    }
    if (priceRange.max !== '') {
      const maxPrice = parseFloat(priceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(product => product.price <= maxPrice);
      }
    }

    setFilteredProducts(filtered);
  };

  const handleViewDetails = (product) => {
    onClose(); // Cerrar modal antes de navegar
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = (product) => {
    // Verificar stock disponible antes de agregar
    const quantityInCart = getItemQuantity(product.id);
    const availableStock = (product.stock || 0) - quantityInCart;
    
    if (availableStock <= 0) {
      return; // No agregar si no hay stock disponible
    }
    
    addToCart(product, 1);
  };

  const clearFilters = () => {
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
              placeholder="¿Qué estás buscando? (mínimo 2 caracteres)"
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
                      {category.attributes?.name || category.name}
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
          {searchQuery.length > 0 && searchQuery.length < 2 ? (
            <div className="search-hint">
              <Search size={48} className="search-hint-icon" />
              <p>Escribe al menos 2 caracteres para buscar</p>
            </div>
          ) : isLoading ? (
            <div className="search-loading">
              <p>Buscando productos...</p>
            </div>
          ) : searchQuery.length >= 2 && filteredProducts.length === 0 ? (
            <div className="empty-search">
              <Search size={48} className="empty-search-icon" />
              <p>No se encontraron productos</p>
              <span>Intenta con otros términos de búsqueda</span>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="search-modal-results">
              <div className="results-header">
                <span>{filteredProducts.length} productos encontrados</span>
              </div>
              <div className="search-modal-items">
                {filteredProducts.map((product) => {
                  const quantityInCart = getItemQuantity(product.id);
                  const availableStock = (product.stock || 0) - quantityInCart;
                  
                  return (
                    <div key={product.id} className="search-modal-item">
                      <div className="search-modal-item-image">
                        <img src={product.imageUrl} alt={product.name} />
                      </div>
                      <div className="search-modal-item-details">
                        <h3 className="search-modal-item-name">{product.name}</h3>
                        <div className="search-modal-item-price">
                          ${product.price?.toFixed(2)}
                        </div>
                        <div className="search-modal-item-stock">
                          {availableStock} unidades disponibles
                        </div>
                      </div>
                      <div className="search-modal-item-actions">
                        <button 
                          onClick={() => handleViewDetails(product)}
                          className="details-btn"
                        >
                          Ver detalles
                        </button>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="add-to-cart-btn"
                          disabled={availableStock <= 0}
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="search-welcome">
              <Search size={48} className="search-welcome-icon" />
              <p>Comienza a escribir para buscar productos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
