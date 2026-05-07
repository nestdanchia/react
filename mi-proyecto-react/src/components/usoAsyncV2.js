//javascript
// --- VERSIÓN 2: HIJO NO SABE DE IDs - COMUNICACIÓN DIRECTA ---

/**
 * 🎯 CONCEPTO CLAVE: El hijo no necesita conocer IDs
 * 
 * Para el hijo, onCompra es una "orden directa" sin preocuparse por IDs.
 * El padre se encarga de asociar la orden con el producto correcto.
 * 
 * FLUJO SIMPLIFICADO:
 * Hijo: "Quiero comprar X unidades" (no sabe de qué producto)
 * Padre: "Ah, este hijo es del producto Y, entonces resto de Y"
 */

import { useState } from 'react';

/**
 * 🛒 COMPONENTE Item V2 - Sin conocimiento de IDs
 * 
 * CAMBIOS CLAVE:
 * - El hijo NO sabe qué ID tiene
 * - onCompra es una "orden directa" al padre
 * - El padre sabe qué hijo llamó la función
 */
export function ItemV2({ nombre, stockActual, onCompra }) {
  // 🔄 ESTADO LOCAL: "Borrador" de la compra del usuario
  // Sin cambios respecto a la versión anterior
  const [cantidad, setCantidad] = useState(0);

  // ➕ FUNCIÓN SUMAR: Incrementa el borrador de compra
  const sumar = () => {
    if (cantidad < stockActual) setCantidad(cantidad + 1);
  };

  // ➖ FUNCIÓN RESTAR: Decrementa el borrador de compra
  const restar = () => {
    if (cantidad > 0) setCantidad(cantidad - 1);
  };

  // 🎯 FUNCIÓN EJECUTAR COMPRA: Orden directa al padre
  const ejecutarCompra = () => {
    // 📤 COMUNICACIÓN SIMPLIFICADA:
    // El hijo solo dice "compré X unidades"
    // NO necesita decir "del producto Y"
    onCompra(cantidad);
    
    // 🧹 Limpieza local
    setCantidad(0);
  };

  // 📊 Cálculo derivado para feedback visual
  const stockResultante = stockActual - cantidad;

  return (
    <div style={cardStyle}>
      <h3>{nombre}</h3>
      <p>Stock en depósito: <strong>{stockActual}</strong></p>
      
      <div style={selectorStyle}>
        <button onClick={restar} disabled={cantidad === 0}>-</button>
        
        <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
          {cantidad} unidades
        </span>
        
        <button onClick={sumar} disabled={cantidad >= stockActual}>+</button>
      </div>

      <p style={{ color: stockResultante < 10 ? 'red' : 'gray', fontSize: '0.8em' }}>
        {cantidad > 0 ? `Quedarían ${stockResultante} disponibles` : 'Seleccione cantidad'}
      </p>

      <button 
        onClick={ejecutarCompra} 
        disabled={cantidad === 0}
        style={btnCompraStyle}
      >
        Confirmar Compra
      </button>
    </div>
  );
}

/**
 * 🏪 COMPONENTE PADRE V2 - Asociación Automática
 * 
 * CAMBIOS CLAVE:
 * - El padre sabe qué hijo llamó cada callback
 * - Usa closures para asociar automáticamente IDs
 * - El hijo solo pasa la cantidad, el padre agrega el ID
 */
// ¿Por qué el cambio es tan crucial?

