import { useState } from "react";

const API_URL = "/api";

function Registro() {
  const [estado, setEstado] = useState("");

  const registrarUsuario = async (event) => {
    event.preventDefault();
    setEstado("Guardando registro...");

    const form = event.currentTarget;
    const datos = {
      nombre: form.nombre.value,
      correo: form.correo.value,
      telefono: form.telefono.value,
      password: form.password.value,
    };

    try {
      const respuesta = await fetch(`${API_URL}/registro`, {
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
      setEstado(error.message || "No se pudo crear la cuenta.");
    }
  };

  return (
    <section>
      <h2>Registrate</h2>

      <form className="formulario" onSubmit={registrarUsuario}>
        <input name="nombre" type="text" placeholder="Nombre completo" required />
        <input name="correo" type="email" placeholder="Correo electronico" required />
        <input name="telefono" type="tel" placeholder="Telefono" required />
        <input name="password" type="password" placeholder="Contrasena" required />

        <button className="btn" type="submit">
          Crear cuenta
        </button>

        {estado && <p className="estado-formulario">{estado}</p>}
      </form>
    </section>
  );
}

export default Registro;
