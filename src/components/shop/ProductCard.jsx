import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Bookmark } from 'lucide-react';
import { useCart } from '@/components/context/CartContext';
import './ProductCard.css'; // Estilos específicos para la tarjeta

const ProductCard = ({ product }) => {
  console.log("ID del producto en Card:", product.id);
  const router = useRouter(); // 2. Inicializa el router
  const { addToCart, getItemQuantity, items } = useCart();

  // Desestructuramos los datos del producto para un acceso más fácil
  const { imageUrl, name, description, price, allImages = [], stock } = product;

  // Calcular stock real disponible (stock original - cantidad en carrito)
  const originalStock = stock || 0;
  const quantityInCart = getItemQuantity(product.id);
  const availableStock = originalStock - quantityInCart;
  
  // Estado local para el stock actual
  const [currentStock, setCurrentStock] = useState(availableStock);
  
  // Estado para manejar la imagen actual
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Actualizar stock cuando cambie el carrito
  useEffect(() => {
    const newQuantityInCart = getItemQuantity(product.id);
    const newAvailableStock = originalStock - newQuantityInCart;
    setCurrentStock(newAvailableStock);
  }, [items, product.id, originalStock, getItemQuantity]);
  
  // Obtener la imagen actual
  const currentImage = allImages.length > 0 ? allImages[currentImageIndex] : imageUrl;
  
  // Función para manejar clic en la imagen
  const handleImageClick = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

    // 3. Función para navegar a la página de detalles
    const handleViewDetails = () => {
      console.log("Navegando al detalle del producto (slug):", product.slug);
      router.push(`/products/${product.slug}`);
    };

  // Función para añadir al carrito
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evitar que se active el handleViewDetails
    
    // Validar stock antes de agregar al carrito
    if (currentStock <= 0) {
      return; // No agregar al carrito si no hay stock
    }
    
    // Agregar al carrito
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <img 
        src={currentImage} 
        alt={`${name} - Imagen ${currentImageIndex + 1}`} 
        className="product-image" 
        onClick={handleImageClick}
      />
      
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">${price.toFixed(2)}</p>
        <p className="product-stock">{currentStock} unidades</p>
        <div className="product-actions">
          <button className="details-btn" onClick={handleViewDetails}>Ver detalles</button>
          <div className="icon-buttons-group">
            <button className="icon-btn">
              <Bookmark className="icon-bookmark" />
            </button>
            <button className="icon-btn" onClick={handleAddToCart}>
              <ShoppingCart className="icon-cart" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;