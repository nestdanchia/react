import { useState } from "react";

export const ChatIA = () => {
  const [mensaje, setMensaje] = useState("");
  const [chat, setChat] = useState([]);
  const [cargando, setCargando] = useState(false);

  // 📞 Datos del usuario
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  // 🎯 Control del formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // 🧠 Detectar intención de compra
  const detectarIntencion = (texto) => {
    const t = texto.toLowerCase();

    return (
      t.includes("comprar") ||
      t.includes("precio") ||
      t.includes("cuanto") ||
      t.includes("cuánto") ||
      t.includes("quiero") ||
      t.includes("interesa")
    );
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    const textoUsuario = mensaje.toLowerCase();

    // 🧠 Respuestas sin contexto (NO llamar a la IA)
    const respuestasVacias = ["si", "sí", "ok", "dale", "bueno"];

    if (respuestasVacias.includes(textoUsuario)) {
      setChat((prev) => [
        ...prev,
        { tipo: "usuario", texto: mensaje },
        {
          tipo: "ia",
          texto: "¿Para qué la vas a usar? (trabajo, estudio, gaming o diseño)",
        },
      ]);
      setMensaje("");
      return;
    }

    // 👉 Agregar mensaje del usuario primero
    setChat((prev) => [...prev, { tipo: "usuario", texto: mensaje }]);

    // 🎯 Intención de compra → mostrar formulario y NO llamar a IA
    if (detectarIntencion(mensaje)) {
      setMostrarFormulario(true);

      setChat((prev) => [
        ...prev,
        {
          tipo: "ia",
          texto: "Perfecto, dejame tus datos y te contactamos.",
        },
      ]);

      setMensaje("");
      return;
    }

    setCargando(true);

    const instrucciones = `Eres vendedor de Laptop Store.

Si el usuario responde sin contexto (ej: "sí", "ok"):
→ pedir aclaración específica

Nunca asumir intención.
Nunca responder genérico.

Catálogo disponible:
- HP 250 G8 – Intel i5, 8GB RAM, 256GB SSD – Oficina – $800
- Lenovo IdeaPad 3 – Ryzen 5, 16GB RAM, 512GB SSD – Uso general – $950
- ASUS TUF Gaming – Ryzen 7, 16GB RAM, RTX 3050 – Gaming – $1400

Reglas:
1. Recomendar 1 o 2 modelos.
2. Explicar por qué.
3. Máximo 2 párrafos.
`;

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensaje: instrucciones + "\nUsuario: " + mensaje,
        }),
      });

      const data = await response.json();

      console.log("RESPUESTA BACKEND:", data);

      // 👇 MODIFICACIÓN: Procesamos la nueva estructura de OpenRouter (data.texto)
      let texto = data.texto || "No se obtuvo respuesta";

      // 👉 Si la IA pide datos → mostrar formulario
      if (
        texto.toLowerCase().includes("nombre") ||
        texto.toLowerCase().includes("teléfono")
      ) {
        setMostrarFormulario(true);
      }

      setChat((prev) => [...prev, { tipo: "ia", texto }]);
      setMensaje("");

    } catch (error) {
      setChat((prev) => [
        ...prev,
        { tipo: "ia", texto: "Error al conectar con el servidor" },
      ]);
    }

    setCargando(false);
  };

  const enviarDatos = () => {
    if (!nombre || !telefono) {
      alert("Completa nombre y teléfono");
      return;
    }

    setChat((prev) => [
      ...prev,
      {
        tipo: "ia",
        texto: `Gracias ${nombre}. Te contactaremos al ${telefono}.`,
      },
    ]);

    setNombre("");
    setTelefono("");
    setMostrarFormulario(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f4f4f4",
        borderRadius: "8px",
        margin: "20px 0",
      }}
    >
      <h4>Asistente Virtual</h4>

      {/* 🧠 CHAT */}
      <div
        style={{
          background: "#fff",
          height: "250px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "6px",
        }}
      >
        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.tipo === "usuario" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "10px",
                background:
                  msg.tipo === "usuario" ? "#007bff" : "#e4e6eb",
                color: msg.tipo === "usuario" ? "#fff" : "#000",
              }}
            >
              {msg.texto}
            </span>
          </div>
        ))}
      </div>

      {/* ✏️ INPUT */}
      <form onSubmit={manejarEnvio}>
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Hazme una pregunta..."
          style={{ width: "70%", padding: "10px" }}
        />

        <button type="submit" disabled={cargando}>
          {cargando ? "..." : "Enviar"}
        </button>
      </form>

      {/* 👉 BOTÓN OPCIONAL */}
      {!mostrarFormulario && (
        <button
          onClick={() => setMostrarFormulario(true)}
          style={{ marginTop: "10px" }}
        >
          Quiero que me contacten
        </button>
      )}

      {/* 📞 FORMULARIO */}
      {mostrarFormulario && (
        <div style={{ marginTop: "15px" }}>
          <h5>Dejar datos para compra</h5>

          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            style={{ marginLeft: "5px" }}
          />

          <button onClick={enviarDatos} style={{ marginLeft: "5px" }}>
            Enviar datos
          </button>
        </div>
      )}
    </div>
  );
};
/**
 * Qué es tu “asistente virtual”?

Tu sistema tiene 3 capas:

1. Frontend (React)

Tu componente ChatIA

👉 Hace:

Renderiza el chat
Captura input del usuario
Decide cuándo mostrar el formulario
Envía requests
2. Backend (Node + Express)

Tu server.js

👉 Hace:

Recibe el mensaje (/chat)
Llama a la API de Google
Devuelve la respuesta
3. IA real (Google Gemini)

Modelo tipo:

gemini-2.5-flash (el que ya viste en el ListModels)

👉 Hace:

Entiende lenguaje natural
Genera respuestas
Sigue instrucciones (prompt)
⚙️ Entonces, ¿qué estás construyendo?

👉 Estás haciendo un:

✔ Cliente de IA especializado (AI-powered app)

o más concretamente:

✔ Asistente conversacional de ventas
📌 Importante (esto es clave)

Vos NO estás:

entrenando un modelo ❌
creando IA desde cero ❌

Vos estás:

orquestando una IA existente ✔
controlando su comportamiento con prompts ✔
integrándola en una app real ✔
🧠 Analogía clara

Pensalo así:

Google Gemini = cerebro
Tu backend = intérprete
Tu frontend = cara / interfaz

👉 Vos estás construyendo el “robot”, no el cerebro.

💡 ¿Por qué igual se considera “IA”?

Porque tu app:

responde en lenguaje natural ✔
toma decisiones (mostrar formulario) ✔
simula conversación humana ✔
automatiza ventas ✔

👉 Eso funcionalmente ES una aplicación de IA

🚀 Nivel en el que estás (sin humo)

Esto ya es:

✔ IA aplicada (Applied AI)
✔ UX conversacional
✔ automatización comercial
🧩 Si quisieras ir “más IA real”

Ahí entrarías en:

fine-tuning
embeddings
RAG (base de conocimiento)
memoria persistente
agentes
🎯 Resumen corto

👉 Sí, es una IA
👉 Pero más precisamente:

Es una aplicación que usa IA como motor
 */