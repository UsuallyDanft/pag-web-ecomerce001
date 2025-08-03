"use client";
import React from 'react';
import Link from 'next/link';
import './Breadcrumbs.css';

const SimpleBreadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.isActive ? (
              <span className="breadcrumb-current" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className="breadcrumb-link">
                {item.name}
              </Link>
            )}
            {index < items.length - 1 && (
              <span className="breadcrumb-separator">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default SimpleBreadcrumbs; 