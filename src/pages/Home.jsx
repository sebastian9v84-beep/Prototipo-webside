import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2>Bienvenido a V&S Custom</h2>

        <p>
          Convierte lo cotidiano en algo especial. <br />
          Personaliza ropa, accesorios y regalos con tu esencia.
        </p>

        <Link to="/categorias" className="btn">
          Ver productos
        </Link>
      </div>
    </section>
  );
}

export default Home;