const ejecutarCompra = (cantidad) => {
  const producto = productos.find(p => p.id === productoId);
  const nuevoStock = producto.stock - cantidad;

  if (nuevoStock < 0) {
    alert("¡Ups! Alguien te ganó de mano, ya no queda stock.");
    return; // Cortamos la ejecución antes de tocar los estados
  }

  // Si pasa la validación, disparamos los setters...
};
// El Padre (TiendaVirtual): Es el "dueño de la verdad". Mantiene el estado (stock, productos).
export function TiendaVirtualV2() {
  // 🗄️ ESTADO GLOBAL: Sin cambios
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Laptop Gamer", stock: 15 },
    { id: 2, nombre: "Mouse Inalámbrico", stock: 8 },
    { id: 3, nombre: "Monitor 4K", stock: 3 },
    { id: 4, nombre: "Teclado Mecánico", stock: 12 }
  ]);

  const [historial, setHistorial] = useState([]);

  /**
   * 🎯 MANEJADOR DE COMPRA V2 - Simplificado
   * 
   * CAMBIO: Ahora solo recibe cantidad, no necesita ID
   * El ID se asocia automáticamente en el render
   */
  const manejarCompraV2 = (cantidad) => {
    console.log(`🛒 Compra recibida: Cantidad ${cantidad}`);
    
    // 🔄 ACTUALIZACIÓN INMUTABLE
    setProductos(productosAnteriores => {
      return productosAnteriores.map(producto => {
        // 🎯 MAGIA DE LA VERSIÓN 2:
        // ¿Cómo sabemos qué producto actualizar si no recibimos ID?
        // RESPUESTA: No sabemos. Esta versión tiene un problema conceptual.
        // NECESITAMOS una forma de asociar el callback con el producto.
        
        // ❌ ESTO NO FUNCIONARÍA:
        // No podemos saber qué producto actualizar sin el ID
        
        return producto; // No hacemos cambios
      });
    });
  };

  /**
   * ✅ SOLUCIÓN CORRECTA: Crear callbacks específicos por producto
   * 
   * Cada hijo recibe un callback "pre-configurado" con su ID
   */
  const crearCallbackCompra = (productoId) => {
    return (cantidad) => {
      console.log(`🛒 Compra de producto ${productoId}: Cantidad ${cantidad}`);
      
      // 🎯 PATRÓN LIMPIO: Separar la lógica de las actualizaciones de estado
      // 1. Encontrar el producto y validar
      const producto = productos.find(p => p.id === productoId);
      
      if (!producto) {
        console.warn(`❌ Producto ${productoId} no encontrado`);
        return;
      }
      
      const nuevoStock = producto.stock - cantidad;
      
      if (nuevoStock < 0) {
        console.warn(`❌ Stock insuficiente para ${producto.nombre}`);
        alert(`No hay suficiente stock de ${producto.nombre}. Stock actual: ${producto.stock}`);
        return;
      }
      
      // 2. Actualizar productos (sin anidar otros setters)
      setProductos(productosAnteriores => 
        productosAnteriores.map(p => 
          p.id === productoId 
            ? { ...p, stock: nuevoStock }
            : p
        )
      );
      
      // 3. Actualizar historial (separado, no anidado)
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
      
      console.log(`✅ Stock actualizado: ${producto.nombre} (${producto.stock} → ${nuevoStock})`);
    };
  };

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
      <h1>🏪 Tienda Virtual V2 - Hijo sin IDs</h1>
      
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

      {/* 🛍️ CATÁLOGO DE PRODUCTOS V2 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '20px'
      }}>
        {productos.map(producto => (
          <ItemV2
            key={producto.id}
            nombre={producto.nombre}
            stockActual={producto.stock}
            // 🎯 CALLBACK ESPECÍFICO POR PRODUCTO
            // Cada hijo recibe un callback "pre-configurado"
            onCompra={crearCallbackCompra(producto.id)}
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

      {/* 🎓 EXPLICACIÓN DEL PATRÓN */}
      <div style={{ 
        border: '2px solid #007bff', 
        padding: '15px', 
        borderRadius: '8px',
        backgroundColor: '#f0f8ff',
        marginTop: '20px'
      }}>
        <h3>🎓 ¿Cómo funciona el patrón "Hijo sin IDs"?</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>🔧 Técnica: Closures (Funciones que "recuerdan")</strong>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '0.9em',
            overflow: 'auto'
          }}>
{`// El padre crea una función que "recuerda" el ID
const crearCallbackCompra = (productoId) => {
  return (cantidad) => {
    // Esta función "recuerda" qué productoId es
    // Aunque el hijo no lo pase
    console.log(\`Producto \${productoId}: \${cantidad} unidades\`);
  };
};

// Cada hijo recibe su callback personalizado
<ItemV2 onCompra={crearCallbackCompra(1)} /> // Recibe callback para ID 1
<ItemV2 onCompra={crearCallbackCompra(2)} /> // Recibe callback para ID 2`}
          </pre>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>🎯 Para el hijo:</strong>
          <ul>
            <li>onCompra es una función que recibe solo <strong>cantidad</strong></li>
            <li>No sabe ni le importa qué producto es</li>
            <li>Solo ejecuta: <code>onCompra(cantidad)</code></li>
          </ul>
        </div>

        <div>
          <strong>🏠 Para el padre:</strong>
          <ul>
            <li>Crea un callback específico para cada producto</li>
            <li>El callback "recuerda" automáticamente el ID</li>
            <li>Asocia la cantidad con el producto correcto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Estilos (reutilizados)
