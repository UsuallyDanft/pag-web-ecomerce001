import './globals.css';
import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';
import Breadcrumbs from '@/components/shop/Breadcrumbs'; // Importa el nuevo componente de Breadcrumbs
import { ThemeProvider } from '@/components/context/ThemeContext';
import { CartProvider } from '@/components/context/CartContext';

export const metadata = {
  title: 'Onovateth',
  description: 'Creada con Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <CartProvider>
            {/* 3. Agrega los contenedores para el layout */}
            <div className="page-container">
              <Header />
              <Breadcrumbs /> {/* Se incluye el componente de Breadcrumbs aquí */}
              <main className="content-wrap">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}