//javascript
// --- 1. BASE DE DATOS SIMULADA ---
const inventario = [
    { id: 101, nombre: "Laptop", precio: 1000, stock: 5 },
    { id: 102, nombre: "Mouse", precio: 25, stock: 0 },
    { id: 103, nombre: "Monitor", precio: 300, stock: 10 },
    { id: 104, nombre: "Teclado", precio: 50, stock: 2 }
];

// --- 2. FUNCIONES ASÍNCRONAS ---
/**
 * 
 *Cualquier función marcada como async devuelve 
 automáticamente una promesa, sin necesidad de usar new Promise ni resolve.
 idSolicitado 
 
 */
const validarStock = (idSolicitado) => {
    return new Promise((resolve, reject) => {
        console.log("🔍 Buscando en el inventario...");

        setTimeout(() => {
            // 📝 USANDO FILTER: Buscamos productos con ID coincidente y stock > 0
            const disponibles = inventario.filter(p => p.id === idSolicitado && p.stock > 0);

            if (disponibles.length > 0) {
                // 📝 USANDO MAP: Transformamos el objeto para no enviar datos sensibles o innecesarios
                // Creamos un nuevo objeto más limpio
                const productoLimpio = disponibles.map(p => ({
                    id: p.id,
                    descripcion: p.nombre.toUpperCase(),
                    costo: p.precio
                }))[0]; // Tomamos el primer resultado del array generado por map

                resolve(productoLimpio); // ✅ Este objeto llega al 'await'
            } else {
                reject(`❌ Error: Producto ${idSolicitado} agotado o no existe.`);
            }
        }, 1500);
    });
};
/*
JavaScript no puede "adivinar" cuándo termina una función que usa un temporizador o un evento externo.
Ejemplo: setTimeout. Es una función vieja que no devuelve nada.
Por qué necesitas new: Porque tú debes llamar manualmente a resolve() dentro del callback del temporizador. Sin el new, JavaScript ejecutaría la función y pasaría a la siguiente línea sin esperar.
2. 🔌 Envolver librerías antiguas (Legacy)
Muchos códigos (especialmente en Node.js o librerías de hace años) funcionan con Callbacks (funciones que pasas como argumento).
El problema: Estas funciones no están diseñadas para trabajar con await.
La solución: Tienes que "envolverlas" en un new Promise para que el await tenga algo a lo que esperar. El new Promise actúa como un adaptador entre el código viejo y el nuevo.
3. 🖱️ Eventos de Usuario o de Sistema
Las promesas se resuelven una sola vez. A veces necesitas esperar a que algo suceda en el navegador (como que se cargue una imagen o que el usuario haga clic en un botón específico de un modal).
El motivo: JavaScript no sabe qué evento del DOM (Document Object Model) es el que tú consideras como el "éxito" de tu operación. Con new Promise, tú decides: img.onload = () => resolve().
4. 🎛️ Control total sobre el éxito y el error
Cuando usas async/return, JavaScript asume que si la función termina, es un éxito. Pero con new Promise tienes un control granular:
Puedes decidir no resolver la promesa si no se cumple una condición compleja.
Puedes disparar el reject en base a una lógica que no es necesariamente un error de código (un "crash"), sino un error de negocio (ej. "el usuario no tiene saldo").
5. 🏗️ Construcción de utilidades personalizadas
Si quieres crear herramientas como un "semáforo" de peticiones o un sistema que reintente una conexión 3 veces antes de fallar, necesitas el objeto Promise para manipular el estado manualmente.
💡 ¿Cuándo SÍ puedes evitar el new?
Afortunadamente, en el desarrollo moderno, el 90% del tiempo no escribes new Promise. Usas lo que ya existe:
Peticiones HTTP: Usas fetch(), que ya trae el new Promise adentro.
Bases de Datos: Los drivers modernos (como Mongoose o Prisma) ya devuelven promesas.
Funciones de transformación: Si solo vas a procesar datos (como tu ejemplo de map y filter), con poner async al principio y return al final es suficiente.
En resumen:
El new Promise es el "pegamento" que usas para convertir procesos que no saben de promesas en procesos que el await pueda entender./
const procesarPago = (infoProducto) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`💳 Procesando pago de $${infoProducto.costo} por: ${infoProducto.descripcion}`);
            resolve({ idTransaccion: "TX-" + Math.random().toString(36).substr(2, 5) });
        }, 1000);
    });
};

// --- 3. FLUJO PRINCIPAL (CONSUMO) ---

async function tiendaVirtual(id) {
    try {
        console.log("🛒 Iniciando proceso de compra...");

        // AWAIT captura el objeto 'productoLimpio' que salió del MAP
        const producto = await validarStock(id); 
        console.log("✅ Producto encontrado:", producto);

        // AWAIT captura el ID de transacción del resolve
        const pago = await procesarPago(producto);
        console.log("🎉 Compra exitosa. Código:", pago.idTransaccion);

    } catch (error) {
        // Aquí cae el reject si el filter no encontró nada o no había stock
        console.error(error);
    } finally {
        console.log("🏁 Sesión finalizada.");
    }
}
/*
sync function tiendaVirtual(id) {
    try {
        console.log("🛒 Iniciando proceso de compra...");

        // 🟢 PUNTO DE RESOLUCIÓN 1:
        // Aquí el código se pausa. El 'resolve' ocurre cuando la promesa 
        // de validarStock(id) termina. El valor que estaba dentro de ese 
        // resolve() se "deposita" en la constante 'producto'.
        const producto = await validarStock(id); 
        
        console.log("✅ Producto encontrado:", producto);

        // 🟢 PUNTO DE RESOLUCIÓN 2:
        // Aquí ocurre el segundo 'resolve'. La función espera a que 
        // procesarPago termine. El contenido del resolve() del banco 
        // se "deposita" en la constante 'pago'.
        const pago = await procesarPago(producto);

        console.log("🎉 Compra exitosa. Código:", pago.idTransaccion);

        // 🟢 RESOLVE FINAL DE LA FUNCIÓN:
        // Aunque no veas un "return", al ser una función 'async', 
        // cuando llega al final de la llave }, JavaScript hace un:
        // resolve(undefined);
        
    } catch (error) {
        // 🔴 PUNTO DE REJECT:
        // Si CUALQUIERA de las funciones de arriba ejecuta un reject(),
        // el flujo salta automáticamente aquí.
        console.error(error);
    } finally {
        console.log("🏁 Sesión finalizada.");
    }
}/

// --- 4. PRUEBAS ---
tiendaVirtual(101); // Caso exitoso
// tiendaVirtual(102); // Caso error (Stock 0)
/**
 * filter: Nos aseguró que el proceso solo continúe si el producto existe y tiene stock. Si el array queda vacío, disparamos el reject.
map: Es muy útil en promesas porque a veces la base de datos te da mucha "basura" (fechas de creación, logs, etc.). Con map limpiamos el objeto antes de pasárselo al resolve.
Encadenamiento lógico: Nota cómo procesarPago recibe producto.costo. Ese dato fue generado dentro del map de la función anterior.
function tiendaVirtualConThen(id) {
    console.log("🛒 Iniciando proceso (estilo .then)...");

    // 1. Llamamos a la función
    validarStock(id)
        .then(producto => {
            // El 'resolve' de validarStock llega aquí como 'producto'
            console.log("✅ Producto encontrado:", producto);
            
            // IMPORTANTE: Para seguir la cadena, debemos retornar la siguiente promesa
            return procesarPago(producto); 
        })
        .then(pago => {
            // El 'resolve' de procesarPago llega aquí como 'pago'
            console.log("🎉 Compra exitosa. Código:", pago.idTransaccion);
        })
        .catch(error => {
            // Captura CUALQUIER reject de la cadena
            console.error(error);
        })
        .finally(() => {
            console.log("🏁 Sesión finalizada.");
        });
}

tiendaVirtualConThen(101);

 */
