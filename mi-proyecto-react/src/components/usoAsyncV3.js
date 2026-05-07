//javascript
/**
 * 🎓 VERSIÓN 3: EJEMPLO LIMPIO DE CLOSURES SIN SIDE EFFECTS
 * 
 * CONCEPTO CLAVE:
 * - El hijo es "tonto": solo conoce su estado local y emite eventos
 * - El padre es "inteligente": maneja toda la lógica de negocio
 * - Closure: El padre crea funciones que "recuerdan" el ID del producto
 * - Sin side effects: Cada función tiene una sola responsabilidad
 */

import { useState } from 'react';

/**
 * 🛒 COMPONENTE HIJO - "Tonto" y Puro
 * 
 * PRINCIPIOS DE DISEÑO:
 * 1. Solo maneja su estado local (cantidad)
 * 2. No sabe de IDs, precios, ni lógica de negocio
 * 3. Solo emite eventos: onCompra(cantidad)
 * 4. 100% reutilizable en cualquier contexto
 * 5. Sin side effects: Solo UI, no lógica de negocio
 */
export function Item({ nombre, stockActual, onCompra }) {
  // 🔄 ESTADO LOCAL: Única responsabilidad del hijo
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
      // 📤 El hijo solo emite la cantidad, sin saber nada más
      // No hay side effects aquí: solo comunicación con el padre
      onCompra(cantidad);
      
      // 🧹 Limpieza inmediata del estado local
      setCantidad(0);
    }
  };

  // 📊 Cálculos derivados (solo para UI, sin lógica de negocio)
  const stockResultante = stockActual - cantidad;
  const puedeComprar = cantidad > 0 && stockActual > 0;
  const stockBajo = stockResultante < 5;
  const stockMedio = stockResultante >= 5 && stockResultante < 10;

  return (
    <div style={styles.card}>
      {/* 📦 Información del producto (solo lectura, props puras) */}
      <h3 style={styles.title}>{nombre}</h3>
      <p style={styles.stockInfo}>
        Stock disponible: <strong>{stockActual}</strong>
      </p>
      
      {/* 🎛️ Control de cantidad (estado local) */}
      <div style={styles.selector}>
        <button 
          onClick={restar} 
          disabled={cantidad === 0}
          style={styles.button}
          aria-label="Reducir cantidad"
        >
          -
        </button>
        
        <span style={styles.cantidad}>
          {cantidad}
        </span>
        
        <button 
          onClick={sumar} 
          disabled={cantidad >= stockActual}
          style={styles.button}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      {/* 💬 Feedback visual dinámico (solo UI) */}
      <p style={{
        ...styles.feedback,
        color: stockBajo ? '#dc3545' : stockMedio ? '#fd7e14' : '#6c757d',
        fontWeight: stockBajo ? 'bold' : 'normal'
      }}>
        {cantidad > 0 
          ? `Quedarían ${stockResultante} unidades` 
          : 'Seleccione cantidad para comprar'
        }
      </p>

      {/* 🎮 Botón de acción (emisión de evento pura) */}
      <button 
        onClick={ejecutarCompra} 
        disabled={!puedeComprar}
        style={{
          ...styles.buyButton,
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
 * 🏪 COMPONENTE PADRE - "Inteligente" y Centralizado
 * 
 * RESPONSABILIDADES:
 * 1. Mantener el estado global (productos, historial)
 * 2. Crear callbacks específicos con closures
 * 3. Validar lógica de negocio
 * 4. Actualizar múltiples estados de forma segura
 * 5. Manejar errores y casos límite
 * 6. Sin side effects en las funciones del hijo
 */
export function TiendaVirtual() {
  // 🗄️ ESTADO GLOBAL: Fuente única de verdad
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Laptop Pro", stock: 10, precio: 1200 },
    { id: 2, nombre: "Mouse Gamer", stock: 5, precio: 45 },
    { id: 3, nombre: "Monitor 4K", stock: 2, precio: 350 },
    { id: 4, nombre: "Teclado RGB", stock: 8, precio: 89 }
  ]);

  // 📝 ESTADO DE AUDITORÍA: Historial de transacciones
  const [historial, setHistorial] = useState([]);

  /**
   * 🎯 FUNCIÓN CREADORA DE CALLBACKS - Patrón Closure Puro
   * 
   * TÉCNICA DE CLOSURE:
   * - Cada hijo recibe una función "pre-programada"
   * - El closure "atrapa" el productoId para que el hijo no lo necesite
   * - El hijo solo pasa cantidad, el padre ya sabe el ID
   * 
   * BENEFICIOS:
   * - El hijo es más simple y reutilizable
   * - No hay side effects en el componente hijo
   * - La lógica de negocio está centralizada en el padre
   */
  const crearCallbackCompra = (productoId) => {
    // 🔄 CLOSURE: Esta función "recuerda" el productoId
    // Cuando el hijo llame a esta función, el productoId estará disponible
    //Cuando hacés onCompra={crearCallbackCompra(producto.id)}, 
    // "El hijo recibe la función que retorna crearCallbackCompra".

    return (cantidad) => {
      console.log(`🛒 Iniciando compra: Producto ${productoId}, Cantidad ${cantidad}`);
      
      // 🎯 FASE 1: Validación de negocio (antes de tocar estados)
      // Esta es una función pura: solo valida y retorna resultados
      const resultadoValidacion = validarCompra(productoId, cantidad);
      
      if (!resultadoValidacion.esValida) {
        console.error(`❌ Validación fallida: ${resultadoValidacion.error}`);
        alert(resultadoValidacion.error);
        return;
      }

      // 🎯 FASE 2: Preparación de datos (sin mutar estado original)
      const entradaHistorial = crearEntradaHistorial(
        resultadoValidacion.producto, 
        cantidad, 
        resultadoValidacion.nuevoStock
      );

      // 🎯 FASE 3: Actualización atómica de estados (separados, no anidados)
      // Actualización del inventario
      setProductos(productosAnteriores =>
        productosAnteriores.map(p =>
          p.id === productoId
            ? { ...p, stock: resultadoValidacion.nuevoStock }
            : p
        )
      );

      // Actualización del historial (separada, sin side effects)
      setHistorial(historialAnterior => [
        entradaHistorial,
        ...historialAnteriores
      ]);

      // 🎯 FASE 4: Feedback al usuario
      console.log(`✅ Compra exitosa: ${resultadoValidacion.producto.nombre} x${cantidad}`);
      
      // Notificación especial si se agota el producto
      if (resultadoValidacion.nuevoStock === 0) {
        setTimeout(() => {
          alert(`🎉 ¡Felicidades! ${resultadoValidacion.producto.nombre} se ha agotado.`);
        }, 100);
      }
    };
  };

  /**
   * 🔍 FUNCIÓN PURA DE VALIDACIÓN - Sin side effects
   * 
   * RESPONSABILIDAD: Solo validar y retornar resultado
    const nuevoStock = producto.stock - cantidad;
    
    if (nuevoStock < 0) {
      return {
        esValida: false,
        error: `Solo quedan ${producto.stock} unidades de ${producto.nombre}`,
        producto,
        nuevoStock: null
      };
    }

    return {
      esValida: true,
      error: null,
      producto,
      nuevoStock
    };
  };

  /**
   * 📋 FUNCIÓN PURA DE CREACIÓN - Sin side effects
   * 
   * RESPONSABILIDAD: Solo crear el objeto de historial
   * No modifica ningún estado, solo crea datos
   */
  const crearEntradaHistorial = (producto, cantidad, nuevoStock) => {
    return {
      id: Date.now(), // ID único para la entrada
      producto: producto.nombre,
      productoId: producto.id,
      cantidad: cantidad,
      precioUnitario: producto.precio,
      total: producto.precio * cantidad,
      stockAnterior: producto.stock,
      stockNuevo: nuevoStock,
      timestamp: new Date().toISOString(),
      estado: nuevoStock === 0 ? 'AGOTADO' : 'DISPONIBLE'
    };
  };

  /**
   * 🎮 FUNCIÓN AUXILIAR: Reinicio del sistema
   */
  const reiniciarSistema = () => {
    setProductos([
      { id: 1, nombre: "Laptop Pro", stock: 10, precio: 1200 },
      { id: 2, nombre: "Mouse Gamer", stock: 5, precio: 45 },
      { id: 3, nombre: "Monitor 4K", stock: 2, precio: 350 },
      { id: 4, nombre: "Teclado RGB", stock: 8, precio: 89 }
    ]);
    setHistorial([]);
    console.log('🔄 Sistema reiniciado');
  };

  /**
   * 📊 FUNCIÓN PURA: Estadísticas del sistema
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
    <div style={styles.container}>
      <h1 style={styles.title}>🏪 Tienda Virtual - Closures sin Side Effects</h1>
      
      {/* 📊 PANEL DE CONTROL - Estado Global */}
      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>📊 Estado del Sistema</h2>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.totalProductos}</div>
            <div style={styles.statLabel}>Productos</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.productosConStock}</div>
            <div style={styles.statLabel}>Con Stock</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.productosAgotados}</div>
            <div style={styles.statLabel}>Agotados</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>${stats.valorTotalInventario}</div>
            <div style={styles.statLabel}>Valor Total</div>
          </div>
        </div>

        <button 
          onClick={reiniciarSistema}
          style={styles.resetButton}
        >
          🔄 Reiniciar Sistema
        </button>
      </div>

      {/* 🛍️ CATÁLOGO DE PRODUCTOS - Renderizado con closures */}
      <div style={styles.catalogo}>
        <h2 style={styles.panelTitle}>🛍️ Catálogo de Productos</h2>
        <div style={styles.productGrid}>
          {productos.map(producto => (
            <div key={producto.id} style={styles.productCard}>
              <Item
                nombre={producto.nombre}
                stockActual={producto.stock}
                // 🎯 CLOSURE: Cada hijo recibe su función personalizada
                // El closure "atrapa" el productoId, el hijo no lo necesita
                //Debido a que el Padre ejecutó crearCallbackCompra(id) cuatro veces 
                // dentro del .map, se crearon 4 funciones independientes en memoria.
                //Función 1: Tiene "atrapado" el id: 1 (Laptop).
/**Función 2: Tiene "atrapado" el id: 2 (Mouse)
                /****************************/
                 
                onCompra={crearCallbackCompra(producto.id)}
               
              />
              
           
              {/* 💰 Información adicional del producto */}
              <div style={styles.productInfo}>
                <div style={styles.price}>${producto.precio}</div>
                <div style={styles.totalValue}>
                  Total: ${producto.precio * producto.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📋 HISTORIAL DE TRANSACCIONES */}
      {historial.length > 0 && (
        <div style={styles.historial}>
          <h2 style={styles.panelTitle}>📋 Historial de Transacciones</h2>
          <div style={styles.historialList}>
            {historial.map((entrada) => (
              <div key={entrada.id} style={styles.historialItem}>
                <div style={styles.historialInfo}>
                  <strong>{entrada.producto}</strong>
                  <div style={styles.historialDetail}>
                    {entrada.cantidad} × ${entrada.precioUnitario} = <strong>${entrada.total}</strong>
                  </div>
                  <div style={styles.historialStock}>
                    Stock: {entrada.stockAnterior} → {entrada.stockNuevo}
                  </div>
                </div>
                <div style={styles.historialMeta}>
                  <div style={{
                    ...styles.estadoBadge,
                    backgroundColor: entrada.estado === 'AGOTADO' ? '#dc3545' : '#28a745'
                  }}>
                    {entrada.estado}
                  </div>
                  <div style={styles.timestamp}>
                    {new Date(entrada.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎓 DOCUMENTACIÓN DEL PATRÓN */}
      <div style={styles.documentacion}>
        <h3 style={styles.panelTitle}>🎓 Patrón de Closures</h3>
        
        <div style={styles.seccion}>
          <strong>🔧 Técnica de Closure:</strong>
          <pre style={styles.codeBlock}>
{`// El padre crea una función que "recuerda" el ID
const crearCallbackCompra = (productoId) => {
  // Closure: productoId queda "atrapado" en esta función
  return (cantidad) => {
    // Cuando el hijo llama a esta función,
    // productoId sigue disponible aquí
    console.log(\`Producto \${productoId}: \${cantidad} unidades\`);
    // Lógica de negocio...
  };
};

// Cada hijo recibe su callback personalizado
<Item onCompra={crearCallbackCompra(1)} />  // Para producto 1
<Item onCompra={crearCallbackCompra(2)} />  // Para producto 2`}
          </pre>
        </div>

        <div style={styles.seccion}>
          <strong>✅ Beneficios del Patrón:</strong>
          <ul style={styles.beneficiosList}>
            <li><strong>Hijo "Tonto":</strong> Solo maneja UI, no conoce lógica de negocio</li>
            <li><strong>Padre "Inteligente":</strong> Centraliza toda la lógica</li>
            <li><strong>Sin Side Effects:</strong> Funciones puras, predecibles</li>
            <li><strong>Reutilizable:</strong> El mismo Item sirve para cualquier producto</li>
            <li><strong>Separación:</strong> UI vs lógica de negocio claramente separadas</li>
          </ul>
        </div>

        <div style={styles.seccion}>
          <strong>🎯 Flujo de Comunicación:</strong>
          <div style={styles.flujoDiagram}>
            <div style={styles.flujoItem}>
              <strong>Padre → Hijo:</strong>
              /************* */
              <div style={styles.flujoDetail}>Props (nombre, stockActual, onCompra)</div>
            </div>
            <div style={styles.flujoArrow}>↓</div>
            <div style={styles.flujoItem}>
              <strong>Hijo:</strong>
              <div style={styles.flujoDetail}>Maneja UI local (cantidad)</div>
            </div>
            <div style={styles.flujoArrow}>↑</div>
            <div style={styles.flujoItem}>
              <strong>Hijo → Padre:</strong>
              /************* */
              <div style={styles.flujoDetail}>Evento (onCompra(cantidad))</div>
            </div>
            <div style={styles.flujoArrow}>↓</div>
            <div style={styles.flujoItem}>
              <strong>Padre:</strong>
              <div style={styles.flujoDetail}>Actualiza estado global</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎨 Estilos consistentes y reutilizables
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  
  title: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '30px',
    fontSize: '2em'
  },
  
  panel: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  
  panelTitle: {
    color: '#007bff',
    marginBottom: '15px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '5px'
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  
  statCard: {
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  },
  
  statNumber: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    color: '#007bff'
  },
  
  statLabel: {
    fontSize: '0.9em',
    color: '#6c757d',
    marginTop: '5px'
  },
  
  resetButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1em'
  },
  
  catalogo: {
    marginBottom: '20px'
  },
  
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  
  productCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  
  productInfo: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center'
  },
  
  price: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#28a745'
  },
  
  totalValue: {
    fontSize: '0.9em',
    color: '#6c757d',
    marginTop: '5px'
  },
  
  // Estilos del componente Item
  card: {
    border: '2px solid #eee',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    backgroundColor: 'white'
  },
  
  selector: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    margin: '15px 0'
  },
  
  button: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #007bff',
    backgroundColor: 'white',
    color: '#007bff',
    fontSize: '1.2em',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  
  cantidad: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    minWidth: '60px'
  },
  
  feedback: {
    fontSize: '0.85em',
    margin: '10px 0'
  },
  
  buyButton: {
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    border: 'none',
    transition: 'all 0.2s ease'
  },
  
  stockInfo: {
    color: '#6c757d',
    margin: '10px 0'
  },
  
  // Estilos del historial
  historial: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  
  historialList: {
    maxHeight: '400px',
    overflowY: 'auto'
  },
  
  historialItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  },
  
  historialInfo: {
    flex: 1
  },
  
  historialDetail: {
    fontSize: '0.9em',
    color: '#6c757d',
    marginTop: '5px'
  },
  
  historialStock: {
    fontSize: '0.8em',
    color: '#999',
    marginTop: '3px'
  },
  
  historialMeta: {
    textAlign: 'right',
    marginLeft: '20px'
  },
  
  estadoBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8em',
    fontWeight: 'bold',
    color: 'white'
  },
  
  timestamp: {
    fontSize: '0.75em',
    color: '#999',
    marginTop: '5px'
  },
  
  // Estilos de documentación
  documentacion: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  
  seccion: {
    marginBottom: '20px'
  },
  
  codeBlock: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '0.85em',
    overflow: 'auto',
    border: '1px solid #dee2e6'
  },
  
  beneficiosList: {
    margin: '10px 0',
    paddingLeft: '20px'
  },
  
  flujoDiagram: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
    marginTop: '15px'
  },
  
  flujoItem: {
    padding: '10px',
    backgroundColor: '#e3f2fd',
    borderRadius: '8px',
    border: '1px solid #2196f3'
  },
  
  flujoDetail: {
    fontSize: '0.9em',
    marginTop: '5px'
  },
  
  flujoArrow: {
    textAlign: 'center',
    fontSize: '1.5em',
    color: '#2196f3',
    fontWeight: 'bold'
  }
};

