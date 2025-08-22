"use client";
// 👇 PASO 2.1: Importa lo necesario de React y GSAP
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductSlider from '@/components/shop/ProductSlider';
import './page.css';
import { getNewestProducts } from '@/components/lib/SliderApiNewP'; 
import { getWelcomeData } from '@/components/lib/WelcomeApi';
import { getBannerImageUrl } from '@/components/lib/BannerHomeApi';

// 👇 PASO 2.2: Registra el plugin de ScrollTrigger una sola vez
gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const [welcomeData, setWelcomeData] = useState({ title: "", description: "" });
  const [productos, setProductos] = useState([]);
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const router = useRouter();

  // 👇 PASO 2.3: Crea una referencia para el banner
  const bannerRef = useRef(null);

  // Este useEffect para cargar datos se mantiene igual
  useEffect(() => {
    const cargarDatos = async () => {
      const welcomeDataObtenida = await getWelcomeData();
      setWelcomeData(welcomeDataObtenida);
      
      const productosObtenidos = await getNewestProducts(); 
      setProductos(productosObtenidos);

      const imageUrl = await getBannerImageUrl();
      setBannerImageUrl(imageUrl);
    };

    cargarDatos();
  }, []);

  // 👇 PASO 2.4: Añade useLayoutEffect para la animación
  useLayoutEffect(() => {
    // Usamos gsap.context() para un manejo seguro y una limpieza automática
    const ctx = gsap.context(() => {
      gsap.to(bannerRef.current, { // Animamos el elemento referenciado
        borderRadius: "0 0 50% 50%",
        ease: "none", // La animación debe ser lineal al scroll
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          // markers: true, // Descomenta esto para depurar
        },
      });
    });

    // La función de limpieza que se ejecuta cuando el componente se desmonta
    return () => ctx.revert(); 
  }, []); // El array vacío asegura que se ejecute solo una vez

  return (
    <div>
      {/* 👇 PASO 2.5: Asigna la referencia al elemento DIV */}
      <div className='presentBanner' ref={bannerRef}>
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
      
      {/* El resto de tu componente no cambia */}
      <ProductSlider
        title="Añadidos Recientemente"
        products={productos}
        onSeeMore={() => router.push('/products')}
      />

      {bannerImageUrl && (
        <div className='BannerImage'>
          <img src={bannerImageUrl} alt="Banner publicitario" />
        </div>
      )}
    </div>
  );
}