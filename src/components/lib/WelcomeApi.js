import { queryAPI } from './strapi';

export async function getWelcomeData() {
  const data = await queryAPI('/api/Home');
  console.log("Respuesta de la API (Home):", data);

  if (data && data.data) {
    const title = data.data.WelcomeTitle;
    const description = data.data.WelcomeDescription[0]?.children[0]?.text || "Descripción no disponible.";
    return { title, description };
  } else {
    return {
      title: "Bienvenido a Onovateth",
      description: "No se pudo cargar el contenido."
    };
  }
} 