const cardStyle = { border: '2px solid #eee', padding: '20px', borderRadius: '12px', width: '250px', textAlign: 'center' };
const selectorStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', margin: '15px 0' };
const btnCompraStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };

/**
 * 🎓 PREGUNTAS Y RESPUESTAS VERSIÓN 2
 * 
 * PREGUNTA: ¿Por qué el hijo no necesita saber el ID?
 * RESPUESTA: Porque el padre crea callbacks específicos que "recuerdan" el ID
 *          usando closures. Cada hijo recibe una función pre-configurada.
 * 
 * PREGUNTA: ¿Qué es un closure en este contexto?
 * RESPUESTA: Es una función que tiene acceso a variables de su contexto
 *          de creación. crearCallbackCompra(productoId) crea una función
 *          que "recuerda" qué productoId era.
 * 
 * PREGUNTA: ¿Cómo sabe el padre qué producto actualizar?
 * RESPUESTA: No necesita saberlo en tiempo de ejecución. Cada callback
 *          ya viene con el ID "incrustado" gracias al closure.
 * 
 * PREGUNTA: ¿Es mejor este patrón que el original?
 * RESPUESTA: Depende. Este patrón hace el hijo más "tonto" y simple,
 *          pero requiere más complejidad en el padre. El original
 *          es más explícito y fácil de entender.
 * 
 * PREGUNTA: ¿Cuándo usar cada patrón?
 * RESPUESTA: 
 * - Patrón original: Cuando quieres claridad y simplicidad
 * - Patrón V2: Cuando quieres componentes hijos completamente genéricos
 */
