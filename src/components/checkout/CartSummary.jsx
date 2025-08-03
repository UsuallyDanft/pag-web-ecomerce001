"use client";

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/components/context/CartContext';
import './CartSummary.css';

const CartSummary = () => {
  const { items, total, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId, newQuantity, stock) => {
    if (newQuantity < 1 || newQuantity > stock) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  return (
    <div className="cart-summary-container">
      <div className="cart-summary-header">
        <h2>Resumen del pedido</h2>
        {itemCount > 0 && <span className="item-count">{itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}</span>}
      </div>

      <div className="cart-items">
        {items.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                      disabled={item.quantity <= 1}
                      className="quantity-btn"
                      aria-label="Reducir cantidad"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                      disabled={item.quantity >= item.stock}
                      className="quantity-btn"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-btn"
                    title="Eliminar producto"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="cart-summary-footer">
          <div className="cart-totals">
            <div className="subtotal">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="shipping">
              <span>Envío</span>
              <span>Calculado en el siguiente paso</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={clearCart} 
            className="clear-cart-btn"
            disabled={items.length === 0}
          >
            <Trash2 size={16} /> Vaciar carrito
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
