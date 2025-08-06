
"use client";

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/context/CartContext';
import { useRouter } from 'next/navigation';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, total, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  const handleQuantityChange = (productId, newQuantity, stock) => {
    if (newQuantity > stock) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    router.push('/checkout');
    onClose();
  };

  return (
    <div className="cart-sidebar-overlay" onClick={onClose}>
      <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
        {/* Header compacto */}
        <div className="cart-sidebar-header">
          <div className="cart-sidebar-title">
            <ShoppingCart size={20} />
            <span>Carrito</span>
            {itemCount > 0 && <span className="cart-sidebar-count">{itemCount}</span>}
          </div>
          <button className="cart-sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="cart-sidebar-content">
          {items.length === 0 ? (
            <div className="cart-sidebar-empty">
              <ShoppingCart size={32} />
              <p>Carrito vacío</p>
            </div>
          ) : (
            <div className="cart-sidebar-items">
              {items.map((item) => (
                <div key={item.id} className="cart-sidebar-item">
                  <div className="cart-sidebar-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-sidebar-item-info">
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)}</p>
                    <div className="cart-sidebar-item-controls">
                      <div className="cart-sidebar-quantity">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="cart-sidebar-remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="cart-sidebar-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-sidebar-footer">
            <button onClick={clearCart} className="cart-sidebar-clear">
              <Trash2 size={14} />
              Vaciar
            </button>
            <div className="cart-sidebar-total">
              <span>Total: ${total.toFixed(2)}</span>
            </div>
            <div className="cart-sidebar-actions">
              <button onClick={onClose} className="cart-sidebar-continue">
                Continuar
              </button>
              <button onClick={handleCheckout} className="cart-sidebar-checkout">
                Pagar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
