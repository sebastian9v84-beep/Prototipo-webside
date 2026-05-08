import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Categorias from "./pages/Categorias.jsx";
import Carrito from "./pages/Carrito.jsx";
import Registro from "./pages/Registro.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Contacto from "./pages/Contacto.jsx";
import Personalizar from "./pages/Personalizar.jsx";

function App() {
  const [carrito, setCarrito] = useState([]);

  const agregarCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const eliminarProducto = (indiceProducto) => {
    setCarrito(carrito.filter((_, index) => index !== indiceProducto));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>V&S Custom</h1>

        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/categorias">Categorias</Link>
          <Link to="/personalizar">Personalizar</Link>
          <Link to="/carrito">Carrito</Link>
          <Link to="/registro">Registro</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categorias agregarCarrito={agregarCarrito} />} />
          <Route path="/categorias/:categoriaId" element={<Categorias agregarCarrito={agregarCarrito} />} />
          <Route path="/categorias/:categoriaId/:subcategoriaId" element={<Categorias agregarCarrito={agregarCarrito} />} />
          <Route path="/personalizar" element={<Personalizar agregarCarrito={agregarCarrito} />} />
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                vaciarCarrito={vaciarCarrito}
                eliminarProducto={eliminarProducto}
              />
            }
          />
          <Route path="/registro" element={<Registro />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </main>

      <footer>
        <p>&copy; 2026 V&S Custom. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