/**
 * 
 * 
 * El Hijo "Agnóstico" (ItemV2)
Esta es la mayor mejora. El componente ItemV2 es puro y reutilizable.
¿Por qué es genial?: Porque el Hijo no "se ensucia" con la lógica de la base de datos o IDs. Él solo maneja su propia interfaz (sumar, restar) y cuando el usuario confirma, emite un evento: onCompra(cantidad).
Beneficio: Podrías usar este mismo componente en otra página totalmente distinta (por ejemplo, una lista de donaciones) y funcionaría igual, porque solo espera una función que reciba un número.
2. La Magia del "Closure" en el Padre
El punto neurálgico es la función crearCallbackCompra(productoId). Esto se conoce como currificación o funciones de orden superior.
javascript
onCompra={crearCallbackCompra(producto.id)}
Usa el código con precaución.
Lo que sucede: En lugar de pasarle al hijo una función genérica, el padre le pasa una "bomba de tiempo" ya programada.
El ID está "atrapado": Gracias al closure, cuando el hijo hace onCompra(cantidad), la función ya "recuerda" internamente a qué productoId pertenecía desde el momento en que fue creada en el .map().
3. Actualización Inmutable y Segura
Dentro de setProductos, usas .map(). Esta es la forma correcta y profesional de actualizar estados en React:
No mutas: No haces producto.stock = nuevoStock. Creas un objeto nuevo { ...producto, stock: nuevoStock }.
Reactividad: Al devolver un array nuevo, React detecta el cambio instantáneamente y refresca la pantalla.
4. El Historial: El "Efecto Secundario"
Es brillante que el Padre aproveche el mismo evento para actualizar dos estados:
Actualiza el stock en el array de productos.
Agrega una entrada al array de historial.
Esto demuestra que el Padre es el único cerebro de la operación. El hijo ni se entera de que existe un historial.
⚠️ Una pequeña observación técnica
En la función crearCallbackCompra, estás llamando a setHistorial dentro de un setProductos.
Consejo: Aunque funciona, lo ideal en React es no "anidar" setters de estado. Sería más limpio hacer la lógica, calcular el nuevoStock y luego llamar a ambos setters por separado o usar un solo estado que contenga tanto productos como historial.
🎯 Conclusión del patrón
Este código implementa perfectamente el concepto de Componentes Inteligentes (Padre) vs Componentes Tontos/De Presentación (Hijo).
Cambios realizados:
❌ Antes (Problemático):
javascript
setProductos(productosAnteriores => {
  return productosAnteriores.map(producto => {
    if (producto.id === productoId) {
      // ⚠️ ANIDACIÓN PROBLEMÁTICA
      setHistorial(historialAnterior => [...]); // Dentro de setProductos
      return { ...producto, stock: nuevoStock };
    }
    return producto;
  });
});
✅ Después (Limpio):
javascript
// 1. Validación separada
const producto = productos.find(p => p.id === productoId);
if (nuevoStock < 0) return;
 
// 2. Actualización de productos (sin anidar)
setProductos(productosAnteriores => 
  productosAnteriores.map(p => 
    p.id === productoId ? { ...p, stock: nuevoStock } : p
  )
);
 
// 3. Actualización de historial (separado)
setHistorial(historialAnterior => [
  ...historialAnterior,
  { /* datos del historial */ }
]);/*
🎯 Ventajas del nuevo patrón:
1. Predictibilidad
Cada setState se ejecuta de forma independiente
No hay efectos secundarios inesperados
2. Performance
React puede optimizar mejor las actualizaciones separadas
Evita re-renders innecesarios
3. Debugging
Más fácil de seguir el flujo de ejecución
Cada actualización tiene su propósito claro
4. Mantenibilidad
Código más legible y modular
Fácil de modificar o extender
🏆 Patrón React recomendado:
javascript
// ✅ Correcto: Separar lógica de actualizaciones
const manejarCambio = () => {
  // 1. Validar y calcular
  const resultado = calcularNuevoEstado();
  
  // 2. Actualizar estados por separado
  setEstado1(resultado.nuevoValor1);
  setEstado2(resultado.nuevoValor2);
};
 
// ❌ Evitar: Anidar setters
const manejarCambio = () => {
  setEstado1(previo => {
    setEstado2(otroValor); // Problemático
    return nuevoValor1;
  });
};
Ahora el código sigue las mejores prácticas de React y es más maintainable y predecible.
¿Por qué el cambio es tan crucial?
En React, la función que pasás dentro de un setEstado(prev => ...) debe ser una función pura.
Función Pura: Solo toma una entrada (el estado anterior) y devuelve una salida (el nuevo estado). No debe "tocar" nada de afuera.
El Riesgo: Si metés un setHistorial dentro de un setProductos, y React por alguna razón decide re-ejecutar esa actualización (por ejemplo, por una interrupción de prioridad), podrías terminar con entradas duplicadas en el historial pero una sola resta en el stock.
🎨 Visualizando el Flujo Limpio
Ahora tu arquitectura se ve así de profesional:
Captura del Evento: El Hijo emite onCompra(5).
Capa de Negocio: El Padre busca el producto y valida: "¿Hay stock? Sí".
Despacho de Estados:
setProductos: Actualiza la "base de datos" visual.
setHistorial: Registra la transacción para la auditoría.
Batching: React nota que llamaste a dos setters juntos y, muy probablemente, hará un solo re-render para actualizar toda la interfaz de un tirón.
🚀 El toque final: ¿Qué pasa si el stock llega a cero?
Con este patrón limpio, podrías agregar una lógica extra en el Paso 1 (Validar). Por ejemplo:
javascript
const ejecutarCompra = (cantidad) => {
  const producto = productos.find(p => p.id === productoId);
  const nuevoStock = producto.stock - cantidad;

  if (nuevoStock < 0) {
    alert("¡Ups! Alguien te ganó de mano, ya no queda stock.");
    return; // Cortamos la ejecución antes de tocar los estados
  }

  // Si pasa la validación, disparamos los setters...
};
 */
