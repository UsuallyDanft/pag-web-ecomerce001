"use client";

import React from 'react';
import Link from 'next/link';
import { X, Search, Sun, Moon, User, Home, Grid, Mail } from 'lucide-react';
import { useTheme } from '@/components/context/ThemeContext';
import './MobileSidebar.css';

const MobileSidebar = ({ isOpen, onClose, onSearchOpen }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <div className="mobile-sidebar-overlay" onClick={onClose}>
      <div className="mobile-sidebar" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="mobile-sidebar-header">
          <div className="mobile-sidebar-logo">
            <Link href="/" onClick={handleLinkClick}>Onovateth</Link>
          </div>
          <button className="mobile-sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Enlaces de navegación */}
        <div className="mobile-sidebar-content">
          <nav className="mobile-sidebar-nav">
            <Link href="/" onClick={handleLinkClick}>Inicio</Link>
            <Link href="/categories" onClick={handleLinkClick}>Categorías</Link>
            <Link href="/contact" onClick={handleLinkClick}>Contacto</Link>
          </nav>

          {/* Separador */}
          <div className="mobile-sidebar-divider"></div>

          {/* Acciones con iconos */}
          <div className="mobile-sidebar-actions">
            <button className="mobile-sidebar-action" onClick={() => {
            onSearchOpen();
            onClose();
          }}>
            <Search size={20} />
            <span>Buscar</span>
          </button>

            <button onClick={handleThemeToggle} className="mobile-sidebar-action">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDarkMode ? 'Tema claro' : 'Tema oscuro'}</span>
            </button>

            <Link href="/login" onClick={handleLinkClick} className="mobile-sidebar-action">
              <User size={20} />
              <span>Mi cuenta</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;