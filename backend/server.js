import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");
const DB_FILE = join(DATA_DIR, "db.json");
const PORT = 3001;

const categoriasCatalogo = [
  {
    id: "camisas",
    nombre: "Camisas",
    descripcion: "Prendas ligeras para estampados, frases, logos y disenos tematicos.",
    // aqui va la imagen de la categoria Camisas
    imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    subcategorias: [
      {
        id: "anime",
        nombre: "Anime",
        descripcion: "Disenos inspirados en personajes, escenas y estilos japoneses.",
        // aqui va la imagen de la subcategoria Anime
        imagen: "https://images.unsplash.com/photo-1608278047522-58806a6ac85b?auto=format&fit=crop&w=800&q=80",
        productos: [
          {
            id: "camisa-dragon-ball",
            nombre: "Camisa Dragon Ball Z",
            detalles: "Camisa personalizada con estampado de Goku, Vegeta o el personaje que prefieras.",
            precio: 45000,
            tallas: ["S", "M", "L", "XL"],
            // aqui va la imagen de Camisa Dragon Ball Z
            imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "camisa-naruto",
            nombre: "Camisa Naruto",
            detalles: "Diseno inspirado en anime, ideal para fans y regalos personalizados.",
            precio: 45000,
            tallas: ["S", "M", "L", "XL"],
            // aqui va la imagen de Camisa Naruto
            imagen: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "camisa-one-piece",
            nombre: "Camisa One Piece",
            detalles: "Estampado frontal con ilustracion de tripulacion, bandera o personaje.",
            precio: 48000,
            tallas: ["S", "M", "L", "XL"],
            // aqui va la imagen de Camisa One Piece
            imagen: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "cartoons",
        nombre: "Cartoons",
        descripcion: "Disenos animados, personajes divertidos y estilos coloridos.",
        // aqui va la imagen de la subcategoria Cartoons
        imagen: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80",
        productos: [
          {
            id: "camisa-cartoon-clasica",
            nombre: "Camisa cartoon clasica",
            detalles: "Camisa con ilustraciones estilo caricatura, colores vivos y texto personalizado.",
            precio: 40000,
            tallas: ["S", "M", "L", "XL"],
            // aqui va la imagen de Camisa cartoon clasica
            imagen: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "camisa-chicas-ninos",
            nombre: "Chicas y ninos",
            detalles: "Camisa con disenos tiernos, juveniles o infantiles para chicas y ninos.",
            precio: 42000,
            tallas: ["XS", "S", "M", "L"],
            // aqui va la imagen de Chicas y ninos
            imagen: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "camisa-retro-cartoon",
            nombre: "Camisa cartoon retro",
            detalles: "Estampado inspirado en caricaturas retro, con paleta llamativa y frase personalizada.",
            precio: 44000,
            tallas: ["S", "M", "L", "XL"],
            // aqui va la imagen de Camisa cartoon retro
            imagen: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "camisas-urbanas",
        nombre: "Camisas urbanas",
        descripcion: "Estilos callejeros con frases, graficos grandes y disenos modernos.",
        // aqui va la imagen de la subcategoria Camisas urbanas
        imagen: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        productos: [
          {
            id: "camisa-urban-street",
            nombre: "Camisa Urban Street",
            detalles: "Camisa con grafico frontal tipo streetwear, ideal para looks casuales.",
            precio: 52000,
            tallas: ["S", "M", "L", "XL"],
            // aqui va la imagen de Camisa Urban Street
            imagen: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "camisa-graffiti",
            nombre: "Camisa Graffiti",
            detalles: "Diseno urbano con letras estilo graffiti, colores fuertes y nombre opcional.",
            precio: 54000,
            tallas: ["S", "M", "L", "XL"],
            // aqui va la imagen de Camisa Graffiti
            imagen: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "camisa-oversize-city",
            nombre: "Camisa Oversize City",
            detalles: "Camisa oversize con estampado de ciudad, frase o logo personalizado.",
            precio: 58000,
            tallas: ["M", "L", "XL"],
            // aqui va la imagen de Camisa Oversize City
            imagen: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "camisas-tematicas",
        nombre: "Camisas tematicas",
        descripcion: "Camisas para fechas especiales, eventos, grupos y celebraciones.",
        // aqui va la imagen de la subcategoria Camisas tematicas
        imagen: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
        productos: [
          {
            id: "camisa-cumpleanos",
            nombre: "Camisa de cumpleanos",
            detalles: "Diseno con edad, nombre, fecha y colores elegidos por el cliente.",
            precio: 50000,
            tallas: ["S", "M", "L", "XL"],
            // aqui va la imagen de Camisa de cumpleanos
            imagen: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "camisa-evento",
            nombre: "Camisa para evento",
            detalles: "Camisa personalizada para promociones, reuniones, ferias o equipos.",
            precio: 55000,
            tallas: ["S", "M", "L", "XL"],
            // aqui va la imagen de Camisa para evento
            imagen: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "camisa-familiar",
            nombre: "Camisa familiar",
            detalles: "Diseno combinado para familia, viaje, celebracion o foto especial.",
            precio: 53000,
            tallas: ["XS", "S", "M", "L", "XL"],
            // aqui va la imagen de Camisa familiar
            imagen: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "hoodies",
    nombre: "Hoodies",
    descripcion: "Buzos comodos para estampados grandes, pareja o colecciones.",
    imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    subcategorias: [
      {
        id: "anime",
        nombre: "Anime",
        descripcion: "Hoodies con estampados tematicos en pecho, espalda o mangas.",
        imagen: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
        productos: [
          {
            id: "hoodie-dragon-ball",
            nombre: "Hoodie Dragon Ball Z",
            detalles: "Hoodie comodo con estampado personalizado de anime.",
            precio: 85000,
            tallas: ["S", "M", "L", "XL"],
            imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "hoodie-akatsuki",
            nombre: "Hoodie Akatsuki",
            detalles: "Diseno oscuro o claro con simbolos, nubes y nombre opcional.",
            precio: 92000,
            tallas: ["S", "M", "L", "XL"],
            imagen: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "parejas",
        nombre: "Parejas",
        descripcion: "Disenos combinados para dos personas, amigos o familia.",
        imagen: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=800&q=80",
        productos: [
          {
            id: "hoodie-pareja",
            nombre: "Hoodie para pareja",
            detalles: "Disenos combinados para pareja, amigos o familia.",
            precio: 90000,
            tallas: ["S", "M", "L", "XL"],
            imagen: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "hoodie-duo",
            nombre: "Hoodie duo nombres",
            detalles: "Dos hoodies con nombres, fechas o frases complementarias.",
            precio: 98000,
            tallas: ["S", "M", "L", "XL"],
            imagen: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "gorras",
    nombre: "Gorras",
    descripcion: "Accesorios personalizados con logo, texto, bordado o estampado.",
    imagen: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
    subcategorias: [
      {
        id: "estampadas",
        nombre: "Estampadas",
        descripcion: "Gorras con disenos a color y acabados llamativos.",
        imagen: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
        productos: [
          {
            id: "gorra-anime",
            nombre: "Gorra Dragon Ball Z",
            detalles: "Gorra personalizada con estampado de Dragon Ball Z.",
            precio: 35000,
            tallas: ["Unica"],
            imagen: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "gorra-logo",
            nombre: "Gorra personalizada con logo",
            detalles: "Gorra con logo de empresa, emprendimiento o equipo.",
            precio: 38000,
            tallas: ["Unica"],
            imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "bordadas",
        nombre: "Bordadas",
        descripcion: "Acabado elegante con iniciales, nombres o frases cortas.",
        imagen: "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?auto=format&fit=crop&w=800&q=80",
        productos: [
          {
            id: "gorra-nombre",
            nombre: "Gorra bordada con nombre",
            detalles: "Gorra con bordado personalizado de nombre, iniciales o frase corta.",
            precio: 42000,
            tallas: ["Unica"],
            imagen: "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "vasos",
    nombre: "Vasos",
    descripcion: "Mugs y termos para regalos, marcas y detalles personalizados.",
    imagen: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    subcategorias: [
      {
        id: "mugs",
        nombre: "Mugs",
        descripcion: "Tazas con fotos, mensajes, nombres o ilustraciones.",
        imagen: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
        productos: [
          {
            id: "mug-foto",
            nombre: "Mug con foto",
            detalles: "Taza personalizada con foto, nombre o mensaje especial.",
            precio: 30000,
            tallas: ["11 oz"],
            imagen: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "mug-magico",
            nombre: "Mug magico",
            detalles: "Taza que revela el diseno con bebida caliente.",
            precio: 42000,
            tallas: ["11 oz"],
            imagen: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "termos",
        nombre: "Termos",
        descripcion: "Termos personalizados para uso diario, marcas o regalos.",
        imagen: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
        productos: [
          {
            id: "termo-personalizado",
            nombre: "Termo personalizado",
            detalles: "Termo con frase, logo, nombre o diseno personalizado.",
            precio: 55000,
            tallas: ["500 ml", "750 ml"],
            imagen: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "termo-empresa",
            nombre: "Termo corporativo",
            detalles: "Termo con logo de empresa para clientes, equipos o eventos.",
            precio: 65000,
            tallas: ["500 ml", "750 ml"],
            imagen: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
];

const productos = categoriasCatalogo.flatMap((categoria) =>
  categoria.subcategorias.flatMap((subcategoria) =>
    subcategoria.productos.map((producto) => ({
      ...producto,
      categoria: categoria.nombre,
      subcategoria: subcategoria.nombre,
    }))
  )
);

const modelosPersonalizables = [
  {
    id: "camisa",
    nombre: "Camisa blanca",
    precio: 50000,
    tallas: ["S", "M", "L", "XL"],
  },
  {
    id: "hoodie",
    nombre: "Hoodie blanco",
    precio: 95000,
    tallas: ["S", "M", "L", "XL"],
  },
  {
    id: "gorra",
    nombre: "Gorra blanca",
    precio: 42000,
    tallas: ["Unica"],
  },
  {
    id: "mug",
    nombre: "Mug blanco",
    precio: 35000,
    tallas: ["11 oz"],
  },
  {
    id: "termo",
    nombre: "Termo blanco",
    precio: 60000,
    tallas: ["500 ml", "750 ml"],
  },
];

const respuesta = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  res.end(JSON.stringify(data));
};

const leerBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("El cuerpo de la solicitud no es un JSON valido."));
      }
    });
  });

const cargarDB = async () => {
  try {
    const contenido = await readFile(DB_FILE, "utf8");
    return JSON.parse(contenido);
  } catch {
    return {
      usuarios: [],
      mensajes: [],
      pedidos: [],
      personalizaciones: [],
    };
  }
};

const guardarDB = async (db) => {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
};

const crearId = () => crypto.randomUUID();

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`;
};

const validarCampos = (datos, campos) => {
  const faltantes = campos.filter((campo) => !String(datos[campo] ?? "").trim());
  return faltantes;
};

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    return respuesta(res, 204, {});
  }

  try {
    if (req.method === "GET" && url.pathname === "/api/salud") {
      return respuesta(res, 200, {
        ok: true,
        mensaje: "Backend de VS Custom funcionando.",
      });
    }

    if (req.method === "GET" && url.pathname === "/api/productos") {
      return respuesta(res, 200, {
        ok: true,
        productos,
      });
    }

    if (req.method === "GET" && url.pathname === "/api/categorias") {
      return respuesta(res, 200, {
        ok: true,
        categorias: categoriasCatalogo,
      });
    }

    if (req.method === "GET" && url.pathname === "/api/modelos-personalizables") {
      return respuesta(res, 200, {
        ok: true,
        modelos: modelosPersonalizables,
      });
    }

    if (req.method === "POST" && url.pathname === "/api/registro") {
      const datos = await leerBody(req);
      const faltantes = validarCampos(datos, [
        "nombre",
        "correo",
        "telefono",
        "password",
      ]);

      if (faltantes.length > 0) {
        return respuesta(res, 400, {
          ok: false,
          mensaje: `Faltan campos: ${faltantes.join(", ")}.`,
        });
      }

      const db = await cargarDB();
      const correo = datos.correo.trim().toLowerCase();
      const existe = db.usuarios.some((usuario) => usuario.correo === correo);

      if (existe) {
        return respuesta(res, 409, {
          ok: false,
          mensaje: "Ya existe un usuario registrado con ese correo.",
        });
      }

      const usuario = {
        id: crearId(),
        nombre: datos.nombre.trim(),
        correo,
        telefono: datos.telefono.trim(),
        passwordHash: hashPassword(datos.password),
        creadoEn: new Date().toISOString(),
      };

      db.usuarios.push(usuario);
      await guardarDB(db);

      return respuesta(res, 201, {
        ok: true,
        mensaje: "Usuario registrado correctamente.",
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          telefono: usuario.telefono,
        },
      });
    }

    if (req.method === "POST" && url.pathname === "/api/contacto") {
      const datos = await leerBody(req);
      const faltantes = validarCampos(datos, ["nombre", "correo", "mensaje"]);

      if (faltantes.length > 0) {
        return respuesta(res, 400, {
          ok: false,
          mensaje: `Faltan campos: ${faltantes.join(", ")}.`,
        });
      }

      const db = await cargarDB();
      const mensaje = {
        id: crearId(),
        nombre: datos.nombre.trim(),
        correo: datos.correo.trim().toLowerCase(),
        mensaje: datos.mensaje.trim(),
        creadoEn: new Date().toISOString(),
      };

      db.mensajes.push(mensaje);
      await guardarDB(db);

      return respuesta(res, 201, {
        ok: true,
        mensaje: "Mensaje recibido correctamente.",
      });
    }

    if (req.method === "POST" && url.pathname === "/api/personalizaciones") {
      const datos = await leerBody(req);
      const faltantes = validarCampos(datos, [
        "modelo",
        "nombreCliente",
        "correo",
        "imagen",
      ]);

      if (faltantes.length > 0) {
        return respuesta(res, 400, {
          ok: false,
          mensaje: `Faltan campos: ${faltantes.join(", ")}.`,
        });
      }

      const modelo = modelosPersonalizables.find(
        (item) => item.id === datos.modelo
      );

      if (!modelo) {
        return respuesta(res, 400, {
          ok: false,
          mensaje: "El modelo seleccionado no existe.",
        });
      }

      if (!String(datos.imagen).startsWith("data:image/")) {
        return respuesta(res, 400, {
          ok: false,
          mensaje: "La imagen debe estar en formato valido.",
        });
      }

      const db = await cargarDB();
      const personalizacion = {
        id: crearId(),
        modelo: modelo.id,
        producto: modelo.nombre,
        talla: datos.talla || modelo.tallas[0],
        color: String(datos.color || "Blanco"),
        precio: modelo.precio,
        nombreCliente: datos.nombreCliente.trim(),
        correo: datos.correo.trim().toLowerCase(),
        instrucciones: String(datos.instrucciones || "").trim(),
        imagen: datos.imagen,
        diseno: {
          x: Number(datos.diseno?.x || 50),
          y: Number(datos.diseno?.y || 50),
          ancho: Number(datos.diseno?.ancho || datos.diseno?.escala || 45),
          alto: Number(datos.diseno?.alto || datos.diseno?.escala || 45),
          forma: String(datos.diseno?.forma || "original"),
          ubicacion: String(datos.diseno?.ubicacion || "frente"),
          modoRealista: Boolean(datos.diseno?.modoRealista),
        },
        creadoEn: new Date().toISOString(),
      };

      db.personalizaciones = db.personalizaciones || [];
      db.personalizaciones.push(personalizacion);
      await guardarDB(db);

      return respuesta(res, 201, {
        ok: true,
        mensaje: "Personalizacion guardada correctamente.",
        personalizacion: {
          id: personalizacion.id,
          producto: personalizacion.producto,
          talla: personalizacion.talla,
          color: personalizacion.color,
          precio: personalizacion.precio,
        },
      });
    }

    if (req.method === "POST" && url.pathname === "/api/pedidos") {
      const datos = await leerBody(req);

      if (!Array.isArray(datos.productos) || datos.productos.length === 0) {
        return respuesta(res, 400, {
          ok: false,
          mensaje: "El pedido debe tener al menos un producto.",
        });
      }

      const db = await cargarDB();
      const total = datos.productos.reduce((suma, producto) => {
        return suma + Number(producto.precio || 0);
      }, 0);

      const pedido = {
        id: crearId(),
        productos: datos.productos,
        total,
        estado: "pendiente",
        creadoEn: new Date().toISOString(),
      };

      db.pedidos.push(pedido);
      await guardarDB(db);

      return respuesta(res, 201, {
        ok: true,
        mensaje: "Pedido creado correctamente.",
        pedido,
      });
    }

    return respuesta(res, 404, {
      ok: false,
      mensaje: "Ruta no encontrada.",
    });
  } catch (error) {
    return respuesta(res, 500, {
      ok: false,
      mensaje: error.message,
    });
  }
});

servidor.listen(PORT, () => {
  console.log(`Backend listo en http://localhost:${PORT}`);
});
