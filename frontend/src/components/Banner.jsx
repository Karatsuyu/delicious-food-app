import { useState, useEffect } from "react";
import "./Banner.css";

const images = [
  "/assets/banner1.jpg",
  "/assets/banner2.jpg",
  "/assets/banner3.jpg",
  "/assets/banner4.jpg",
];

function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // cambia cada 4 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner">
      <img
        src={images[current]}
        alt={`Banner ${current + 1}`}
        className="banner1"
      />
      <div className="banner-text">
        <h1>¡Bienvenido a Delicious Food!</h1>
        <p>Explora nuestras promociones y personaliza tu pedido</p>
        <button className="banner-btn">Ver menú</button>
      </div>
    </div>
  );
}

export default Banner;