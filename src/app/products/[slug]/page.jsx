"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { queryAPI } from '@/components/lib/strapi';
import ProductImageGallery from '@/components/shop/ProductImageGallery';
import ProductInfoActions from '@/components/shop/ProductInfoActions';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const data = await queryAPI(`/api/products?filters[slug][$eq]=${slug}&populate=*`);
          if (data && data.data && data.data.length > 0) {
            setProduct(data.data[0]);
          } else {
            setProduct(null);
          }
        } catch (error) {
          setProduct(null);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [slug]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '5rem' }}>Cargando producto...</p>;
  if (!product) return <p style={{ textAlign: 'center', marginTop: '5rem' }}>Producto no encontrado.</p>;

  return (
    <div className="product-detail-page">
      <ProductImageGallery images={product.images || []} />
      <ProductInfoActions product={product}/>

    </div>
  );
}