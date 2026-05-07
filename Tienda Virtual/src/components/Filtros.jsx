import { useState, useEffect } from 'react'
import styles from '../styles/Filtros.module.css'

export function Filtros({ productos, onFiltrar }) {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas')
  const [ordenPrecio, setOrdenPrecio] = useState('ninguno')

  // Obtener categorías únicas
  const categorias = ['todas', ...new Set(productos.map(p => p.categoria))]

  // Aplicar filtros
  const aplicarFiltros = () => {
    let productosFiltrados = productos

    // Filtrar por búsqueda
    if (busqueda) {
      productosFiltrados = productosFiltrados.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
    }

    // Filtrar por categoría
    if (categoriaSeleccionada !== 'todas') {
      productosFiltrados = productosFiltrados.filter(p =>
        p.categoria === categoriaSeleccionada
      )
    }

    // Ordenar por precio
    if (ordenPrecio === 'ascendente') {
      productosFiltrados = [...productosFiltrados].sort((a, b) => a.precio - b.precio)
    } else if (ordenPrecio === 'descendente') {
      productosFiltrados = [...productosFiltrados].sort((a, b) => b.precio - a.precio)
    }

    onFiltrar(productosFiltrados)
  }

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    aplicarFiltros()
  }, [busqueda, categoriaSeleccionada, ordenPrecio, productos])

  return (
    <div className={styles.filtros}>
      <div className={styles.filtrosContainer}>
        <div className={styles.grupo}>
          <label htmlFor="busqueda">🔍 Buscar producto:</label>
          <input
            type="text"
            id="busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej: Laptop, iPhone, Sony..."
            className={styles.input}
          />
        </div>

        <div className={styles.grupo}>
          <label htmlFor="categoria">📂 Categoría:</label>
          <select
            id="categoria"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className={styles.select}
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'todas' ? 'Todas las categorías' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.grupo}>
          <label htmlFor="precio">💰 Ordenar por precio:</label>
          <select
            id="precio"
            value={ordenPrecio}
            onChange={(e) => setOrdenPrecio(e.target.value)}
            className={styles.select}
          >
            <option value="ninguno">Sin orden</option>
            <option value="ascendente">Menor a mayor</option>
            <option value="descendente">Mayor a menor</option>
          </select>
        </div>
      </div>
    </div>
  )
}
