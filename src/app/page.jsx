"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductSlider from '@/components/shop/ProductSlider';
import './page.css';
import { getSliderProductsNewTag } from '@/components/lib/SliderApiNewTag';
import { getWelcomeData } from '@/components/lib/WelcomeApi';

export default function Page() {
  const [welcomeData, setWelcomeData] = useState({ title: "", description: "" });
  const [productos, setProductos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const cargarDatos = async () => {
      const welcomeDataObtenida = await getWelcomeData();
      setWelcomeData(welcomeDataObtenida);
      
      const productosObtenidos = await getSliderProductsNewTag();
      setProductos(productosObtenidos);
    };

    cargarDatos();
  }, []);

  return (
    <div>
      <div className='presentBanner'>
        <div className='textBanner'>
          <h1>{welcomeData.title}</h1>
          <p>{welcomeData.description}</p>
        </div>
        <Link href="/products">
          <button className='presentBnButton'>
            Explorar
          </button>
        </Link>
        
      </div>
      
      {/* Sección del Slider de Añadidos Recientemente */}
      <ProductSlider
        title="Añadidos Recientemente"
        products={productos}
        onSeeMore={() => router.push('/products')}
      />
    </div>
  );
}