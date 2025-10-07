import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <div className="footer-logo">
            <span className="logo-text">Delicious</span>
            <br />
            <span className="logo-sub">Food 🍔</span>
          </div>
          <h3>Delicious Food - El sabor que tú eliges</h3>
          <p>
            En Delicious Food disfrutas de nuestra variedad de productos.
          </p>
          <p>
            Contamos con nuestro sistema de personalización de pedidos, donde
            eliges cada detalle de tu comida a tu gusto: (masa, salsas,
            ingredientes y acompañamientos).
          </p>
          <p>Vive la mejor experiencia, hecha especialmente para ti!</p>
        </div>

        <div className="footer-column">
          <h3>Contacto</h3>
          <p>
            <strong>Delicious Food S.A.S</strong>
          </p>
          <p>Calle 2a 00-00</p>
          <p>En cualquier lugar del mundo</p>
          <p>Ventas institucionales</p>
          <p>Llámanos: 300 000 0000</p>
          <p>
            <a href="#contacto">Contáctanos Aquí</a>
          </p>
          <p>
            <a href="#factura">Descarga tu Factura</a>
          </p>
          <p>
            <a href="#nutricion">Información nutricional</a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Delicious Food © 2025 - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default Footer;