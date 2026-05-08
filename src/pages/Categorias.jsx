import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "/api";

const productosCamisasFrontend = {
  cartoons: [
    {
      id: "camisa-retro-cartoon",
      nombre: "Camisa cartoon retro",
      detalles:
        "Estampado inspirado en caricaturas retro, con paleta llamativa y frase personalizada.",
      precio: 44000,
      tallas: ["S", "M", "L", "XL"],
      imagen:
        "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

const subcategoriasCamisasFrontend = [
  {
    id: "camisas-urbanas",
    nombre: "Camisas urbanas",
    descripcion: "Estilos callejeros con frases, graficos grandes y disenos modernos.",
    imagen:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    productos: [
      {
        id: "camisa-urban-street",
        nombre: "Camisa Urban Street",
        detalles: "Camisa con grafico frontal tipo streetwear, ideal para looks casuales.",
        precio: 52000,
        tallas: ["S", "M", "L", "XL"],
        imagen:
          "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "camisa-graffiti",
        nombre: "Camisa Graffiti",
        detalles: "Diseno urbano con letras estilo graffiti, colores fuertes y nombre opcional.",
        precio: 54000,
        tallas: ["S", "M", "L", "XL"],
        imagen:
          "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "camisa-oversize-city",
        nombre: "Camisa Oversize City",
        detalles: "Camisa oversize con estampado de ciudad, frase o logo personalizado.",
        precio: 58000,
        tallas: ["M", "L", "XL"],
        imagen:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "camisas-tematicas",
    nombre: "Camisas tematicas",
    descripcion: "Camisas para fechas especiales, eventos, grupos y celebraciones.",
    imagen:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
    productos: [
      {
        id: "camisa-cumpleanos",
        nombre: "Camisa de cumpleanos",
        detalles: "Diseno con edad, nombre, fecha y colores elegidos por el cliente.",
        precio: 50000,
        tallas: ["S", "M", "L", "XL"],
        imagen:
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "camisa-evento",
        nombre: "Camisa para evento",
        detalles: "Camisa personalizada para promociones, reuniones, ferias o equipos.",
        precio: 55000,
        tallas: ["S", "M", "L", "XL"],
        imagen:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "camisa-familiar",
        nombre: "Camisa familiar",
        detalles: "Diseno combinado para familia, viaje, celebracion o foto especial.",
        precio: 53000,
        tallas: ["XS", "S", "M", "L", "XL"],
        imagen:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];

const agregarProductosSinDuplicar = (productosBase, productosExtra) => [
  ...productosBase,
  ...productosExtra.filter(
    (productoExtra) =>
      !productosBase.some((productoBase) => productoBase.id === productoExtra.id)
  ),
];

const completarCamisasFrontend = (categorias) =>
  categorias.map((categoria) => {
    if (categoria.id !== "camisas") {
      return categoria;
    }

    const subcategoriasActualizadas = categoria.subcategorias.map((subcategoria) => ({
      ...subcategoria,
      productos: agregarProductosSinDuplicar(
        subcategoria.productos,
        productosCamisasFrontend[subcategoria.id] || []
      ),
    }));

    return {
      ...categoria,
      subcategorias: [
        ...subcategoriasActualizadas,
        ...subcategoriasCamisasFrontend.filter(
          (subcategoriaExtra) =>
            !subcategoriasActualizadas.some(
              (subcategoriaBase) => subcategoriaBase.id === subcategoriaExtra.id
            )
        ),
      ],
    };
  });

function Categorias({ agregarCarrito }) {
  const { categoriaId, subcategoriaId } = useParams();
  const [categorias, setCategorias] = useState([]);
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState({});
  const [estado, setEstado] = useState("Cargando catalogo...");

  useEffect(() => {
    fetch(`${API_URL}/categorias`)
      .then((respuesta) => respuesta.json())
      .then((resultado) => {
        if (!resultado.ok) {
          throw new Error("No se pudo cargar el catalogo.");
        }

        setCategorias(completarCamisasFrontend(resultado.categorias));
        setEstado("");
      })
      .catch((error) => {
        setEstado(
          `${error.message || "No se pudo conectar con el backend."} Verifica que el backend este activo con: npm run backend`
        );
      });
  }, []);

  const categoriaActual = categorias.find(
    (categoria) => categoria.id === categoriaId
  );

  const subcategoriaActual = categoriaActual?.subcategorias.find(
    (subcategoria) => subcategoria.id === subcategoriaId
  );

  const cambiarTalla = (idProducto, talla) => {
    setTallasSeleccionadas({
      ...tallasSeleccionadas,
      [idProducto]: talla,
    });
  };

  const agregarProducto = (producto) => {
    const talla = tallasSeleccionadas[producto.id] || producto.tallas[0];

    agregarCarrito({
      id: producto.id,
      nombre: producto.nombre,
      detalles: producto.detalles,
      imagen: producto.imagen,
      precio: producto.precio,
      talla,
    });
  };

  const rutaInvalida =
    !estado && ((categoriaId && !categoriaActual) || (subcategoriaId && !subcategoriaActual));

  return (
    <section>
      <h2>
        <Link className="titulo-categorias-btn" to="/categorias">
          Categorias
        </Link>
      </h2>

      {estado && <p className="estado-formulario">{estado}</p>}

      {rutaInvalida && (
        <p className="estado-formulario">
          No se encontro esa categoria. Vuelve a Categorias para seleccionar una opcion.
        </p>
      )}

      {!estado && !rutaInvalida && !categoriaId && (
        <div className="categorias">
          {categorias.map((categoria) => (
            <Link
              className="categoria categoria-click"
              key={categoria.id}
              to={`/categorias/${categoria.id}`}
            >
              <img src={categoria.imagen} alt={categoria.nombre} />
              <h3>{categoria.nombre}</h3>
              <p>{categoria.descripcion}</p>
            </Link>
          ))}
        </div>
      )}

      {!estado && !rutaInvalida && categoriaActual && !subcategoriaId && (
        <>
          <Link className="btn volver-btn" to="/categorias">
            Volver a categorias
          </Link>

          <h3 className="titulo-categoria">{categoriaActual.nombre}</h3>

          <div className="categorias">
            {categoriaActual.subcategorias.map((subcategoria) => (
              <Link
                className="categoria categoria-click"
                key={subcategoria.id}
                to={`/categorias/${categoriaActual.id}/${subcategoria.id}`}
              >
                <img src={subcategoria.imagen} alt={subcategoria.nombre} />
                <h3>{subcategoria.nombre}</h3>
                <p>{subcategoria.descripcion}</p>
              </Link>
            ))}
          </div>
        </>
      )}

      {!estado && !rutaInvalida && categoriaActual && subcategoriaActual && (
        <>
          <Link className="btn volver-btn" to={`/categorias/${categoriaActual.id}`}>
            Volver a {categoriaActual.nombre}
          </Link>

          <h3 className="titulo-categoria">
            {categoriaActual.nombre} / {subcategoriaActual.nombre}
          </h3>

          <div className="lista-productos">
            {subcategoriaActual.productos.map((producto) => (
              <div className="producto-detalle" key={producto.id}>
                <img src={producto.imagen} alt={producto.nombre} />

                <div className="producto-info">
                  <h3>{producto.nombre}</h3>
                  <p>{producto.detalles}</p>

                  <label>
                    Selecciona talla o medida:
                    <select
                      value={tallasSeleccionadas[producto.id] || producto.tallas[0]}
                      onChange={(event) => cambiarTalla(producto.id, event.target.value)}
                    >
                      {producto.tallas.map((talla) => (
                        <option key={talla} value={talla}>
                          {talla}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="precio">
                    ${producto.precio.toLocaleString("es-CO")}
                  </p>

                  <button className="btn" onClick={() => agregarProducto(producto)}>
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Categorias;
