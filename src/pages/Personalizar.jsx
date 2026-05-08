import { useEffect, useMemo, useState } from "react";

const API_URL = "/api";

const modelosIniciales = [
  { id: "camisa", nombre: "Camisa blanca", precio: 50000, tallas: ["S", "M", "L", "XL"] },
  { id: "hoodie", nombre: "Hoodie blanco", precio: 95000, tallas: ["S", "M", "L", "XL"] },
  { id: "gorra", nombre: "Gorra blanca", precio: 42000, tallas: ["Unica"] },
  { id: "mug", nombre: "Mug blanco", precio: 35000, tallas: ["11 oz"] },
  { id: "termo", nombre: "Termo blanco", precio: 60000, tallas: ["500 ml", "750 ml"] },
];

const formas = [
  { id: "original", nombre: "Contorno de imagen" },
  { id: "rectangular", nombre: "Rectangular" },
  { id: "nube", nombre: "Nube" },
  { id: "sello", nombre: "Sello circular" },
  { id: "rayo", nombre: "Rayo dinamico" },
];

const coloresProducto = [
  { id: "blanco", nombre: "Blanco", valor: "#ffffff" },
  { id: "negro", nombre: "Negro", valor: "#171717" },
  { id: "azul", nombre: "Azul", valor: "#2f6fa8" },
  { id: "gris", nombre: "Gris", valor: "#9aa3ad" },
  { id: "cafe", nombre: "Cafe", valor: "#7a4a2d" },
  { id: "rojo", nombre: "Rojo", valor: "#b83232" },
];

