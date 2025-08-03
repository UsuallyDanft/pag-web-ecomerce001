# Componente Breadcrumbs

Este directorio contiene dos componentes de breadcrumbs para la navegación:

## 1. Breadcrumbs.jsx (Automático)

El componente principal que se muestra automáticamente en todas las páginas excepto en la home (`/`).

### Características:
- **Navegación automática**: Se genera automáticamente basado en la URL actual
- **Información de productos**: Muestra el nombre real del producto y su categoría
- **Parámetros de búsqueda**: Maneja filtros de categorías en la página de productos
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Accesibilidad**: Incluye atributos ARIA para lectores de pantalla

### Uso:
```jsx
// Se incluye automáticamente en el layout principal
// No necesitas importarlo en páginas individuales
```

### Rutas que maneja:
- `/products` → Inicio / Productos
- `/products?category=electronics` → Inicio / Electronics
- `/products/laptop-gaming` → Inicio / Productos / Categoría / Laptop Gaming
- `/categories` → Inicio / Categorías
- `/checkout` → Inicio / Carrito

## 2. SimpleBreadcrumbs.jsx (Manual)

Componente para casos específicos donde necesitas control total sobre los breadcrumbs.

### Uso:
```jsx
import SimpleBreadcrumbs from '@/components/shop/SimpleBreadcrumbs';

const MyPage = () => {
  const breadcrumbItems = [
    { name: 'Inicio', href: '/', isActive: false },
    { name: 'Mi Sección', href: '/mi-seccion', isActive: false },
    { name: 'Página Actual', href: '/mi-seccion/pagina', isActive: true }
  ];

  return (
    <div>
      <SimpleBreadcrumbs items={breadcrumbItems} />
      {/* Contenido de la página */}
    </div>
  );
};
```

### Estructura de items:
```jsx
const items = [
  {
    name: 'Nombre visible',
    href: '/ruta-de-navegacion',
    isActive: false // true para la página actual
  }
];
```

## Estilos CSS

Los estilos están en `Breadcrumbs.css` e incluyen:

- **Tema claro/oscuro**: Se adapta automáticamente
- **Responsive**: Se ajusta a móviles y tablets
- **Animaciones**: Efectos hover suaves
- **Accesibilidad**: Colores con buen contraste

## Variables CSS disponibles:

```css
:root {
  --primary-color: #007bff;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --bg-secondary: #f8f9fa;
  --border-color: #e9ecef;
  --hover-bg: rgba(0, 123, 255, 0.1);
  --current-bg: rgba(0, 123, 255, 0.1);
}
```

## Ejemplos de implementación:

### En una página de producto específico:
```jsx
const breadcrumbItems = [
  { name: 'Inicio', href: '/', isActive: false },
  { name: 'Productos', href: '/products', isActive: false },
  { name: 'Electrónicos', href: '/products?category=electronics', isActive: false },
  { name: 'Laptop Gaming', href: '/products/laptop-gaming', isActive: true }
];
```

### En una página de categoría:
```jsx
const breadcrumbItems = [
  { name: 'Inicio', href: '/', isActive: false },
  { name: 'Categorías', href: '/categories', isActive: false },
  { name: 'Electrónicos', href: '/products?category=electronics', isActive: true }
];
```

## Notas importantes:

1. **No se muestra en la home**: El componente automático no se renderiza en `/`
2. **SEO friendly**: Los breadcrumbs ayudan con el SEO y la navegación
3. **Performance**: El componente automático hace fetch solo cuando es necesario
4. **Fallback**: Si no puede obtener información del producto, usa el slug de la URL 