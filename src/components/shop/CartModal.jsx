"use client";

import React from 'react';
// Cambiamos el icono a ShoppingCart para mayor claridad
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'; 
import { useCart } from '@/components/context/CartContext';
import { useRouter } from 'next/navigation';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
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
    onClose(); // Cerrar el modal después de navegar
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="cart-modal-header">
          <div className="cart-modal-title">
            <ShoppingCart className="cart-icon" />
            <h2>Tu carrito</h2>
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="cart-modal-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={48} className="empty-cart-icon" />
              <p>Tu carrito está vacío</p>
              <span>Agrega algunos productos para comenzar</span>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="cart-modal-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-modal-item">
                    <div className="cart-modal-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-modal-item-details">
                      <h3 className="cart-modal-item-name">{item.name}</h3>
                      <p className="cart-modal-item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-modal-item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                          disabled={item.quantity <= 1}
                          className="quantity-btn"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                          disabled={item.quantity >= item.stock}
                          className="quantity-btn"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-btn"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="cart-modal-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer del carrito */}
              <div className="cart-modal-footer">
                <div className="cart-modal-summary">
                  <button onClick={clearCart} className="cart-modal-clear-btn">
                    <Trash2 size={16} /> Vaciar carrito
                  </button>
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="cart-actions">
                  <button onClick={onClose} className="continue-shopping-btn">
                    Seguir comprando
                  </button>
                  <button onClick={handleCheckout} className="checkout-btn">
                    Proceder al pago
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;