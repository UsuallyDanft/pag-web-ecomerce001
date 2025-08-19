import { queryAPI } from './strapi';

export async function getNewestProducts(limit = 10) {
  // 1. Calcular la fecha de hace una semana
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoISO = oneWeekAgo.toISOString(); // Convertir a formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ) que Strapi entiende

  // 2. Construir la URL de la API con el nuevo filtro y ordenación
  let apiPath = `/api/products?populate[images][fields][0]=url&populate[categories][fields][0]=name`;
  apiPath += `&filters[createdAt][$gte]=${oneWeekAgoISO}`; // [gte] = Greater Than or Equal (mayor o igual que)
  apiPath += `&sort=createdAt:desc`; // Ordenar para mostrar los más nuevos primero
  apiPath += `&pagination[limit]=${limit}`; // Limitar el número de resultados para el slider

  const data = await queryAPI(apiPath);

  if (data && data.data) {
    // El resto de la lógica para mapear los datos es la misma
    return data.data.map(product => {
      let imageUrl = '/placeholder.png';
      let allImages = [];
      
      // La respuesta de la API ya no usa 'attributes' si no está anidado, así que simplificamos el acceso.
      const images = product.images || []; 
      if (Array.isArray(images) && images.length > 0) {
        allImages = images.map(img => 
          img.url ? new URL(img.url, process.env.NEXT_PUBLIC_STRAPI_HOST).href : null
        ).filter(url => url !== null);
        
        if (allImages.length > 0) {
          imageUrl = allImages[0];
        }
      }
      
      const categories = product.categories || [];
      
      return {
        id: product.id,
        slug: product.slug || '',
        name: product.name || 'Sin nombre',
        description: product.description || '',
        price: typeof product.price === 'number' ? product.price : 0,
        imageUrl,
        allImages,
        categories,
        stock: product.stock || 0,
      };
    });
  }
  return [];
}