import { useState } from 'react';

/**
 * 🛒 COMPONENTE Item - Manejo de Stock con Inmutabilidad
 * 
 * PRINCIPIO CLAVE: El hijo NO puede modificar directamente el stock del padre.
 * El stock es "solo lectura" para el hijo. Solo puede notificar al padre.
 * 
 * FLUJO DE DATOS:
 * Padre → stockActual (prop de solo lectura)es de solo lectura 
 * porque el hijo no puede modificarlo
 * Hijo → onCompra(cantidad) (notificación al padre)
 * Padre → actualiza su estado → re-renderiza con nuevo stock
 */
export function Item({ nombre, stockActual, onCompra }) {
  // 🔄 ESTADO LOCAL: "Borrador" de la compra del usuario
  // Este estado es TEMPORAL y solo existe mientras el usuario decide cuánto comprar
  const [cantidad, setCantidad] = useState(0);

  // ➕ FUNCIÓN SUMAR: Incrementa el borrador de compra
  // Validación: No permite superar el stock disponible
  const sumar = () => {
    if (cantidad < stockActual) setCantidad(cantidad + 1);
    // Si cantidad >= stockActual, el botón está disabled y no se ejecuta
  };

  // ➖ FUNCIÓN RESTAR: Decrementa el borrador de compra
  // Validación: No permite valores negativos
  const restar = () => {
    if (cantidad > 0) setCantidad(cantidad - 1);
    // Si cantidad === 0, el botón está disabled y no se ejecuta
  };

  // 🎯 FUNCIÓN EJECUTAR COMPRA: El momento clave de la comunicación
  // 1. Notifica al padre con la cantidad decidida
  // 2. Limpia el estado local para la próxima compra
  const ejecutarCompra = () => {
    // 📤 COMUNICACIÓN HIJO→PADRE:
    // Pasamos la cantidad acumulada al padre a través de la prop onCompra
    // El padre recibirá este valor y actualizará su estado de stock
    onCompra(cantidad);
    
    // 🧹 LIMPIEZA LOCAL: Reset del borrador
    // Después de notificar, limpiamos nuestro contador local
    // Esto prepara el componente para la próxima operación
    setCantidad(0);
  };

  // 📊 CÁLCULO DERIVADO: Stock resultante (solo para visualización)
  // No modifica el stock real, solo muestra qué pasaría si se confirma
  const stockResultante = stockActual - cantidad;

  return (
    <div style={cardStyle}>
      {/* 📦 INFORMACIÓN DEL PRODUCTO */}
      <h3>{nombre}</h3>
      <p>Stock en depósito: <strong>{stockActual}</strong></p>
      
      {/* 🎛️ CONTROL DE CANTIDAD: Interfaz para el borrador de compra */}
      <div style={selectorStyle}>
        <button onClick={restar} disabled={cantidad === 0}>-</button>
        
        <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
          {cantidad} unidades
        </span>
        
        <button onClick={sumar} disabled={cantidad >= stockActual}>+</button>
      </div>

      {/* 💬 FEEDBACK VISUAL: Ayuda al usuario a tomar decisiones */}
      <p style={{ color: stockResultante < 10 ? 'red' : 'gray', fontSize: '0.8em' }}>
        {cantidad > 0 ? `Quedarían ${stockResultante} disponibles` : 'Seleccione cantidad'}
      </p>

      {/* 🎮 BOTÓN DE ACCIÓN: Dispara la comunicación con el padre */}
      <button 
        onClick={ejecutarCompra} 
        disabled={cantidad === 0} // Solo se puede comprar si hay cantidad seleccionada
        style={btnCompraStyle}
      >
        Confirmar Compra
      </button>
    </div>
  );
}

