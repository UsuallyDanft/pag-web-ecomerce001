// ./components/ProductSlider.js

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import './ProductSlider.css';

const getVisibleCount = () => {
  if (typeof window === 'undefined') return 5;
  if (window.innerWidth < 600) return 3;
  if (window.innerWidth < 900) return 3;
  if (window.innerWidth < 1200) return 4;
  return 5;
};

const ProductSlider = ({ title, products }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());
  const viewportRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (products.length > 0 && visibleCount > 0) {
      const maxStartIndex = Math.max(0, products.length - visibleCount);
      setStartIndex(prev => Math.min(prev, maxStartIndex));
    }
  }, [visibleCount, products.length]);

  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex < products.length - visibleCount;

  // Determinar qué clases de desvanecimiento aplicar
  const getViewportClasses = () => {
    if (!canScrollLeft && !canScrollRight) {
      return 'no-fade';
    }
    if (!canScrollLeft) {
      return 'no-fade-left';
    }
    if (!canScrollRight) {
      return 'no-fade-right';
    }
    return '';
  };

  const handleScroll = (direction) => {
    const step = Math.max(1, Math.floor(visibleCount / 2));
    
    if (direction === 'left') {
      setStartIndex(prev => Math.max(0, prev - step));
    } else {
      setStartIndex(prev => Math.min(products.length - visibleCount, prev + step));
    }
  };
  
  // Tamaño dinámico para las tarjetas según el viewport
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 250;
    if (window.innerWidth < 600) return Math.floor((window.innerWidth - 120) / 3); // 3 tarjetas en móvil
    if (window.innerWidth < 900) return 220;
    return 250;
  };
  
  const cardWidth = getCardWidth();
  const gapWidth = window.innerWidth < 600 ? 8 : 16;
  const totalCardWidth = cardWidth + gapWidth;
  
  const sliderStyles = {
    transform: `translateX(-${startIndex * totalCardWidth}px)`,
    transition: 'transform 0.3s ease-in-out',
  };

  return (
    <section className="product-slider-container">
      {title && <h2 className="product-slider-title">{title}</h2>}
      <div className="slider-wrapper">
        <button
          className={`slider-btn left ${!canScrollLeft ? 'is-hidden' : ''}`}
          aria-label="Deslizar a la izquierda"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft size={24} />
        </button>

        <div className={`slider-viewport ${getViewportClasses()}`} ref={viewportRef}>
          <div
            className="product-slider-list"
            style={sliderStyles}
          >
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <button
          className={`slider-btn right ${!canScrollRight ? 'is-hidden' : ''}`}
          aria-label="Deslizar a la derecha"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default ProductSlider;