import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// 🧪 PROBANDO NUESTRA API POR CONSOLA
// Este código nos ayuda a verificar que la conexión con productos.json funciona correctamente
fetch('/data/productos.json')
  .then(respuesta => {
    console.log('🔍 Respuesta cruda del servidor:', respuesta);
    console.log('📊 Status:', respuesta.status);
    console.log('📋 Headers:', respuesta.headers);
    return respuesta.json();
  })
  .then(datos => {
    console.log('✅ ¡Productos cargados exitosamente!', datos);
    console.log('📦 Cantidad de productos:', datos.length);
    console.log('🎯 Primer producto:', datos[0]);
  })
  .catch(error => {
    console.error('❌ ¡Ups! Hubo un error:', error);
    console.error('🔍 Detalles del error:', error.message);
  })
  .finally(() => {
    console.log('🏁 Prueba de API finalizada - revisa los resultados arriba');
  });




/* Resumen: Flexbox y Modelo de Caja (Navbar & Header)
1. El contenedor padre (display: flex)
- Al activar flex, transformas el contenedor en un eje horizontal.
- justify-content: space-between distribuye los hijos aprovechando todo el ancho.
- align-items: center alinea todos los hijos en el centro vertical.
- gap: 15px crea espacio entre hijos sin agregar margen externo.

2. Modelo de caja (padding y background)
- padding: 25px 40px -> 25 arriba/abajo y 40 izquierda/derecha.
- El padding infla la caja desde adentro.
- El background cubre contenido + padding.

3. Botones del nav
- Sin width/height fijos: tamano automatico segun texto + padding.

4. Organizacion de archivos
- index.css: estilos globales.
- Componente.module.css: estilos encapsulados.

Ejemplo JSX:
<header className={styles.header}>
  <h1>Titulo</h1>   [Izquierda]
  <Navbar />        [Centro/Derecha]
  <img src={...} /> [Extremo Derecho]
</header>

Ejemplo CSS:
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 40px;
  background-color: var(--primary);
}
*/