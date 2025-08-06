"use client";

import React from 'react';
import CartSummary from '@/components/checkout/CartSummary';
import './page.css';

const CheckoutPage = () => {
  return (
    <div className="checkout-container">
      {/* Sección de la pasarela de pago (60%) */}
      <div className="payment-section">
        <div className="payment-content">
          <h1>Información de Pago</h1>
          <div className="development-notice">
            <h2>Pasarela de Pago</h2>
            <p>Esta funcionalidad está en desarrollo</p>
            <div className="development-icon">🚧</div>
          </div>
        </div>
      </div>

      {/* Sección del carrito (40%) */}
      <div className="cart-section">
        <CartSummary />
      </div>
    </div>
  );
};

export default CheckoutPage;