import { useState, useEffect } from 'react';
import { Item } from "./Item";
import styles from "./TiendaVirtual.module.css";

/**
 * 🏪 COMPONENTE PADRE - TiendaVirtual
 * 
 * Responsabilidades:
 * - Cargar productos desde productos.json
 * - Manejar estado global y errores
 * - Crear callbacks con closures
 */
export function TiendaVirtual({ mensaje }) {
  // 🗄️ ESTADO GLOBAL - Puro React
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historial, setHistorial] = useState([]);
  
  // 🚨 SOLUCIÓN FINAL: Forzar actualización de props
  const [propsVersion, setPropsVersion] = useState(0);
  
  
  // 🔄 CARGA SIMPLE - Sin refs, sin complicaciones
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/data/productos.json');
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('El formato de datos no es correcto');
        }
        
        // Agregar imágenes y guardar en el estado
        const conFotos = data.map(p => ({
          ...p,
          imagen: `https://picsum.photos/seed/${p.nombre}/300/200.jpg` 
        }));
        
        setProductos(conFotos); // Solo esto, sin refs.
        console.log(`✅ ${conFotos.length} productos cargados exitosamente`);
        
      } catch (err) {
        console.error('❌ Error al cargar productos:', err);
        setError(err.message);
        
        if (err.message.includes('Failed to fetch')) {
          setError('No se pudo conectar al servidor. Verifica que el servidor esté corriendo.');
        } else if (err.message.includes('HTTP')) {
          setError(`Error del servidor: ${err.message}`);
        } else {
          setError(`Error al procesar los datos: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    cargar();
  }, []); // Se ejecuta una sola vez

  /**
   * 🎯 FUNCIÓN CREADORA DE CALLBACKS - Corrección Definitiva
   * 
   * ✅ USANDO SPREAD OPERATOR CORRECTO - Inmutabilidad garantizada
   * 
   * TÉCNICA: setProductos(productosActuales => { ... })
   * - Cada objeto debe ser completamente nuevo
   * React detecta cambios por referencia, no por valor
   */
  const crearCallbackCompra = (productoId) => {
    return (cantidad) => {
      console.log(`🛒 Iniciando compra: Producto ${productoId}, Cantidad ${cantidad}`);
      
      // 🔄 FORMA FUNCIONAL: Accede al estado más reciente
      setProductos(productosActuales => {
        console.log('📊 Estado actual de productos:', productosActuales.length);
        console.log('📊 Productos antes de actualizar:', JSON.stringify(productosActuales.find(p => p.id === productoId)));
        
        // ✅ CORRECCIÓN DEFINITIVA: .map() con spread operator correcto
        const nuevosProductos = productosActuales.map(p => {
          if (p.id === productoId) {
            // ✅ CORRECTO: Retornamos un OBJETO NUEVO con los datos actualizados
            const nuevoStock = p.stock - cantidad;
            console.log(`🔄 Actualizando ${p.nombre}: stock ${p.stock} → ${nuevoStock}`);
            console.log('🔍 Objeto antes:', JSON.stringify(p));
            const productoActualizado = { ...p, stock: nuevoStock };
            console.log('🔍 Objeto después:', JSON.stringify(productoActualizado));
            return productoActualizado;
          }
          // Retornamos el producto sin cambios (pero como referencia nueva)
          return p;
        });
        
        console.log('📊 Productos después de actualizar:', JSON.stringify(nuevosProductos.find(p => p.id === productoId)));
        console.log('🔍 Array nuevo vs array viejo:', nuevosProductos !== productosActuales);
        
        // 🚨 FORZAR ACTUALIZACIÓN DE PROPS: Incrementar versión
        setTimeout(() => {
          console.log('� Forzando actualización de props con propsVersion');
          setPropsVersion(prev => prev + 1);
        }, 50);
        
        return nuevosProductos;
      });
    };
  };

  
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
    );
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
          <div className={styles.errorHelp}>
            <h3>Posibles soluciones:</h3>
            <ul>
              <li>Verifica que el servidor de desarrollo esté corriendo</li>
              <li>Comprueba que el archivo productos.json exista en public/data/</li>
              <li>Revisa la consola para más detalles del error</li>
            </ul>
          </div>
        </div>
      </div>
    );
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
                  // 🚨 SOLUCIÓN FINAL: Key con propsVersion para forzar actualización
                  key={`${producto.id}-${index}-${propsVersion}`}
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
            <section className={styles.historial}>
              <h2>📋 Historial de Compras</h2>
              <div className={styles.historialList}>
                {historial.slice(0, 5).map((entrada) => (
                  <div key={entrada.id} className={styles.historialItem}>
                    <div className={styles.historialInfo}>
                      <strong>{entrada.producto}</strong>
                      <span>{entrada.cantidad} × ${entrada.precioUnitario}</span>
                    </div>
                    <div className={styles.historialTotal}>
                      <strong>${entrada.total}</strong>
                      <small>{entrada.timestamp}</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default TiendaVirtual;
