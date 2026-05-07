import { useState, useEffect } from 'react'
import { Item } from './Item'
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [historial, setHistorial] = useState([])

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
        
        // Agregar imágenes y guardar en el estado
        const conFotos = data.map(p => ({
          ...p,
          imagen: `https://picsum.photos/seed/${p.nombre}/300/200.jpg` 
        }))
        
        setProductos(conFotos)
        console.log(`✅ ${conFotos.length} productos cargados exitosamente`)
        
      } catch (err) {
        console.error('❌ Error al cargar productos:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    cargar()
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
      setProductos(productosActuales => {
        console.log('📊 Estado actual de productos:', productosActuales.length)
        
        // ✅ INMUTABILIDAD ESTRICTA: Crear array nuevo con objetos nuevos
        const productosActualizados = productosActuales.map(p => {
          if (p.id === productoId) {
            const nuevoStock = p.stock - cantidad
            
            // Validaciones de negocio
            if (cantidad <= 0) {
              alert('Error: La cantidad debe ser mayor a cero')
              return p
            }
            
            if (nuevoStock < 0) {
              alert(`Stock insuficiente. Solo quedan ${p.stock} unidades de ${p.nombre}`)
              return p
            }
            
            console.log(`🔄 Actualizando ${p.nombre}: stock ${p.stock} → ${nuevoStock}`)
            
            // ✅ RETORNAR OBJETO COMPLETAMENTE NUEVO
            return { ...p, stock: nuevoStock }
          }
          
          // ✅ RETORNAR OBJETO NUEVO (aunque no cambie)
          return { ...p }
        })
        
        // 📝 Historial (fuera del flujo principal)
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

  // 📊 ESTADOS DE CARGA
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
            📦 {productos.length} productos
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
          <main className={styles.catalogo}>
            <div className={styles.grid}>
              {productos.map((producto, index) => (
                <Item
                  // ✅ KEY SIMPLE Y ÚNICA - Sin Hard Reset
                  key={`${producto.id}-${index}`}
                  nombre={producto.nombre}
                  precio={producto.precio}
                  stock={producto.stock}
                  imagen={producto.imagen}
                  // 🎯 CLOSURE: Cada hijo recibe su función personalizada
                  onCompra={crearCallbackCompra(producto.id)}
                />
              ))}
            </div>
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
