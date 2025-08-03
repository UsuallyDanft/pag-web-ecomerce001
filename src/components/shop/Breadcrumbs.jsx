"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  // Asegurar que el componente esté montado antes de usar hooks
  useEffect(() => {
    setMounted(true);
  }, []);

  // No mostrar breadcrumbs en la página principal o si no está montado
  if (!mounted || pathname === '/') {
    return null;
  }

  // Crear las rutas del breadcrumb
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(path => path !== '');
    const breadcrumbs = [
      { name: 'Inicio', href: '/', isActive: false }
    ];

    let currentPath = '';
    
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Mapear nombres más amigables para las rutas
      let displayName = path;
      
      // Mapear rutas específicas
      const routeMappings = {
        'products': 'Productos',
        'categories': 'Categorías',
        'checkout': 'Carrito',
        'cart': 'Carrito'
      };
      
      if (routeMappings[path]) {
        displayName = routeMappings[path];
      } else {
        // Capitalizar y reemplazar guiones por espacios
        displayName = path
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
      }
      
      const isActive = index === paths.length - 1;
      
      breadcrumbs.push({
        name: displayName,
        href: currentPath,
        isActive
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Manejar parámetros de búsqueda para categorías
  const categorySlug = searchParams.get('category');
  if (categorySlug && pathname === '/products') {
    // Reemplazar el breadcrumb de "Productos" con la categoría específica
    const productsBreadcrumb = breadcrumbs.find(b => b.name === 'Productos');
    if (productsBreadcrumb) {
      productsBreadcrumb.name = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      productsBreadcrumb.href = `/products?category=${categorySlug}`;
    }
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="breadcrumb-item">
            {breadcrumb.isActive ? (
              <span className="breadcrumb-current" aria-current="page">
                {breadcrumb.name}
              </span>
            ) : (
              <Link href={breadcrumb.href} className="breadcrumb-link">
                {breadcrumb.name}
              </Link>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="breadcrumb-separator">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 