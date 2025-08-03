"use client";

import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/components/context/CartContext';
import { useRouter } from 'next/navigation';

const ProductInfoActions = ({ product }) => {
  // Soporta estructura anidada de Strapi (product.attributes)
  const attributes = product.attributes || product;
  const { name, description, price, stock } = attributes;
  const tags = attributes.tags?.data || product.tags?.data || product.tags || [];
  const { addToCart, items } = useCart(); // 'items' nos dice si el carrito está vacío
  const router = useRouter();

  // Calcular cuántos de este producto ya hay en el carrito
  const cartItem = items.find(item => item.id === product.id);
  const stockEnCarrito = cartItem ? cartItem.quantity : 0;
  const stockRestante = Math.max(0, (stock || 0) - stockEnCarrito);

  const [quantity, setQuantity] = useState(1);

  // Si el stock restante cambia, ajustar la cantidad local
  useEffect(() => {
    if (quantity > stockRestante) {
      setQuantity(stockRestante > 0 ? stockRestante : 1);
    }
  }, [stockRestante]);

  // Función para renderizar texto enriquecido
  function renderRichText(blocks) {
    if (!Array.isArray(blocks)) return null;
    return blocks.map((block, idx) => {
      switch (block.type) {
        case "paragraph":
          return (
            <p key={idx}>
              {block.children.map((child, cidx) =>
                child.bold ? <strong key={cidx}>{child.text}</strong> : child.text
              )}
            </p>
          );
        case "heading":
          return (
            <h3 key={idx}>
              {block.children.map((child, cidx) =>
                child.bold ? <strong key={cidx}>{child.text}</strong> : child.text
              )}
            </h3>
          );
        case "list":
          return (
            <ul key={idx}>
              {block.children.map((item, cidx) => (
                <li key={cidx}>{item.text}</li>
              ))}
            </ul>
          );
        default:
          return null;
      }
    });
  }

  const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrement = () => setQuantity(q => Math.min(stockRestante, q + 1));
  const handleAddToCart = () => {
    if (quantity > stockRestante) {
      alert('No puedes añadir más productos de los disponibles en stock.');
      return;
    }
    addToCart(product, quantity);
  };

  // --- CAMBIO AQUÍ ---
  // La función ahora solo redirige a la página de pago.
  const handleBuyNow = () => {
    router.push('/checkout');
  };

  return (
    <div className="info-actions-container">
      <h1 className="product-title">{name}</h1>
      <p className="product-price">${price.toFixed(2)}</p>
      
      <div className="quantity-selector">
        <span>Cantidad:</span>
        <div className="quantity-controls">
          <button onClick={handleDecrement} aria-label="Disminuir cantidad" disabled={stockRestante === 0}>
            <Minus size={20} />
          </button>
          <span>{quantity}</span>
          <button onClick={handleIncrement} aria-label="Aumentar cantidad" disabled={quantity >= stockRestante || stockRestante === 0}>
            <Plus size={20} />
          </button>
        </div>
        <span className="stock-info">{stockRestante > 0 ? `${stockRestante} disponibles` : 'Sin stock'}</span>
      </div>

      <div className="product-tags">
        <h4>Etiquetas:</h4>
        {tags.length > 0 ? (
          <ul>
            {tags.map(tag => (
              <li key={tag.id}>{tag.attributes ? tag.attributes.name : tag.name}</li>
            ))}
          </ul>
        ) : (
          <span>Sin etiquetas</span>
        )}
      </div>

      <div className="action-buttons">
        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={stockRestante === 0}>
          Añadir al carrito
        </button>
        {/* --- CAMBIO AQUÍ --- */}
        {/* El botón ahora se deshabilita si el carrito está vacío (items.length === 0) */}
        <button className="buy-now-btn" onClick={handleBuyNow} disabled={items.length === 0}>
          Proceder al pago
        </button>
      </div>
      
      <div className="product-description-detail">
        <h3 className='product-description-title'>Descripción</h3>
        <div className='product-description'>
          {typeof description === 'string'
            ? description
            : renderRichText(description) || 'Sin descripción detallada.'}
        </div>
      </div>

    </div>
  );
};

export default ProductInfoActions;