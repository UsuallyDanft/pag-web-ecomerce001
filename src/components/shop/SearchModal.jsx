
"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
      const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST;
      const strapiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      
      console.log('Variables de entorno:', {
        host: strapiHost,
        token: strapiToken ? 'Existe' : 'No existe'
      });
      console.log('Buscando productos con query:', searchQuery);
      
      const url = `${strapiHost}/api/products?populate=*&filters[name][$containsi]=${encodeURIComponent(searchQuery)}`;
      console.log('URL de búsqueda:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${strapiToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Respuesta de búsqueda completa:', data);
      
      if (data && data.data) {
        // Transformar datos de Strapi al formato esperado
        const transformedProducts = data.data.map(product => {
          const attributes = product.attributes;
          const images = attributes.images?.data || [];
          
          return {
            id: product.id,
            documentId: product.documentId,
            slug: attributes.slug,
            name: attributes.name,
            description: attributes.description,
            price: attributes.price,
            stock: attributes.stock || 10,
            imageUrl: images.length > 0 ? 
              `${process.env.NEXT_PUBLIC_STRAPI_HOST}${images[0].attributes.url}` : 
              '/placeholder.jpg',
            allImages: images.map(img => 
              `${process.env.NEXT_PUBLIC_STRAPI_HOST}${img.attributes.url}`
            ),
            category: attributes.category?.data || null
          };
        });
        
        console.log('Productos transformados:', transformedProducts);
        setProducts(transformedProducts);
      } else {
        console.log('No se encontraron datos en la respuesta');
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
      const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST;
      const strapiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      
      console.log('Obteniendo categorías...');
      console.log('Host:', strapiHost);
      
      const url = `${strapiHost}/api/categories`;
      console.log('URL categorías:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${strapiToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Categories response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response categories:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Categorías obtenidas:', data);
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.id?.toString() === selectedCategory ||
        product.category?.attributes?.id?.toString() === selectedCategory
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

  const handleViewDetails = (product) => {
    onClose(); // Cerrar modal antes de navegar
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = (product) => {
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
                {filteredProducts.map((product) => (
                  <div key={product.id} className="search-modal-item">
                    <div className="search-modal-item-image">
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <div className="search-modal-item-details">
                      <h3 className="search-modal-item-name">{product.name}</h3>
                      <p className="search-modal-item-description">
                        {product.description ? 
                          (product.description.length > 60 ? 
                            `${product.description.substring(0, 60)}...` : 
                            product.description
                          ) : 
                          'Sin descripción disponible'
                        }
                      </p>
                      <div className="search-modal-item-price">
                        ${product.price?.toFixed(2)}
                      </div>
                      <div className="search-modal-item-stock">
                        {product.stock} unidades disponibles
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
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                ))}
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
