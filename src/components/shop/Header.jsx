// src/components/shop/Header.jsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './Header.css';
import { ShoppingCart, User, Search, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/components/context/ThemeContext';
import { useCart } from '@/components/context/CartContext';
import CartModal from './CartModal';
import CartSidebar from './CartSidebar';
import MobileSidebar from './MobileSidebar';
import SearchModal from './SearchModal';
import gsap from 'gsap';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Detectar tamaño inicial
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
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
          {/* --- VISTA DESKTOP --- */}
          <div className="desktop-header">
            <div className="header-left">
              <Link href="/" className="logo">
                Onovateth
              </Link>
              <nav className="main-nav">
                <Link href="/">Inicio</Link>
                <Link href="/categories">Categorías</Link>
                <Link href="/contact">Contacto</Link>
              </nav>
            </div>

            <div className="header-actions">
              <button 
                className="search-btn"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="header-icon search-icon" size={24} />
              </button>
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

          {/* --- VISTA MÓVIL --- */}
          <div className="mobile-header">
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              <Menu className="header-icon" />
            </button>

            <Link href="/" className="mobile-logo">
            Onovateth
            </Link>

            <button className="mobile-cart-btn" onClick={() => setCartOpen(true)} style={{ position: 'relative' }} aria-label="Ver carrito">
              <ShoppingCart className="header-icon" />
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menú lateral móvil */}
      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Carrito */}
      {isMobile ? (
        <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      ) : (
        <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      )}

      {/* Modal de búsqueda */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;