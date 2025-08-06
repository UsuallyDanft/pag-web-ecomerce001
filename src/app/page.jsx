"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductSlider from '@/components/shop/ProductSlider';
import './page.css';
import { getSliderProductsNewTag } from '@/components/lib/SliderApiNewTag';
import { getWelcomeData } from '@/components/lib/WelcomeApi';
import { getBannerImageUrl } from '@/components/lib/BannerHomeApi';

export default function Page() {
  const [welcomeData, setWelcomeData] = useState({ title: "", description: "" });
  const [productos, setProductos] = useState([]);
  
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cargarDatos = async () => {
      // Las llamadas existentes no cambian
      const welcomeDataObtenida = await getWelcomeData();
      setWelcomeData(welcomeDataObtenida);
      
      const productosObtenidos = await getSliderProductsNewTag();
      setProductos(productosObtenidos);

      // 3. LLAMAR a la API para obtener la URL de la imagen
      const imageUrl = await getBannerImageUrl();
    setBannerImageUrl(imageUrl);
    };

    cargarDatos();
  }, []);

  return (
    <div>
      <div className='presentBanner'>
        {/* ... banner de bienvenida ... */}
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

      {/* banner de imagen publicitaria */}
      {bannerImageUrl && (
  <div className='BannerImage'>
    <img src={bannerImageUrl} alt="Banner publicitario" />
  </div>
)}
      
      <ProductSlider
        title="Añadidos Recientemente"
        products={productos}
        onSeeMore={() => router.push('/products')}
      />
    </div>
  );
}