// 🎓 VERSIÓN 3: PADRE E HIJO CON TODAS LAS CONSIDERACIONES Y MEJORES PRÁCTICAS

/**
 * 📋 INSTRUCCIONES Y DOCUMENTACIÓN COMPLETA
 * 
 * Este código implementa el patrón React más robusto y profesional:
 * 1. Componente Hijo "Tonto" - Solo maneja UI y emite eventos
 * 2. Componente Padre "Inteligente" - Maneja toda la lógica de negocio
 * 3. Comunicación limpia sin IDs explícitos para el hijo
 * 4. Actualización de estado sin setters anidados
 * 5. Validaciones y manejo de errores
 * 6. Inmutabilidad y mejores prácticas de React
 */

import { useState } from 'react';

/**
 * 🛒 COMPONENTE HIJO V3 - "Tonto" y Reutilizable
 * 
 * PRINCIPIOS DE DISEÑO:
 * - Solo conoce su estado local (cantidad)
 * - No sabe de IDs, ni de lógica de negocio
 * - Solo emite eventos: onCompra(cantidad)
 * - 100% reutilizable en cualquier contexto
 */
export function ItemV3({ nombre, stockActual, onCompra }) {
  // 🔄 ESTADO LOCAL: Borrador de compra (única responsabilidad del hijo)
  const [cantidad, setCantidad] = useState(0);

  // ➕ FUNCIÓN SUMAR: Validación local de UI
  const sumar = () => {
    if (cantidad < stockActual) {
      setCantidad(cantidad + 1);
    }
  };

  // ➖ FUNCIÓN RESTAR: Validación local de UI  
  const restar = () => {
    if (cantidad > 0) {
      setCantidad(cantidad - 1);
    }
  };

  // 🎯 FUNCIÓN EJECUTAR COMPRA: Emisión de evento puro
  const ejecutarCompra = () => {
    if (cantidad > 0) {
      // 📤 El hijo solo emite la cantidad, no sabe de qué producto es
      // El padre le dice al hijo: "Ejecutá esta función (onCompra) 
      // cuando pase algo, y pasame el dato que yo necesito (cantidad)".
      //// Aquí es donde el hijo "grita" hacia el padre:
      onCompra(cantidad);
      // 🧹 Limpieza inmediata del estado local
      setCantidad(0);
    }
  };

  // 📊 Cálculo derivado para feedback visual (solo UI)
  const stockResultante = stockActual - cantidad;
  const puedeComprar = cantidad > 0 && stockActual > 0;

  return (
    <div style={cardStyle}>
      {/* 📦 Información del producto (solo lectura) */}
      <h3>{nombre}</h3>
      <p>Stock disponible: <strong>{stockActual}</strong></p>
      
      {/* 🎛️ Control de cantidad (estado local) */}
      <div style={selectorStyle}>
        <button 
          onClick={restar} 
          disabled={cantidad === 0}
          aria-label="Reducir cantidad"
        >
          -
        </button>
        
        <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
          {cantidad}
        </span>
        
        <button 
          onClick={sumar} 
          disabled={cantidad >= stockActual}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      {/* 💬 Feedback visual dinámico */}
      <p style={{ 
        color: stockResultante < 5 ? 'red' : stockResultante < 10 ? 'orange' : 'gray', 
        fontSize: '0.85em',
        fontWeight: stockResultante < 5 ? 'bold' : 'normal'
      }}>
        {cantidad > 0 
          ? `Quedarían ${stockResultante} unidades` 
          : 'Seleccione cantidad para comprar'
        }
      </p>

      {/* 🎮 Botón de acción (emisión de evento) */}
      <button 
        onClick={ejecutarCompra} 
        disabled={!puedeComprar}
        style={{
          ...btnCompraStyle,
          backgroundColor: puedeComprar ? '#007bff' : '#6c757d',
          cursor: puedeComprar ? 'pointer' : 'not-allowed'
        }}
      >
        {cantidad > 0 ? `Comprar ${cantidad}` : 'Confirmar Compra'}
      </button>
    </div>
  );
}