/**
 * 🎓 RESUMEN DEL PATRÓN IMPLEMENTADO
 * 
 * 1. COMPONENTE HIJO "TONTO":
 *    - Solo maneja UI y estado local
 *    - No conoce lógica de negocio
 *    - Emite eventos puros: onCompra(cantidad)
 *    - Sin side effects: funciones puras
 * 
 * 2. COMPONENTE PADRE "INTELIGENTE":
 *    - Maneja toda la lógica de negocio
 *    - Crea callbacks con closures
 *    - Funciones puras de validación
 *    - Actualización separada de estados
 *    - Sin side effects en callbacks
 * 
 * 3. TÉCNICA DE CLOSURE:
 *    - El closure "atrapa" el productoId
 *    - El hijo solo pasa cantidad
 *    - El padre asocia automáticamente
 *    - Comunicación limpia y predecible
 * 
 * 4. MEJORES PRÁCTICAS:
 *    - Funciones puras sin side effects
 *    - Separación de responsabilidades
 *    - Inmutabilidad en actualizaciones
 *    - Validaciones before state mutations
 *    - Componentes reutilizables
 */
/**
 * Al cargarse la página por primera vez, se produce el Renderizado Inicial. Aquí es donde el Padre "fabrica" todo el escenario.
Esto es lo que el usuario ve exactamente y lo que el código hace por detrás:
🖥️ Lo que ve el usuario en pantalla:
Título Principal: Un encabezado que dice 🏪 Tienda Virtual.
Tarjetas de Productos: Verá 4 tarjetas (Laptop, Mouse, Monitor, Teclado). Cada una con:
El nombre del producto.
El texto: "Stock disponible: [Número inicial]" (ej. 10 para la Laptop).
Un selector con un -, el número 0 en el centro, y un +.
Un texto de ayuda en gris: "Seleccione cantidad para comprar".
El Botón de Acción: Un botón de color gris (deshabilitado) que dice "Confirmar Compra".
Historial vacío: Si no hay compras aún, la sección de historial no mostrará nada o estará vacía.
⚙️ Lo que el código ejecutó para llegar a esa vista:
Inicialización de Estados:
productos se llena con el array de 4 objetos.
historial se inicializa como un array vacío [].
Mapeo (.map):
El Padre recorre los 4 productos.
DATO CLAVE: Por cada producto, el Padre ejecuta crearCallbackCompra(id).
Esto genera 4 funciones distintas en la memoria del Padre, cada una "sellada" con su ID correspondiente.
Nacimiento de los Hijos:
Se crean 4 componentes Item.
Cada uno recibe su propia función de compra personalizada (la que retornó el Padre).
Cada hijo nace con su estado local cantidad en 0.
📍 Estado de los Controles (Lógica de UI):
Botón -: Está disabled porque cantidad es 0.
Botón +: Está habilitado (mientras haya stock).
Botón "Confirmar Compra": Está disabled porque la variable puedeComprar es false (ya que cantidad no es mayor a 0).
Resumen: Al inicio, todo está "en espera". El Padre ya dejó instalados los "cables" (callbacks) hacia cada tarjeta, pero nada se moverá hasta que el usuario toque un botón de +.
¿Querés que analicemos qué sucede exactamente cuando el usuario hace el primer clic en el + de un producto?
 * Vista del Usuario: El usuario ve una tarjeta que dice "Laptop Pro",
 *  "Stock disponible: 10" y un botón gris que dice "Confirmar Compra" 
 * (deshabilitado porque cantidad es 0).
 * El usuario hace clic 2 veces en el botón + de la "Laptop Pro".
Acción del Hijo: Ejecuta setCantidad(2).
Cálculo Derivado: El Hijo calcula al vuelo que 10 - 2 = 8.
Vista del Usuario:
El número entre los botones cambia a 2.
Aparece un texto naranja: "Quedarían 8 unidades".
El botón de acción se vuelve azul y ahora dice: "Comprar 2".
3️⃣ Paso 3: El Disparo (El Hijo ejecuta la función retornada)
El usuario hace clic en el botón azul "Comprar 2".
Acción del Hijo: Se dispara ejecutarCompra.
El Vuelo del Dato: El Hijo ejecuta onCompra(2).
Punto Clave: Aquí el Hijo está activando la función que el Padre retornó en el Paso 1. El Hijo solo suelta el "2", el "ID: 1" ya iba dentro del paquete.
Limpieza: Inmediatamente después, el Hijo hace setCantidad(0).
4️⃣ Paso 4: La Validación (El Padre retoma el control inteligente)
La función "despierta" en el Padre con los valores productoId: 1 y cantidad: 2.
Acción del Padre: Llama a la función pura validarCompra(1, 2).
Lógica de Negocio: El Padre busca en su estado: "Tengo la Laptop Pro con ID 1, el stock es 10, me piden 2. El nuevo stock será 8. ¡Es válido!".
Preparación: Crea el objeto para el historial (ej: "Compra de Laptop Pro x2").
5️⃣ Paso 5: Actualización Atómica (La "Fuente de Verdad" cambia)
El Padre actualiza sus dos estados de forma separada y limpia.
Estado 1: setProductos genera un nuevo array donde la Laptop Pro ahora tiene stock: 8.
Estado 2: setHistorial agrega la nueva entrada arriba de todo.
Efecto: React detecta que el estado del Padre cambió y ordena un Re-render.
6️⃣ Paso 6: El Cierre del Ciclo (Sincronización visual)
El Padre se vuelve a dibujar y, por lo tanto, vuelve a renderizar a sus hijos con las nuevas props.
Acción del Padre: El .map() le entrega al Hijo stockActual={8}.
Vista del Usuario:
El stock ahora dice 8.
Como el Hijo reinició su cantidad a 0 en el Paso 3, el botón vuelve a estar gris y dice "Confirmar Compra".
En el panel de abajo, aparece mágicamente el renglón en el Historial de Compras.
🎯 Resumen de Identidades
¿Qué ve el usuario? Un botón que cambia de texto ("Confirmar" -> "Comprar 2" -> "Confirmar").
¿Qué hace el Hijo? Maneja el número "2" y avisa que ya apretaron el botón.
¿Qué hace el Padre? Es el que realmente sabe que el "2" corresponde a la "Laptop Pro" y que ahora quedan "8".
Este flujo garantiza que el Hijo sea un componente "puro" (solo UI) y el Padre sea el único que decide el destino de los datos.
¿Te gustaría que probemos qué pasa en este flujo si el usuario intenta comprar 11 laptops cuando solo hay 10? (Falla en el Paso 4).





Haz una pregunta

 ¿Qué pasa cuando el Padre se re-renderiza?
Esto es lo más importante: React es dinámico.
Si el usuario compra una Laptop:
El Padre cambia su estado.
El Padre se vuelve a ejecutar.
El .map se vuelve a correr.
Se crean 4 funciones NUEVAS y las anteriores se borran de la memoria (Garbage Collection).
🎯 ¿Por qué esto es eficiente aunque parezca "mucho trabajo"?
Aunque el Padre fabrique funciones y componentes de nuevo:
Virtual DOM: React es muy rápido comparando qué cambió. Si solo cambió el stock de la Laptop, React no toca el DOM real del Mouse o del Teclado, solo actualiza los textos necesarios.
Seguridad: Al crear funciones nuevas con el ID "fresco", te asegurás de que el Hijo siempre tenga el cable conectado al producto correcto, sin errores de sincronización.
Exacto. Has tocado el punto donde React y Angular se separan por completo en su filosofía de diseño. Mientras React es "Pull" (el componente pide los datos y se re-renderiza), Angular es "Push" (el flujo de datos empuja los cambios a través de la app).
Aquí tienes la comparación teórica de cómo ese código de tornillos se vería bajo la óptica de RxJS en Angular:
🏛️ La diferencia de paradigmas
Característica	React (Lo que vimos)	Angular (RxJS)
Concepto clave	Estado Inmutable. Se reemplaza el objeto viejo por uno nuevo.	Flujos (Streams). Los datos fluyen por tuberías (pipes).
Mecanismo	Prop Drilling y Callbacks.	Observables y Sujetos (BehaviorSubject).
Actualización	El Padre re-renderiza a los Hijos.	El componente "escucha" (suscribe) al flujo.
🔧 ¿Cómo sería el equivalente en Angular?
En lugar de que el Padre "fabrique funciones" para cada hijo, tendrías un Servicio Central que maneja el stock como un "río" de datos.
1. El Servicio (La "Fuente del Río")
En lugar de useState, usarías un BehaviorSubject. Este objeto siempre recuerda el último valor (el stock actual).
typescript
// stock.service.ts
private stockSubject = new BehaviorSubject<Producto[]>(initialStock);
stock$ = this.stockSubject.asObservable(); // El "río" que los hijos escuchan

comprar(id: number, cantidad: number) {
  // En lugar de setProductos, "empujas" el nuevo valor al stream
  const nuevoStock = calcularNuevoStock(id, cantidad);
  this.stockSubject.next(nuevoStock); 
}
Usa el código con precaución.
2. El Componente Hijo (El "Pescador")
El hijo no recibe solo una prop estática; se suscribe al observable. Cuando el stock cambia en el servicio, el hijo recibe el nuevo dato automáticamente sin que el padre tenga que "re-fabricarlo".
🔄 Programación Asincrónica vs. Reactividad de Estado
La gran ventaja de lo que viste en Angular (RxJS) para este ejemplo sería:
Eventos en tiempo real: Si el stock cambiara por un WebSocket (otra persona compró), el Observable emitiría un nuevo valor y el componente se actualizaría solo.
Operadores Potentes: Podrías usar debounceTime para que, si el usuario hace clic 10 veces seguidas en el +, la app espere a que termine de clickear antes de procesar la compra.
🎯 ¿Por qué React no usa Observables por defecto?
React prefiere la simplicidad del JavaScript puro. En React, una función que retorna otra función (lo que vimos con el crearCallbackCompra) es suficiente para manejar la lógica sin agregar la complejidad de una librería externa como RxJS.
En resumen:
En React: El Padre manda la función (Callback). Es una relación jerárquica directa.
En Angular: El Servicio emite el dato (Observable). Es una relación de suscripción.
¿Te resulta más natural el camino de los Callbacks de React (donde el padre tiene el control total) o te gusta más la idea de los Observables de Angular (donde los datos fluyen independientemente)?
Si quieres, podemos intentar simular un comportamiento "tipo Observable" en React usando un Hook llamado useEffect para escuchar cambios externos. ¿Te interesa?







 */
 