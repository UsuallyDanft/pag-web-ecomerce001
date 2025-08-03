export async function queryAPI(path) {
    const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST;
    const strapiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  
    if (!strapiHost) {
      console.error("Error: El host de Strapi no está configurado.");
      return null;
    }
    if (!strapiToken) {
      console.error("Error: El token de la API de Strapi no está configurado.");
      return null;
    }
  
    const url = new URL(path, strapiHost);
  
    try {
      const response = await fetch(url.href, {
        headers: {
          'Authorization': `Bearer ${strapiToken}`,
        },
      });
  
      if (!response.ok) {
        console.error(`Error al hacer la petición: ${response.statusText}`);
        return null;
      }
  
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error("Error de conexión con la API de Strapi:", error);
      return null;
    }
  }