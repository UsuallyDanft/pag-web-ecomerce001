// src/components/shop/Header.jsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './Header.css';
import { ShoppingCart, User, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/context/ThemeContext';
import { useCart } from '@/components/context/CartContext';
import CartModal from './CartModal';
import gsap from 'gsap';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  // Refs para animación
  const headerRef = useRef(null);
  const iconsRef = useRef([]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animación de entrada con GSAP
  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
    // Eliminar animación de los iconos
  }, []);

  return (
    <>
      <header ref={headerRef} className={`shop-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* --- GRUPO 1: IZQUIERDA (Logo y Navegación) --- */}
          <div className="header-left">
            <Link href="/" className="logo">
              MiTienda
            </Link>
            <nav className="main-nav">
              <Link href="/">Inicio</Link>
              <Link href="/categories">Categorías</Link>
              <Link href="/contact">Contacto</Link>
            </nav>
          </div>

          {/* --- GRUPO 3: DERECHA (Acciones) --- */}
          <div className="header-actions">
            <Link href="/search">
              <Search className="header-icon" />
            </Link>
            <button className="cart-btn" onClick={() => setCartOpen(true)} style={{ position: 'relative' }} aria-label="Ver carrito">
              <ShoppingCart className="header-icon" />
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </button>
            <button 
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              {isDarkMode ? <Sun className="header-icon" /> : <Moon className="header-icon" />}
            </button>
            <Link href="/login">
              <User className="header-icon" />
            </Link>
          </div>
        </div>
      </header>
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;