function Personalizar({ agregarCarrito }) {
  const [modelos, setModelos] = useState(modelosIniciales);
  const [modeloId, setModeloId] = useState("camisa");
  const [talla, setTalla] = useState("S");
  const [color, setColor] = useState(coloresProducto[0]);
  const [imagen, setImagen] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [correo, setCorreo] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [estado, setEstado] = useState("");
  const [diseno, setDiseno] = useState({
    x: 50,
    y: 50,
    ancho: 42,
    alto: 42,
    forma: "original",
    ubicacion: "frente",
    modoRealista: false,
  });

  const modelo = useMemo(() => {
    return modelos.find((item) => item.id === modeloId) || modelos[0];
  }, [modeloId, modelos]);

  const nombreProducto = modelo.id.charAt(0).toUpperCase() + modelo.id.slice(1);
  const nombreModeloPersonalizado = `${nombreProducto} ${color.nombre}`;

  useEffect(() => {
    fetch(`${API_URL}/modelos-personalizables`)
      .then((respuesta) => respuesta.json())
      .then((resultado) => {
        if (resultado.ok) setModelos(resultado.modelos);
      })
      .catch(() => setModelos(modelosIniciales));
  }, []);

  useEffect(() => {
    const medidaInicial = modelo.id === "gorra" ? 30 : 42;
    setTalla(modelo.tallas[0]);
    setColor(coloresProducto[0]);
    setDiseno({
      x: 50,
      y: 50,
      ancho: medidaInicial,
      alto: medidaInicial,
      forma: "original",
      ubicacion: "frente",
      modoRealista: false,
    });
  }, [modelo]);

  const cargarImagen = (event) => {
    const archivo = event.target.files[0];
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setEstado("Sube un archivo de imagen valido.");
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      setImagen(lector.result);
      setEstado("");
    };
    lector.readAsDataURL(archivo);
  };

  const actualizarDiseno = (campo, valor) => {
    if (campo === "forma") {
      setDiseno({
        ...diseno,
        forma: valor,
        x: 50,
        y: 50,
      });
      return;
    }

    setDiseno({
      ...diseno,
      [campo]: campo === "ubicacion" ? valor : Number(valor),
    });
  };

  const activarRealismoIA = () => {
    if (!imagen) {
      setEstado("Sube una imagen antes de generar la vista realista.");
      return;
    }

    setDiseno({
      ...diseno,
      modoRealista: !diseno.modoRealista,
    });

    setEstado(
      diseno.modoRealista
        ? "Vista realista desactivada."
        : "Vista realista aplicada al mockup."
    );
  };

  const guardarPersonalizacion = async () => {
    if (!imagen) {
      setEstado("Sube una imagen para personalizar el producto.");
      return null;
    }

    if (!nombreCliente || !correo) {
      setEstado("Escribe tu nombre y correo para guardar la personalizacion.");
      return null;
    }

    setEstado("Guardando personalizacion...");

    try {
      const respuesta = await fetch(`${API_URL}/personalizaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelo: modelo.id,
          talla,
          color: color.nombre,
          nombreCliente,
          correo,
          instrucciones,
          imagen,
          diseno,
        }),
      });

      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.mensaje);

      setEstado(resultado.mensaje);
      return resultado.personalizacion;
    } catch (error) {
      setEstado(error.message || "No se pudo guardar la personalizacion.");
      return null;
    }
  };

  const agregarPersonalizadoAlCarrito = async () => {
    const personalizacion = await guardarPersonalizacion();
    if (!personalizacion) return;

    agregarCarrito({
      nombre: `${nombreModeloPersonalizado} personalizado`,
      detalles: instrucciones || `Producto personalizado en color ${color.nombre}.`,
      imagen,
      precio: modelo.precio,
      talla,
      color: color.nombre,
      ubicacion: diseno.ubicacion,
      personalizacionId: personalizacion.id,
      diseno,
    });

    setEstado("Personalizacion guardada y agregada al carrito.");
  };

  const renderDiseno = () => (
    <div className={`zona-estampado forma-${diseno.forma}`}>
      {imagen && (
        <img
          className={`imagen-estampado ${diseno.modoRealista ? "imagen-realista" : ""}`}
          src={imagen}
          alt="Diseno subido"
          style={{
            left: `${diseno.x}%`,
            top: `${diseno.y}%`,
            width: `${diseno.ancho}%`,
            height: `${diseno.alto}%`,
          }}
        />
      )}
    </div>
  );

  const mostrarFrenteEspalda = modelo.id === "camisa" || modelo.id === "hoodie";

  return (
    <section className="personalizar">
      <h2>Personaliza tu producto</h2>

      <div className="personalizador">
        <div className="mockup-panel">
          {mostrarFrenteEspalda ? (
            <div className="mockup-galeria">
              <div
                className={`mockup-prenda mockup-${modelo.id} mockup-frente ${diseno.modoRealista ? "mockup-realista" : ""}`}
                style={{ "--producto-color": color.valor }}
              >
                {diseno.ubicacion === "frente" && renderDiseno()}
                <span>Frente</span>
              </div>

              <div
                className={`mockup-prenda mockup-${modelo.id} mockup-espalda`}
                style={{ "--producto-color": color.valor }}
              >
                {diseno.ubicacion === "espalda" && renderDiseno()}
                <span>Espalda</span>
              </div>
            </div>
          ) : (
            <div
              className={`mockup mockup-${modelo.id} ${diseno.modoRealista ? "mockup-realista" : ""}`}
              style={{ "--producto-color": color.valor }}
            >
              {renderDiseno()}
            </div>
          )}

          <p className="mockup-nombre">{nombreModeloPersonalizado}</p>
          <p className="mockup-color">Color: {color.nombre}</p>
          <p className="precio">${modelo.precio.toLocaleString("es-CO")}</p>
        </div>

        <div className="controles-personalizar">
          <label>
            Producto
            <select value={modeloId} onChange={(event) => setModeloId(event.target.value)}>
              {modelos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <div className="nombre-modelo">
            <span>Nombre del modelo</span>
            <strong>{nombreModeloPersonalizado}</strong>
          </div>

          <label>
            Talla o medida
            <select value={talla} onChange={(event) => setTalla(event.target.value)}>
              {modelo.tallas.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Color
            <select
              value={color.id}
              onChange={(event) => {
                const colorSeleccionado = coloresProducto.find(
                  (item) => item.id === event.target.value
                );
                setColor(colorSeleccionado || coloresProducto[0]);
              }}
            >
              {coloresProducto.map((item) => (
                <option key={item.id} value={item.id}>{item.nombre}</option>
              ))}
            </select>
          </label>

          <label>
            Imagen del diseno
            <input type="file" accept="image/*" onChange={cargarImagen} />
          </label>

          {mostrarFrenteEspalda && (
            <label>
              Ubicacion de la imagen
              <select
                value={diseno.ubicacion}
                onChange={(event) => actualizarDiseno("ubicacion", event.target.value)}
              >
                <option value="frente">Frente</option>
                <option value="espalda">Espalda</option>
              </select>
            </label>
          )}

          <label>
            Forma de la imagen
            <select value={diseno.forma} onChange={(event) => actualizarDiseno("forma", event.target.value)}>
              {formas.map((forma) => (
                <option key={forma.id} value={forma.id}>{forma.nombre}</option>
              ))}
            </select>
          </label>

          <label>
            Mover horizontal
            <input type="range" min="10" max="90" value={diseno.x} onChange={(event) => actualizarDiseno("x", event.target.value)} />
          </label>

          <label>
            Mover vertical
            <input type="range" min="10" max="90" value={diseno.y} onChange={(event) => actualizarDiseno("y", event.target.value)} />
          </label>

          <label>
            Ancho de imagen
            <input type="range" min="12" max="95" value={diseno.ancho} onChange={(event) => actualizarDiseno("ancho", event.target.value)} />
          </label>

          <label>
            Alto de imagen
            <input type="range" min="12" max="95" value={diseno.alto} onChange={(event) => actualizarDiseno("alto", event.target.value)} />
          </label>

          <button className="btn ia-btn" type="button" onClick={activarRealismoIA}>
            {diseno.modoRealista ? "Quitar vista realista" : "Generar vista realista IA"}
          </button>

          <input type="text" placeholder="Nombre del cliente" value={nombreCliente} onChange={(event) => setNombreCliente(event.target.value)} />
          <input type="email" placeholder="Correo del cliente" value={correo} onChange={(event) => setCorreo(event.target.value)} />
          <textarea rows="4" placeholder="Instrucciones especiales" value={instrucciones} onChange={(event) => setInstrucciones(event.target.value)}></textarea>

          <div className="acciones-personalizar">
            <button className="btn" type="button" onClick={guardarPersonalizacion}>Guardar diseno</button>
            <button className="btn pagar-btn" type="button" onClick={agregarPersonalizadoAlCarrito}>Agregar al carrito</button>
          </div>

          {estado && <p className="estado-formulario">{estado}</p>}
        </div>
      </div>
    </section>
  );
}

export default Personalizar;
