"use client";
import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import './Breadcrumbs.css';

const BreadcrumbsWrapper = ({ className = '' }) => {
  return <div className={`breadcrumbs-wrapper ${className}`}><Breadcrumbs /></div>;
};

export default BreadcrumbsWrapper;