import { useState, memo } from 'react'
import styles from '../styles/Item.module.css'

/**
 * 🛒 COMPONENTE HIJO - Item (Proper React)
 * 
 * ✅ BEST PRACTICES IMPLEMENTADAS:
 * - React.memo para optimización
 * - Props puras (sin estado local duplicado)
 * - Sin useEffect innecesario
 * - Renderizado eficiente
 */

const Item = memo(function Item({ nombre, precio, stock, imagen, onCompra }) {
  // 🔄 ESTADO LOCAL: Solo para la cantidad (necesario para UX)
  const [cantidad, setCantidad] = useState(0)

  // ➕ FUNCIÓN SUMAR: Validación local de UI
  const sumar = () => {
    if (cantidad < stock) {
      setCantidad(cantidad + 1)
    }
  }

  // ➖ FUNCIÓN RESTAR: Validación local de UI
  const restar = () => {
    if (cantidad > 0) {
      setCantidad(cantidad - 1)
    }
  }

  // 🎮 FUNCIÓN DE COMPRA: Emisión de evento al padre
  const ejecutarCompra = () => {
    if (cantidad > 0) {
      onCompra(cantidad)
      setCantidad(0) // Resetear cantidad después de comprar
    }
  }

  // 📊 Cálculos derivados para feedback visual
  const stockResultante = stock - cantidad
  const puedeComprar = cantidad > 0 && stock > 0
  const stockBajo = stockResultante < 5

  return (
    <article className={styles.card}>
      <img className={styles.image} src={imagen} alt={nombre} />
      <div className={styles.content}>
        <h3 className={styles.title}>{nombre}</h3>
        <p className={styles.price}>Precio: ${precio}</p>
        
        {/* ✅ STOCK PURO: Directamente de la prop sin estado local */}
        <p className={`${styles.stock} ${stockBajo ? styles.stockLow : ''}`}>
          Stock: {stock}
        </p>
        
        {/* 🎛️ Control de cantidad (estado local) */}
        <div className={styles.quantityControl}>
          <button 
            onClick={restar} 
            disabled={cantidad === 0}
            className={styles.quantityButton}
            aria-label="Reducir cantidad"
          >
            -
          </button>
          
          <span className={styles.quantity}>
            {cantidad}
          </span>
          
          <button 
            onClick={sumar} 
            disabled={cantidad >= stock}
            className={styles.quantityButton}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        {/* 💬 Feedback visual dinámico */}
        {cantidad > 0 && (
          <p className={styles.feedback}>
            {stockResultante > 0 
              ? `Quedarían ${stockResultante} unidades` 
              : 'Stock insuficiente'
            }
          </p>
        )}

        {/* 🎮 Botón de acción (emisión de evento) */}
        <button 
          onClick={ejecutarCompra} 
          disabled={!puedeComprar}
          className={`${styles.button} ${puedeComprar ? styles.buttonActive : styles.buttonDisabled}`}
          type="button"
        >
          {cantidad > 0 ? `Comprar ${cantidad}` : 'Comprar'}
        </button>
      </div>
    </article>
  )
})

export default Item
