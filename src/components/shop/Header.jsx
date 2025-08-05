// src/components/shop/Header.jsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './Header.css';
import { ShoppingCart, User, Search, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/components/context/ThemeContext';
import { useCart } from '@/components/context/CartContext';
import CartModal from './CartModal';
import gsap from 'gsap';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  // Refs para animación
  const headerRef = useRef(null);
  const iconsRef = useRef([]);
  const mobileMenuRef = useRef(null);

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

  // Función para cerrar menú móvil
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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

  // Cerrar menú móvil al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header ref={headerRef} className={`shop-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* --- GRUPO 1: IZQUIERDA (Logo y Navegación Desktop) --- */}
          <div className="header-left">
            <Link href="/" className="logo">
              MiTienda
            </Link>
            <nav className="main-nav desktop-nav">
              <Link href="/">Inicio</Link>
              <Link href="/categories">Categorías</Link>
              <Link href="/contact">Contacto</Link>
            </nav>
          </div>

          {/* --- GRUPO 2: DERECHA (Acciones) --- */}
          <div className="header-actions">
            <Link href="/search" className="desktop-action">
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
            <Link href="/login" className="desktop-action">
              <User className="header-icon" />
            </Link>
            
            {/* Botón hamburguesa - solo móvil */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="header-icon" /> : <Menu className="header-icon" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div ref={mobileMenuRef} className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <Link href="/" onClick={closeMobileMenu}>Inicio</Link>
            <Link href="/categories" onClick={closeMobileMenu}>Categorías</Link>
            <Link href="/contact" onClick={closeMobileMenu}>Contacto</Link>
            <Link href="/search" onClick={closeMobileMenu}>Buscar</Link>
            <Link href="/login" onClick={closeMobileMenu}>Mi Cuenta</Link>
          </nav>
        </div>
      </header>
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;