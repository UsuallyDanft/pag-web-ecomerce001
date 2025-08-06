import { queryAPI } from './strapi';

export async function getBannerImageUrl() {
  try {
    console.log("Obteniendo datos del banner...");
    const data = await queryAPI('/api/banner-home?populate=*');
    console.log("Respuesta completa de la API:", JSON.stringify(data, null, 2));
    
    // Acceso directo a la URL de la imagen basado en la estructura real de la respuesta
    const imageUrl = data?.data?.image?.url || 
                   data?.data?.attributes?.image?.data?.attributes?.url;
    
    if (!imageUrl) {
      console.error("No se pudo obtener la URL de la imagen del banner");
      console.error("Estructura de datos recibida:", data);
      return null;
    }

    const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST;
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${strapiHost}${imageUrl}`;
    
    console.log("URL completa de la imagen:", fullUrl);
    return fullUrl;
  } catch (error) {
    console.error("Error al obtener la imagen del banner:", error);
    return null;
  }
}