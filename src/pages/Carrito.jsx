import { useState } from "react";

const API_URL = "/api";

function Carrito({ carrito, vaciarCarrito, eliminarProducto }) {
  const [estado, setEstado] = useState("");
  const totalProductos = carrito.length;

  const totalPrecio = carrito.reduce((total, producto) => {
    return total + producto.precio;
  }, 0);

  const pagarPedido = async () => {
    if (carrito.length === 0) {
      setEstado("Agrega productos antes de pagar.");
      return;
    }

    setEstado("Creando pedido...");

    try {
      const respuesta = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productos: carrito,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje);
      }

      setEstado(`Pedido creado. Total: $${resultado.pedido.total.toLocaleString("es-CO")}`);
      vaciarCarrito();
    } catch (error) {
      setEstado(error.message || "No se pudo crear el pedido.");
    }
  };

  return (
    <section>
      <h2>Carrito</h2>

      <div className="carrito">
        <h3>Productos seleccionados</h3>

        {carrito.length === 0 ? (
          <p>Tu carrito esta vacio</p>
        ) : (
          <div className="carrito-lista">
            {carrito.map((producto, index) => (
              <div className="carrito-producto" key={index}>
                <img src={producto.imagen} alt={producto.nombre} />

                <div className="carrito-info">
                  <h3>{producto.nombre}</h3>
                  <p>{producto.detalles}</p>
                  <p>
                    <strong>Talla/medida:</strong> {producto.talla}
                  </p>
                  {producto.color && (
                    <p>
                      <strong>Color:</strong> {producto.color}
                    </p>
                  )}
                  {producto.ubicacion && (
                    <p>
                      <strong>Ubicacion:</strong> {producto.ubicacion}
                    </p>
                  )}
                  <p className="carrito-precio">
                    ${producto.precio.toLocaleString("es-CO")}
                  </p>

                  <button
                    className="btn eliminar-producto-btn"
                    type="button"
                    onClick={() => eliminarProducto(index)}
                  >
                    Eliminar producto
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="carrito-resumen">
          <p>
            <strong>Total de productos:</strong> {totalProductos}
          </p>

          <p>
            <strong>Total a pagar:</strong> ${totalPrecio.toLocaleString("es-CO")}
          </p>

          <div className="carrito-botones">
            <button className="btn" onClick={vaciarCarrito}>
              Vaciar carrito
            </button>

            <button className="btn pagar-btn" onClick={pagarPedido}>
              Pagar
            </button>
          </div>

          {estado && <p className="estado-formulario">{estado}</p>}
        </div>
      </div>
    </section>
  );
}

export default Carrito;
