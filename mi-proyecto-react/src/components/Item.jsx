import { useState, useEffect } from 'react';
import styles from "./Item.module.css";

/**
 * 🛒 COMPONENTE HIJO - "Tonto" y Reutilizable
 * 
 * Responsabilidades:
 * - Manejar estado local (cantidad)
 * - Mostrar información del producto
 * - Emitir eventos al padre: onCompra(cantidad)
 * - Sin lógica de negocio
 */
export function Item({ nombre, precio, stock, imagen, onCompra }) {
  // 🔄 ESTADO LOCAL: Borrador de compra
  const [cantidad, setCantidad] = useState(0);
  
  // � ESTADO PARA CONTROL DE ETIQUETA: Forzar cambio visual
  const [mostrarNuevoStock, setMostrarNuevoStock] = useState(false);
  
  // �� DEBUG: Verificar si el componente se re-renderiza con nuevas props
  console.log("Renderizando Item:", nombre, "Stock actual:", stock);
  
  // 🔄 Detectar cambios en la prop stock para activar la nueva etiqueta
  useEffect(() => {
    console.log('🔍 useEffect detectó cambio de stock:', stock);
    if (stock >= 0) { // Si hay stock válido
      // ✅ Mejor práctica: Usar setTimeout para setState asíncrono
      setTimeout(() => {
        setMostrarNuevoStock(true);
        console.log('✅ Activando etiqueta de nuevo stock');
        
        // Ocultar la etiqueta después de 3 segundos
        setTimeout(() => {
          setMostrarNuevoStock(false);
          console.log('🔙 Ocultando etiqueta de nuevo stock');
        }, 3000);
      }, 0);
    }
  }, [stock]);

  // ➕ FUNCIÓN SUMAR: Validación local de UI
  const sumar = () => {
    if (cantidad < stock) {
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
      onCompra(cantidad);
      
      // 🧹 Limpieza inmediata del estado local
      setCantidad(0);
    }
  };

  // 📊 Cálculos derivados para feedback visual
  const stockResultante = stock - cantidad;
  const puedeComprar = cantidad > 0 && stock > 0;
  const stockBajo = stockResultante < 5;

  return (
    <article className={styles.card}>
      <img className={styles.image} src={imagen} alt={nombre} />
      <div className={styles.content}>
        <h3 className={styles.title}>{nombre}</h3>
        <p className={styles.price}>Precio: ${precio}</p>
        {/* 🔄 ETIQUETA DINÁMICA: Cambia según el estado de mostrarNuevoStock */}
        {mostrarNuevoStock ? (
          <p className={`${styles.stock} ${styles.stockNuevo}`}>
            🔄 Nuevo Stock: {stock}
          </p>
        ) : (
          <p className={`${styles.stock} ${stockBajo ? styles.stockLow : ''}`}>
            Stock: {stock}
          </p>
        )}
        
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
  );
}
