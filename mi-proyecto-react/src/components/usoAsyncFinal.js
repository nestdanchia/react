//javascript
/**
 * 🎓 VERSIÓN FINAL - Patrón de Closures sin Side Effects
 * 
 * Conceptos clave:
 * - Hijo "tonto": solo UI y estado local
 * - Padre "inteligente": toda la lógica de negocio
 * - Closure: función que "recuerda" el ID del producto
 * - Sin side effects: funciones puras
 */

import { useState } from 'react';

/**
 * 🛒 COMPONENTE HIJO - "Tonto" y Puro
 * 
 * Responsabilidades:
 * - Manejar estado local (cantidad)
 * - Emitir eventos: onCompra(cantidad)
 * - Sin lógica de negocio
 */
export function Item({ nombre, stockActual, onCompra }) {
  const [cantidad, setCantidad] = useState(0);

  const sumar = () => {
    if (cantidad < stockActual) setCantidad(cantidad + 1);
  };

  const restar = () => {
    if (cantidad > 0) setCantidad(cantidad - 1);
  };

  const ejecutarCompra = () => {
    if (cantidad > 0) {
      onCompra(cantidad); // 📤 Emite evento al padre
      setCantidad(0);     // 🧹 Limpia estado local
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', margin: '10px' }}>
      <h3>{nombre}</h3>
      <p>Stock: {stockActual}</p>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={restar} disabled={cantidad === 0}>-</button>
        <span>{cantidad}</span>
        <button onClick={sumar} disabled={cantidad >= stockActual}>+</button>
      </div>

      <button 
        onClick={ejecutarCompra} 
        disabled={cantidad === 0}
        style={{ marginTop: '10px', padding: '5px 10px' }}
      >
        Comprar {cantidad}
      </button>
    </div>
  );
}

/**
 * 🏪 COMPONENTE PADRE - "Inteligente" con Closures
 * 
 * Responsabilidades:
 * - Estado global (productos)
 * - Crear callbacks con closures
 * - Validación de negocio
 * - Actualización de estado
 */
export function TiendaVirtual() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Laptop", stock: 10 },
    { id: 2, nombre: "Mouse", stock: 5 },
    { id: 3, nombre: "Monitor", stock: 2 }
  ]);

  /**
   * 🎯 FUNCIÓN CREADORA DE CALLBACKS - Closure Puro
   * 
   * Técnica: Cada hijo recibe una función que "recuerda" su ID
   */
  const crearCallbackCompra = (productoId) => {
    // Closure: productoId queda "atrapado" en esta función
    return (cantidad) => {
      console.log(`Compra: Producto ${productoId}, Cantidad ${cantidad}`);
      
      // Validación pura (sin side effects)
      const producto = productos.find(p => p.id === productoId);
      if (!producto) {
        alert('Producto no encontrado');
        return;
      }

      const nuevoStock = producto.stock - cantidad;
      if (nuevoStock < 0) {
        alert('Stock insuficiente');
        return;
      }

      // Actualización de estado (inmutable)
      setProductos(productosAnteriores =>
        productosAnteriores.map(p =>
          p.id === productoId
            ? { ...p, stock: nuevoStock }
            : p
        )
      );

      console.log(`✅ Compra exitosa: ${producto.nombre} x${cantidad}`);
    };
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tienda Virtual - Closures</h1>
      
      {/* 🎯 COMUNICACIÓN PADRE→HIJO */}
      {productos.map(producto => (
        <Item
          key={producto.id}
          nombre={producto.nombre}
          stockActual={producto.stock}
          // 🔄 CLOSURE: Cada hijo recibe su función personalizada
          // El hijo no sabe el ID, solo pasa cantidad
          onCompra={crearCallbackCompra(producto.id)}
        />
      ))}

      {/* 📊 Estado Actual */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <h3>Estado del Inventario:</h3>
        {productos.map(producto => (
          <div key={producto.id}>
            {producto.nombre}: {producto.stock} unidades
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 🎓 RESUMEN DEL PATRÓN
 * 
 * 1. HIJO "TONTO":
 *    - Solo maneja UI y estado local
 *    - Emite onCompra(cantidad)
 *    - No conoce IDs ni lógica de negocio
 * 
 * 2. PADRE "INTELIGENTE":
 *    - Maneja estado global
 *    - Crea callbacks con closures
 *    - Valida y actualiza estado
 * 
 * 3. COMUNICACIÓN:
 *    - Línea clave: onCompra={crearCallbackCompra(producto.id)}
 *    - El closure "atrapa" el ID para el hijo
 *    - El hijo solo pasa cantidad
 * 
 * 4. BENEFICIOS:
 *    - Componentes reutilizables
 *    - Sin side effects
 *    - Lógica centralizada
 *    - Código limpio y predecible
 */
