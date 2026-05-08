import { useState } from "react";

const API_URL = "/api";

function Contacto() {
  const [estado, setEstado] = useState("");

  const enviarMensaje = async (event) => {
    event.preventDefault();
    setEstado("Enviando mensaje...");

    const form = event.currentTarget;
    const datos = {
      nombre: form.nombre.value,
      correo: form.correo.value,
      mensaje: form.mensaje.value,
    };

    try {
      const respuesta = await fetch(`${API_URL}/contacto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje);
      }

      setEstado(resultado.mensaje);
      form.reset();
    } catch (error) {
      setEstado(error.message || "No se pudo enviar el mensaje.");
    }
  };

  return (
    <section>
      <h2>Contacto</h2>

      <div className="contacto">
        <div className="contacto-info">
          <h3>Comunicate con nosotros</h3>
          <p><strong>WhatsApp:</strong> +57 300 000 0000</p>
          <p><strong>Correo:</strong> contacto@vscustom.com</p>
          <p><strong>Instagram:</strong> @vscustom</p>
          <p><strong>Horario:</strong> Lunes a sabado, 9:00 a.m. - 6:00 p.m.</p>
        </div>

        <form className="formulario" onSubmit={enviarMensaje}>
          <input name="nombre" type="text" placeholder="Tu nombre" required />
          <input name="correo" type="email" placeholder="Tu correo" required />
          <textarea name="mensaje" rows="5" placeholder="Escribe tu mensaje" required></textarea>

          <button className="btn" type="submit">
            Enviar mensaje
          </button>

          {estado && <p className="estado-formulario">{estado}</p>}
        </form>
      </div>
    </section>
  );
}

export default Contacto;
