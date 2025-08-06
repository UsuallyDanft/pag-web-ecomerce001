// src/components/shop/Footer.jsx
import './Footer.css'; 

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Para que el año se actualice solo
  return (
    <footer className="shop-footer">
      <div className="container">
        <p>&copy; {currentYear} Onovateth. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;