// Estilos rápidos para que se vea bien
const cardStyle = { border: '2px solid #eee', padding: '20px', borderRadius: '12px', width: '250px', textAlign: 'center' };
const selectorStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', margin: '15px 0' };
const btnCompraStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };

/**
 * 🏪 COMPONENTE PADRE - TiendaVirtual
 * 
 * RESPONSABILIDADES:
 * 1. Mantener el estado REAL del inventario (la fuente de verdad)
 * 2. Recibir notificaciones de los hijos y actualizar el stock
 * 3. Renderizar múltiples componentes Item con sus stocks actuales
 * 
 * PRINCIPIO DE INMUTABILIDAD:
 * - Solo el PADRE puede modificar el stock
 * - Los hijos solo reciben el stock como prop (solo lectura)
 * - Los hijos notifican al padre cuando quieren comprar
 */
export function TiendaVirtual() {
  // 🗄️ ESTADO GLOBAL: El inventario real de la tienda
  // Este es el "estado de verdad" que todos los componentes Item reflejarán
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Laptop Gamer", stock: 15 },
    { id: 2, nombre: "Mouse Inalámbrico", stock: 8 },
    { id: 3, nombre: "Monitor 4K", stock: 3 },
    { id: 4, nombre: "Teclado Mecánico", stock: 12 }
  ]);

  // 📝 ESTADO DE CONTROL: Para mostrar historial de compras
  // No afecta la lógica, solo para feedback visual al usuario
  const [historial, setHistorial] = useState([]);

  /**
   * 🎯 FUNCIÓN MANEJADORA DE COMPRA
   * 
   * Esta función es el PUENTE entre el hijo y el estado global.
   * El hijo llama a esta función cuando el usuario confirma una compra.
   * 
   * @param {number} productoId - ID del producto que se quiere comprar
   * @param {number} cantidad - Cantidad que el hijo decidió comprar
   */
  const manejarCompra = (productoId, cantidad) => {
    console.log(`🛒 Compra recibida: Producto ${productoId}, Cantidad ${cantidad}`);

    // 🔄 ACTUALIZACIÓN INMUTABLE DEL ESTADO
    // NUNCA modificamos el estado directamente (productos[...].stock = ...)
    // SIEMPRE creamos un nuevo array con los valores actualizados
    setProductos(productosAnteriores => {
      return productosAnteriores.map(producto => {
        if (producto.id === productoId) {
          // 📦 RESTAR STOCK: Solo si hay suficiente stock disponible
          const nuevoStock = producto.stock - cantidad;
          
          if (nuevoStock >= 0) {
            // ✅ COMPRA EXITOSA: Actualizamos el stock
            console.log(`✅ Stock actualizado: ${producto.nombre} (${producto.stock} → ${nuevoStock})`);
            
            // 📋 REGISTRAR EN HISTORIAL
            setHistorial(historialAnterior => [
              ...historialAnterior,
              {
                producto: producto.nombre,
                cantidad: cantidad,
                stockAnterior: producto.stock,
                stockNuevo: nuevoStock,
                timestamp: new Date().toLocaleTimeString()
              }
            ]);
            
            return { ...producto, stock: nuevoStock };
          } else {
            // ❌ ERROR: Stock insuficiente
            console.warn(`❌ Stock insuficiente para ${producto.nombre}`);
            alert(`No hay suficiente stock de ${producto.nombre}. Stock actual: ${producto.stock}`);
            return producto; // Devolvemos el producto sin cambios
          }
        }
        return producto; // Productos que no coinciden, los dejamos igual
      });
    });
  };

  /**
   * 🎮 FUNCIÓN AUXILIAR: Reiniciar inventario
   * Solo para demostración de cómo funciona la actualización de estado
   */
  const reiniciarInventario = () => {
    setProductos([
      { id: 1, nombre: "Laptop Gamer", stock: 15 },
      { id: 2, nombre: "Mouse Inalámbrico", stock: 8 },
      { id: 3, nombre: "Monitor 4K", stock: 3 },
      { id: 4, nombre: "Teclado Mecánico", stock: 12 }
    ]);
    setHistorial([]);
    console.log("🔄 Inventario reiniciado");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏪 Tienda Virtual - Manejo de Stock</h1>
      
      {/* 📊 PANEL DE CONTROL */}
      <div style={{ 
        border: '2px solid #ddd', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>📦 Inventario Actual</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {productos.map(producto => (
            <div key={producto.id} style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              borderRadius: '5px',
              backgroundColor: 'white'
            }}>
              <strong>{producto.nombre}</strong>
              <br />
              Stock: <span style={{ 
                color: producto.stock < 5 ? 'red' : 'green',
                fontWeight: 'bold'
              }}>{producto.stock}</span>
            </div>
          ))}
        </div>
        
        <button 
          onClick={reiniciarInventario}
          style={{ 
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reiniciar Inventario
        </button>
      </div>

      {/* 🛍️ CATÁLOGO DE PRODUCTOS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '20px'
      }}>
        {productos.map(producto => (
          <Item
            key={producto.id} // 🔑 Key importante para React
            nombre={producto.nombre}
            stockActual={producto.stock} // 📦 Prop de solo lectura
            onCompra={(cantidad) => manejarCompra(producto.id, cantidad)} // 🎯 Callback
          />
        ))}
      </div>

      {/* 📋 HISTORIAL DE COMPRAS */}
      {historial.length > 0 && (
        <div style={{ 
          border: '2px solid #ddd', 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2>📋 Historial de Compras</h2>
          {historial.map((compra, index) => (
            <div key={index} style={{ 
              border: '1px solid #eee', 
              padding: '8px', 
              margin: '5px 0',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}>
              <strong>{compra.producto}</strong> - {compra.cantidad} unidades
              <br />
              <small style={{ color: '#666' }}>
                Stock: {compra.stockAnterior} → {compra.stockNuevo} 
                ({compra.timestamp})
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
/**
 * Flujo Completo
1. Inicialización
Padre (TiendaVirtual)
  ↓ (props)
Hijo (Item)
  ← Recibe: nombre, stockActual, onCompra
2. Interacción del Usuario
Usuario hace clic en Item
  ↓
Item actualiza su estado local (cantidad)
  ↓
Usuario confirma compra
  ↓
Item llama onCompra(cantidad)
3. Comunicación al Padre
Item.onCompra(cantidad)
  ↓
Padre.manejarCompra(productoId, cantidad)
  ↓
Padre actualiza su estado global
  ↓
React re-renderiza
4. Actualización Bidireccional
Padre actualiza stock
  ↓ (nuevas props)
Todos los Item reciben nuevo stockActual
  ↓
UI se actualiza automáticamente
🎯 Puntos Clave
✅ Lo que SÍ puede hacer el HIJO:
Leer props (datos del padre)
Modificar su estado local (cantidad)
Notificar al padre (onCompra)
Renderizar basado en props y estado local
❌ Lo que NO puede hacer el HIJO:
Modificar directamente stockActual
Cambiar el estado del padre
Modificar las props recibidas
✅ Lo que SÍ puede hacer el PADRE:
Mantener el estado global (productos)
Actualizar su propio estado
Pasar funciones como props
Renderizar hijos con datos actualizados
🎪 Analogía Simple
📞 Padre = Gerente de Tienda
👤 Hijo = Cajero
 
📦 Gerente → Cajero: "Aquí está el inventario actual"
🛒 Cajero → Gerente: "El cliente quiere comprar 3 unidades"
📋 Gerente: Actualiza inventario → "Nuevo inventario: X unidades"
🔄 Gerente → Cajero: "Aquí está el inventario actualizado"
🏆 Resumen en 1 Línea
"El padre manda datos hacia abajo, el hijo manda eventos hacia arriba"

Este patrón garantiza:

Flujo unidireccional de datos
Estado predecible
Componentos desacoplados
Fácil debugging
Feedback submitted



el hijo determinara la cantidad en esta funcion  onCompra={(cantidad) => manejarCompra(producto.id, cantidad)}  asi que basta con oncompra(cantidad) para que la funcion se ejecute esta se ejecutara en el padre 

✅ ¡Exacto! Así funciona el callback
🎯 Explicación del Flujo
1. En el PADRE (TiendaVirtual)
javascript
<Item
  onCompra={(cantidad) => manejarCompra(producto.id, cantidad)}
/>
¿Qué está pasando aquí?

onCompra = prop que contiene una función
(cantidad) => manejarCompra(producto.id, cantidad) = función flecha
El hijo recibe onCompra como una función que puede ejecutar
2. En el HIJO (Item)
javascript
const ejecutarCompra = () => {
  onCompra(cantidad); // ← Esto ejecuta la función del padre
};
¿Qué pasa cuando el hijo llama onCompra(cantidad)?

🔄 Flujo de Ejecución Paso a Paso
Paso 1: El PADRE prepara la función
javascript
// Padre crea una función "envoltorio"
onCompra = (cantidad) => {
  manejarCompra(producto.id, cantidad); // ← función real del padre
}
Paso 2: El HIJO recibe la función
javascript
// Hijo recibe onCompra como una prop normal
function Item({ nombre, stockActual, onCompra }) {
  // onCompra = (cantidad) => manejarCompra(producto.id, cantidad)
}
Paso 3: El HIJO ejecuta la función
javascript
const ejecutarCompra = () => {
  onCompra(cantidad); // ← Ejecuta la función del padre
};
Paso 4: La función del PADRE se ejecuta
javascript
// Esto es lo que realmente se ejecuta:
manejarCompra(producto.id, cantidad);
🎪 Analogía del Teléfono
📞 Padre: "Te doy mi número de teléfono" (onCompra)
📱 Hijo: "Guarda el número" (recibe la prop)
📞 Hijo: "Llama al número" (onCompra(cantidad))
🏠 Padre: "Contesta el teléfono" (manejarCompra se ejecuta)
🏆 En Resumen
Sí, basta con onCompra(cantidad) porque:

onCompra ya contiene la función del padre
El hijo solo necesita pasar el parámetro (cantidad)
React se encarga de ejecutar la función correcta en el padre
El hijo no sabe qué función está ejecutando, solo sabe que onCompra es una función que puede llamar con un parámetro.

Esta es la magia de los callbacks en React: el hijo ejecuta una función que el padre le pasó, sin necesidad de conocer los detalles internos.
 * PREGUNTAS Y RESPUESTAS CLAVE
PREGUNTA 1: ¿Para qué se utiliza el método .map() sobre el array productos? RESPUESTA: Para crear un nuevo array de componentes Item, pasando a cada uno las propiedades de un producto.

PREGUNTA 2: ¿Cómo se comunica el padre con el hijo? RESPUESTA: El padre envía datos al hijo a través de props (stockActual, nombre, onCompra).

PREGUNTA 3: ¿Cómo puede el hijo modificar el estado del padre? RESPUESTA: El hijo no puede modificar directamente las props, pero puede notificar al padre a través de callbacks (onCompra(cantidad)) para que el padre actualice su estado.

PREGUNTA 4: ¿Por qué las props son de solo lectura? RESPUESTA: Porque React garantiza el flujo unidireccional de datos. Si los hijos pudieran modificar props directamente, el estado sería impredecible.

PREGUNTA 5: ¿Qué es un callback en React? RESPUESTA: Es una función que el padre pasa como prop al hijo, y el hijo puede ejecutar para comunicarse con el padre. Es el puente de comunicación hijo→padre.

PREGUNTA 6: ¿Cuándo se usa useMemo? RESPUESTA: Para optimizar cálculos pesados que no necesitan ejecutarse en cada render, solo cuando sus dependencias específicas cambian.

PREGUNTA 7: ¿Qué significa "props down, events up"? RESPUESTA: Props van del padre al hijo (hacia abajo), y eventos/notificaciones van del hijo al padre (hacia arriba) a través de callbacks.

PREGUNTA 8: ¿Por qué se usa inmutabilidad en React? RESPUESTA: Para garantizar que las actualizaciones de estado sean predecibles, facilitar el debugging y permitir que React detecte eficientemente qué cambió.

PREGUNTA 9: ¿Qué diferencia hay entre useState y useEffect? RESPUESTA: useState maneja el estado del componente, useEffect maneja efectos secundarios (API calls, timers, suscripciones) que dependen del estado.

PREGUNTA 10: ¿Cuál es el flujo completo de una compra? RESPUESTA: Usuario selecciona cantidad → Item valida localmente → Item llama onCompra() → Padre manejaCompra() → Padre actualiza estado → React re-renderiza → Todos los Item reciben nuevo stock.

Puedes copiar y pegar estas preguntas y respuestas al final del arch
 */