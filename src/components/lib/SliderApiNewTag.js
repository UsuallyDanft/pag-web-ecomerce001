import { queryAPI } from './strapi';

export async function getSliderProductsNewTag() {
  let apiPath = '/api/products?populate=*';
  apiPath += `&filters[tags][name][$eq]=Nuevo`;

  const data = await queryAPI(apiPath);

  if (data && data.data) {
    return data.data.map(product => {
      let imageUrl = '/placeholder.png';
      let allImages = [];
      const images = product.images || product.attributes?.images || [];
      if (Array.isArray(images) && images.length > 0) {
        allImages = images.map(img => {
          if (img.url) {
            return new URL(img.url, process.env.NEXT_PUBLIC_STRAPI_HOST).href;
          }
          return null;
        }).filter(url => url !== null);
        if (allImages.length > 0) {
          imageUrl = allImages[0];                                
        }
      }
      const categories = product.categories || product.attributes?.categories || [];
      return {
        id: product.id,
        slug: product.slug || product.attributes?.slug || '',
        name: product.name || product.attributes?.name || 'Sin nombre',
        description: product.description || product.attributes?.description || '',
        price: typeof (product.price || product.attributes?.price) === 'number' ? (product.price || product.attributes?.price) : 0,
        imageUrl,
        allImages,
        categories,
        stock: product.stock || product.attributes?.stock || 0, // Agregado el stock
      };
    });
  }
  return [];
} 