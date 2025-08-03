"use client";

import React, { useState } from 'react';

const ProductImageGallery = ({ images }) => {
  if (!images || images.length === 0) {
    return <div className="gallery-container"><img src="/placeholder.png" alt="Producto" /></div>;
  }

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST;

  return (
    <div className="gallery-container">
      <div className="main-image-wrapper">
        <img 
          src={new URL(selectedImage.attributes?.url || selectedImage.url, strapiHost).href} 
          alt={selectedImage.attributes?.alternativeText || selectedImage.alternativeText || 'Imagen principal del producto'} 
        />
      </div>
      <div className="thumbnail-wrapper">
        {images.map(image => (
          <img
            key={image.id}
            src={new URL(
              image.attributes?.formats?.thumbnail?.url || image.formats?.thumbnail?.url || image.attributes?.url || image.url,
              strapiHost
            ).href}
            alt={image.attributes?.alternativeText || image.alternativeText || 'Miniatura del producto'}
            className={selectedImage.id === image.id ? 'active' : ''}
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;