/**
 * 🏪 COMPONENTE PADRE V3 - "Inteligente" y Centralizado
 * 
 * RESPONSABILIDADES:
 * - Mantener el estado global (productos, historial)
 * - Crear callbacks específicos con closures
 * - Validar lógica de negocio
 * - Actualizar múltiples estados de forma segura
 * - Manejar errores y casos límite
 */
export function TiendaVirtualV3() {
  // 🗄️ ESTADO GLOBAL: Fuente única de verdad
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Laptop Gamer Pro", stock: 15, precio: 1200 },
    { id: 2, nombre: "Mouse Inalámbrico", stock: 8, precio: 45 },
    { id: 3, nombre: "Monitor 4K Ultra", stock: 3, precio: 350 },
    { id: 4, nombre: "Teclado Mecánico RGB", stock: 12, precio: 89 }
  ]);

  // 📝 ESTADO DE AUDITORÍA: Historial de transacciones
  const [historial, setHistorial] = useState([]);

  // 🎛️ ESTADO DE UI: Control de interfaz
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  /**
   * 🎯 FUNCIÓN CREADORA DE CALLBACKS - Patrón Closure
   * 
   * TÉCNICA: Cada hijo recibe una función "pre-programada"
   * El closure "atrapa" el productoId para que el hijo no lo necesite
   * Gestión de Estado y Funciones de Orden Superior (Closures)
Para que el hijo no necesite manejar IDs, usamos una técnica avanzada en el Padre:
Callback Pre-configurado: Al mapear los productos, el padre crea una función específica para cada item:
 onCompra={() => manejarCompra(producto.id, cantidad)}.
Beneficio: El hijo simplemente llama a onCompra(cantidad).
 El ID ya está "atrapado" en la función gracias al Closure de JavaScript.
  El hijo es más simple y reutilizable.
   */
  const crearCallbackCompra = (productoId) => {
    return (cantidad) => {
      console.log(`🛒 Iniciando compra: Producto ${productoId}, Cantidad ${cantidad}`);
      
      // 🎯 FASE 1: Validación de negocio (antes de tocar estados)
      const producto = productos.find(p => p.id === productoId);
      
      if (!producto) {
        console.error(`❌ Producto ${productoId} no encontrado`);
        alert('Error: Producto no disponible');
        return;
      }

      if (cantidad <= 0) {
        console.warn('⚠️ Cantidad inválida');
        alert('Error: La cantidad debe ser mayor a cero');
        return;
      }

      const nuevoStock = producto.stock - cantidad;
      
      if (nuevoStock < 0) {
        console.warn(`❌ Stock insuficiente para ${producto.nombre}`);
        alert(`¡Ups! Solo quedan ${producto.stock} unidades de ${producto.nombre}`);
        return;
      }

      // 🎯 FASE 2: Preparación de datos (sin mutar estado original)
      const entradaHistorial = {
        id: Date.now(), // ID único para la entrada
        producto: producto.nombre,
        productoId: productoId,
        cantidad: cantidad,
        precioUnitario: producto.precio,
        total: producto.precio * cantidad,
        stockAnterior: producto.stock,
        stockNuevo: nuevoStock,
        timestamp: new Date().toISOString(),
        estado: nuevoStock === 0 ? 'AGOTADO' : 'DISPONIBLE'
      };

      // 🎯 FASE 3: Actualización atómica de estados (separados, no anidados)
      
      // 3.1 Actualizar inventario (inmutable)
      setProductos(productosAnteriores =>
        productosAnteriores.map(p =>
          p.id === productoId
            ? { ...p, stock: nuevoStock }
            : p
        )
      );

      // 3.2 Actualizar historial (separado)
      setHistorial(historialAnterior => [
        entradaHistorial,
        ...historialAnteriores
      ]);

      // 🎯 FASE 4: Feedback al usuario
      console.log(`✅ Compra exitosa: ${producto.nombre} x${cantidad}`);
      
      if (nuevoStock === 0) {
        setTimeout(() => {
          alert(`🎉 ¡Felicidades! ${producto.nombre} se ha agotado por completo.`);
        }, 100);
      }
    };
  };

  /**
   * 🎮 FUNCIÓN AUXILIAR: Reinicio completo del sistema
   */
  const reiniciarSistema = () => {
    setProductos([
      { id: 1, nombre: "Laptop Gamer Pro", stock: 15, precio: 1200 },
      { id: 2, nombre: "Mouse Inalámbrico", stock: 8, precio: 45 },
      { id: 3, nombre: "Monitor 4K Ultra", stock: 3, precio: 350 },
      { id: 4, nombre: "Teclado Mecánico RGB", stock: 12, precio: 89 }
    ]);
    setHistorial([]);
    setMostrarHistorial(false);
    console.log('🔄 Sistema reiniciado completamente');
  };

  /**
   * 📊 FUNCIÓN AUXILIAR: Estadísticas del sistema
   */
  const obtenerEstadisticas = () => {
    const totalProductos = productos.length;
    const productosConStock = productos.filter(p => p.stock > 0).length;
    const totalUnidades = productos.reduce((sum, p) => sum + p.stock, 0);
    const valorTotalInventario = productos.reduce((sum, p) => sum + (p.stock * p.precio), 0);
    const totalVentas = historial.reduce((sum, h) => sum + h.total, 0);

    return {
      totalProductos,
      productosConStock,
      totalUnidades,
      valorTotalInventario,
      totalVentas,
      productosAgotados: totalProductos - productosConStock
    };
  };

  const stats = obtenerEstadisticas();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏪 Tienda Virtual V3 - Arquitectura Profesional</h1>
      
      {/* 📊 PANEL DE CONTROL - Estado Global */}
      <div style={{ 
        border: '2px solid #007bff', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2>📊 Panel de Control</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#007bff' }}>{stats.totalProductos}</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Productos Totales</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#28a745' }}>{stats.productosConStock}</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Con Stock</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#dc3545' }}>{stats.productosAgotados}</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Agotados</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#6f42c1' }}>${stats.valorTotalInventario}</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Valor Inventario</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#fd7e14' }}>${stats.totalVentas}</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Ventas Totales</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={reiniciarSistema}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Reiniciar Sistema
          </button>
          <button 
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
            style={{ 
              padding: '8px 16px',
              backgroundColor: mostrarHistorial ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {mostrarHistorial ? '📋 Ocultar' : '📋 Mostrar'} Historial
          </button>
        </div>
      </div>

      {/* 🛍️ CATÁLOGO DE PRODUCTOS - Renderizado con callbacks específicos */}
      <div style={{ marginBottom: '20px' }}>
        <h2>🛍️ Catálogo de Productos</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px'
        }}>
          {productos.map(producto => (
            <div key={producto.id}>
              <ItemV3
                nombre={producto.nombre}
                stockActual={producto.stock}
                // 🎯 CALLBACK ESPECÍFICO: Cada hijo recibe su función personalizada
                //*********************************************** */
                onCompra={crearCallbackCompra(producto.id)}
                //*********************************************** */
              />
              
              {/* 💰 Información adicional del producto */}
              <div style={{ 
                textAlign: 'center', 
                padding: '10px', 
                backgroundColor: '#f8f9fa',
                borderRadius: '0 0 8px 8px',
                marginTop: '-10px'
              }}>
                <div style={{ fontWeight: 'bold', color: '#007bff' }}>${producto.precio}</div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  Valor total: ${producto.precio * producto.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📋 HISTORIAL DE TRANSACCIONES - Estado de auditoría */}
      {mostrarHistorial && historial.length > 0 && (
        <div style={{ 
          border: '2px solid #28a745', 
          padding: '20px', 
          borderRadius: '12px',
          backgroundColor: '#f8fff8'
        }}>
          <h2>📋 Historial de Transacciones</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {historial.map((entrada, index) => (
              <div key={entrada.id} style={{ 
                border: '1px solid #ddd', 
                padding: '12px', 
                margin: '8px 0',
                borderRadius: '8px',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{entrada.producto}</strong>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {entrada.cantidad} unidades × ${entrada.precioUnitario} = <strong>${entrada.total}</strong>
                  </div>
                  <div style={{ fontSize: '0.8em', color: '#999' }}>
                    Stock: {entrada.stockAnterior} → {entrada.stockNuevo}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '0.8em', 
                    color: entrada.estado === 'AGOTADO' ? '#dc3545' : '#28a745',
                    fontWeight: 'bold'
                  }}>
                    {entrada.estado}
                  </div>
                  <div style={{ fontSize: '0.75em', color: '#999' }}>
                    {new Date(entrada.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎓 DOCUMENTACIÓN EN VIVO */}
      <div style={{ 
        border: '2px solid #6f42c1', 
        padding: '20px', 
        borderRadius: '12px',
        backgroundColor: '#f8f9fa',
        marginTop: '20px'
      }}>
        <h3>🎓 Arquitectura Implementada</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>🎯 Principio "Props Down, Events Up":</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            <li>Padre → Hijo: Datos vía props (stockActual, nombre)</li>
            <li>Hijo → Padre: Eventos vía callbacks (onCompra)</li>
            <li>Flujo unidireccional predecible</li>
          </ul>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>🔧 Técnica de Closures:</strong>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '0.85em',
            overflow: 'auto'
          }}>
{`// Cada hijo recibe una función "pre-programada"
crearCallbackCompra(productoId) → (cantidad) => {
  // Esta función "recuerda" el productoId
  // El hijo solo pasa cantidad
};`}
          </pre>
        </div>

        <div>
          <strong>✅ Mejores Prácticas React:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            <li>Componentes "tontos" vs "inteligentes"</li>
            <li>Actualización inmutable de estado</li>
            <li>Sin setters anidados</li>
            <li>Validaciones before state updates</li>
            <li>Separación de responsabilidades</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 🎨 Estilos reutilizables y consistentes
const cardStyle = { 
  border: '2px solid #eee', 
  padding: '20px', 
  borderRadius: '12px', 
  width: '100%', 
  textAlign: 'center',
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const selectorStyle = { 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  gap: '15px', 
  margin: '15px 0' 
};

const btnCompraStyle = { 
  color: 'white', 
  border: 'none', 
  padding: '12px 24px', 
  borderRadius: '6px', 
  cursor: 'pointer',
  fontSize: '1em',
  fontWeight: 'bold',
  transition: 'all 0.2s ease'
};

/**
 * 🎓 RESUMEN DE PATRONES IMPLEMENTADOS
 * 
 * 1. COMPONENTE HIJO "TONTO":
 *    - Solo maneja UI y estado local
 *    - No conoce lógica de negocio
 *    - Emite eventos puros
 * 
 * 2. COMPONENTE PADRE "INTELIGENTE":
 *    - Maneja toda la lógica de negocio
 *    - Crea callbacks con closures
 *    - Actualiza múltiples estados
 *    - Valida y maneja errores
 * 
 * 3. COMUNICACIÓN LIMPIA:
 *    - Props down, events up
 *    - Sin IDs explícitos para el hijo
 *    - Callbacks pre-configurados
 * 
 * 4. MEJORES PRÁCTICAS:
 *    - Inmutabilidad
 *    - Sin setters anidados
 *    - Validaciones before mutations
 *    - Separación de responsabilidades
 *    - Manejo de errores
 *    - Feedback al usuario
 */