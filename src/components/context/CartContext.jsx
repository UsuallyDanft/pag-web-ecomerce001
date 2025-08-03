"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial del carrito
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Tipos de acciones
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    case CART_ACTIONS.CLEAR_CART:
      return initialState;
    case CART_ACTIONS.LOAD_CART:
      return action.payload;
    default:
      return state;
  }
};

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Funciones para manipular el carrito
  const addToCart = (product, quantity = 1) => {
    // Obtener la imagen principal del producto
    let imageUrl = '';
    const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST;
    
    if (product.images && product.images.length > 0) {
      // Si hay imágenes, usar la primera
      const firstImage = product.images[0];
      const imagePath = firstImage.attributes?.url || firstImage.url;
      if (imagePath && strapiHost) {
        imageUrl = new URL(imagePath, strapiHost).href;
      }
    } else if (product.attributes?.images && product.attributes.images.data && product.attributes.images.data.length > 0) {
      // Estructura alternativa de Strapi
      const firstImage = product.attributes.images.data[0];
      const imagePath = firstImage.attributes?.url || firstImage.url;
      if (imagePath && strapiHost) {
        imageUrl = new URL(imagePath, strapiHost).href;
      }
    } else if (product.imageUrl) {
      // Fallback para estructura simple
      imageUrl = product.imageUrl;
    }

    const cartItem = {
      id: product.id,
      name: product.attributes?.name || product.name,
      price: product.attributes?.price || product.price,
      image: imageUrl,
      slug: product.attributes?.slug || product.slug,
      quantity,
      stock: product.attributes?.stock || product.stock || 0,
    };
    
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Función para obtener la cantidad de un producto en el carrito
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity, // Agregar la nueva función al contexto
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 