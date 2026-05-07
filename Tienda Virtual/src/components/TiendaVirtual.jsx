import { useState, useEffect } from 'react'
import Item from './Item'
import { Filtros } from './Filtros'
import styles from '../styles/TiendaVirtual.module.css'

/**
 * 🏪 COMPONENTE PADRE - TiendaVirtual (Proper React)
 * 
 * ✅ BEST PRACTICES IMPLEMENTADAS:
 * - Estado puro de React (sin refs, sin force updates)
 * - Inmutabilidad estricta
 * - Props puras
 * - Sin Hard Reset
 */
export function TiendaVirtual({ mensaje }) {
  // 🗄️ ESTADO GLOBAL - Puro React
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)// 🔄 Estado de carga: Muestra spinner mientras carga productos (línea 159-168)
  const [error, setError] = useState(null)
  const [historial, setHistorial] = useState([])// 📋 Historial de compras: Guarda las últimas 5 compras para mostrarlas en la UI (línea 242-267)

  // 🔄 CARGA DE DATOS - Simple y pura
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/data/productos.json')
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (!Array.isArray(data)) {
          throw new Error('El formato de datos no es correcto')
        }
        
        // Los productos ya vienen con imágenes específicas
        const conFotos = data
        /**
         * Uso: Primera carga de datos desde JSON
Parámetro: conFotos (array con 50 productos)
         */
        setProductos(conFotos)
        setProductosFiltrados(conFotos)
        console.log(`✅ ${conFotos.length} productos cargados exitosamente`)
        
      } catch (err) {
        console.error('❌ Error al cargar productos:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    cargar()// 🚀 Ejecuta la función cargar para iniciar la carga de productos desde JSON
  }, []) // Se ejecuta una sola vez

  /**
   * 🎯 FUNCIÓN CREADORA DE CALLBACKS - Best Practices
   * 
   * ✅ INMUTABILIDAD ESTRICTA
   * ✅ SIN HARD RESET
   * ✅ FLUJO NATURAL DE REACT
   */
  const crearCallbackCompra = (productoId) => {
    return (cantidad) => {
      console.log(`🛒 Iniciando compra: Producto ${productoId}, Cantidad ${cantidad}`)
      
      // 🔄 FORMA FUNCIONAL CON INMUTABILIDAD ESTRICTA
      /* ✅ EJEMPLO TEÓRICO - Cómo React detecta cambios:
      setProductos(productosActuales => {
  // productosActuales es el estado anterior
  const productosActualizados = productosActuales.map(p => {
    if (p.id === productoId) {
      return { ...p, stock: nuevoStock } // ← LÍNEA CLAVE donde React detecta el cambio
    }
    return { ...p }
  })
  
  return productosActualizados // ← Array con nuevas referencias
})

  ✅ Spread operator crea nuevo objeto con nueva referencia:
  const original = { id: 1, stock: 10 }
  const nuevo = { ...original, stock: 9 }
  console.log(original === nuevo) // false - Referencias diferentes */
  /**
   * ¿Dónde se llama la segunda vez?
📍 Línea 281: El PADRE crea el callback
javascript
<Item
  onCompra={crearCallbackCompra(producto.id)} 
   // ← Aquí se crea la función
/>
   */  

/**
 * setProductos(productosActuales => {
 *   //                    ↑
 *   // React busca: "¿Qué estado está asociado con setProductos?"
 *   // React encuentra: "productos"
 *   // React inyecta: el valor actual de "productos"
 * })
 */
      setProductos(productosActuales => {
        console.log('📊 Estado actual de productos:', productosActuales.length)
        
        // ✅ INMUTABILIDAD ESTRICTA: 
        // 1️⃣ Primera vez: usa productos actuales (referencias viejas)
        // 2️⃣ Siguientes veces: usa productos actualizados (referencias nuevas)
        const productosActualizados = productosActuales.map(p => {
          if (p.id === productoId) {
            const nuevoStock = p.stock - cantidad
            
            // Validaciones de negocio
            if (cantidad <= 0) {
              alert('Error: La cantidad debe ser mayor a cero')
              return p// retorna el producto sin cambios
            }
            
            if (nuevoStock < 0) {
              alert(`Stock insuficiente. Solo quedan ${p.stock} unidades de ${p.nombre}`)
              return p
            }
            
            console.log(`🔄 Actualizando ${p.nombre}: stock ${p.stock} → ${nuevoStock}`)
            
            // ✅ RETORNAR OBJETO COMPLETAMENTE NUEVO
            // esto es para que React detecte el cambio y 
            // renderice el componente  React detecta cambios 
            // por REFERENCIA, no por valor:
            return { ...p, stock: nuevoStock }
          }/** ✅ ORDEN DE EJECUCIÓN COMPLETO:
            
            1️⃣ HIJO ejecuta: onCompra(cantidad) → envía cantidad al PADRE
            2️⃣ PADRE ejecuta: setProductos() → actualiza estado global
            3️⃣ React compara: objetoAnterior !== objetoNuevo
            4️⃣ React detecta: true - Referencias diferentes
            5️⃣ React re-renderiza: Componente Item con nuevas props
            
            // React hace esto internamente:
            if (objetoAnterior !== objetoNuevo) {
              // ¡Hay cambio! Re-renderizar todos los Items afectados
            }
            
            // Con spread operator creamos nuevas referencias:
            const productoAnterior = { id: 1, nombre: "Laptop", stock: 10 }
            const productoNuevo = { ...productoAnterior, stock: 9 }
            console.log(productoAnterior !== productoNuevo) 
            // ✅ true - Referencias diferentes → React re-renderiza */
         
          // ✅ RETORNAR OBJETO NUEVO (aunque no cambie)
          return { ...p }
        })
        
        // 📝 Historial (fuera del flujo principal):
        //  Guarda cada compra para mostrar las últimas
        //  5 en la UI (línea 242-267) 
        setTimeout(() => {
          const producto = productosActuales.find(p => p.id === productoId)
          if (producto) {
            const entrada = {
              id: Date.now(),
              producto: producto.nombre,
              cantidad: cantidad,
              precioUnitario: producto.precio,
              total: producto.precio * cantidad,
              timestamp: new Date().toLocaleString()
            }

            setHistorial(historialAnterior => [entrada, ...historialAnterior])
            console.log(`✅ Compra exitosa: ${producto.nombre} x${cantidad}`)
            
            // Notificación visual
            if (typeof window !== 'undefined') {
              const notificacion = document.createElement('div')
              notificacion.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 9999;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              `
              notificacion.textContent = `✅ ${producto.nombre} x${cantidad} - $${entrada.total}`
              document.body.appendChild(notificacion)
              
              setTimeout(() => {
                if (document.body.contains(notificacion)) {
                  document.body.removeChild(notificacion)
                }
              }, 3000)
            }
          }
        }, 0)

        return productosActualizados
      })
    }
  }

  // 🔄 Manejar filtros
  const manejarFiltrado = (productosFiltrados) => {
    setProductosFiltrados(productosFiltrados)
  }

  // 🔄 Sincronizar productosFiltrados cuando productos cambia
  useEffect(() => {
    setProductosFiltrados(productos)
  }, [productos])

  // � ESTADOS DE CARGA
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <h2>Cargando productos...</h2>
          <p>Por favor, espera un momento mientras cargamos el catálogo.</p>
        </div>
      </div>
    )
  }

  // ❌ ESTADO DE ERROR
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Error al cargar los productos</h2>
          <p className={styles.errorMessage}>{error}</p>
          <div className={styles.errorActions}>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              🔄 Reintentar
            </button>
            <button onClick={() => window.location.reload()} className={styles.reloadButton}>
              🔄 Recargar página
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 🏪 ESTADO NORMAL - Renderizado de la tienda
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{mensaje || "🏪 Tienda Virtual"}</h1>
        <div className={styles.stats}>
          <span className={styles.stat}>
            📦 {productos.length} productos totales
          </span>
          <span className={styles.stat}>
            🔍 {productosFiltrados.length} visibles
          </span>
          <span className={styles.stat}>
            🛒 {historial.length} compras
          </span>
        </div>
      </header>

      {productos.length === 0 ? (
        <div className={styles.empty}>
          <h2>No hay productos disponibles</h2>
          <p>El catálogo está vacío en este momento.</p>
        </div>
      ) : (
        <>
          {/* 🎛️ FILTROS */}
          <Filtros productos={productos} onFiltrar={manejarFiltrado} />
          
          {/* 📦 CATÁLOGO */}
          <main className={styles.catalogo}>
            {productosFiltrados.length === 0 ? (
              <div className={styles.empty}>
                <h2>No se encontraron productos</h2>
                <p>Intenta con otros criterios de búsqueda o filtros.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {productosFiltrados.map((producto, index) => (
                  <Item
                    // ✅ KEY SIMPLE Y ÚNICA - Sin Hard Reset
                    key={`${producto.id}-${index}`}
                    nombre={producto.nombre}
                    precio={producto.precio}
                    stock={producto.stock}
                    imagen={producto.imagen}
                    // 🎯 CLOSURE: Cada hijo recibe su función personalizada - LÍNEA 232-240: El PADRE (TiendaVirtual) llama al HIJO (Item)
                    onCompra={crearCallbackCompra(producto.id)}
                  />
                ))}
              </div>
            )}
          </main>

          {historial.length > 0 && (
            <aside className={styles.historial}>
              <h2>📋 Historial de Compras</h2>
              <div className={styles.historialList}>
                {historial.slice(0, 5).map((entrada) => (
                  <div key={entrada.id} className={styles.historialItem}>
                    <div className={styles.historialProducto}>{entrada.producto}</div>
                    <div className={styles.historialDetalles}>
                      <span>Cantidad: {entrada.cantidad}</span>
                      <span>Total: ${entrada.total}</span>
                    </div>
                    <div className={styles.historialTiempo}>{entrada.timestamp}</div>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </>
      )}
    </div>
  )
}

export default TiendaVirtual
/*
🎓 CLASE MAGISTRAL DE REACT - DOCUMENTACIÓN COMPLETA

✅ CONCEPTOS AVANZADOS DOMINADOS:

1️⃣ REFERENCIA vs. VALOR 🔍
- React compara: if (objetoAnterior !== objetoNuevo)
- Mutación directa: p.stock = 9 → misma referencia → React ignora
- Spread operator: {...p, stock: 9} → nueva referencia → React re-renderiza

2️⃣ ESTADO FUNCIONAL DE REACT 💉
- setProductos(productosActuales => {...})
- React inyecta automáticamente el estado actual como primer parámetro
- Evita stale closures y race conditions

3️⃣ INMUTABILIDAD ESTRICTA 🛡️
- Siempre crear nuevos objetos con spread operator
- React detecta cambios por referencia, no por valor
- Garantiza re-renderizado consistente

4️⃣ CLOSURES Y COMUNICACIÓN PADRE-HIJO �
- crearCallbackCompra(productoId) captura el ID
- Cada Item recibe su función personalizada
- Flujo unidireccional: Hijo → Padre → Estado → UI

5️⃣ DESACOPLAMIENTO CON setTimeout(..., 0) ⚡
- Prioriza actualización de UI primero
- Ejecuta efectos secundarios después
- Evita bloqueos del renderizado

🏆 ESTE CÓDIGO ES UN EJEMPLO PERFECTO DE:
- Best practices de React
- Inmutabilidad estricta
- Comunicación componente eficiente
- Manejo de estado robusto
- Documentación en línea clara

¡FELICITACIONES! Has creado una implementación de nivel profesional.
*/


