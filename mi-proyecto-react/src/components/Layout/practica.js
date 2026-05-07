import React, { useState, useEffect, useRef, useMemo } from "react";

/**
 * useState: NO ejecuta funciones de lógica. Su único trabajo es guardar un dato y, 
 * cuando ese dato cambia, avisarle a React:
 * useEffect: Es una reacción. Se ejecuta después de que React 
 * terminó de dibujar el componente en pantalla.
 *  la clave es que controla a una propiedad cada vez que termina un render
 * y esa propiedad es la dependencia que le suministramos 
 * React guarda una copia de la dependencia después de cada render.
En el siguiente render, compara: ¿Valor anterior === Valor nuevo?.
Si la respuesta es No, el semáforo se pone en verde y el useEffect arranca.
 * Sin array : Se ejecuta siempre (descontrolado).
Array vacío []: Se ejecuta una sola vez (controlado por el nacimiento del componente)
el array de dependencias [] le dice al framework:
"Este efecto no depende de ningún valor del renderizado (props o estado)".
Por lo tanto, solo debe ejecutarse al montar (cuando el componente aparece) y la limpieza al desmontar.
Con variables [a, b]: Se ejecuta solo cuando a o b cambian (controlado por valores específicos).
 *  "Che, el componente cambió, dibujalo de nuevo" (renderizado).
practica.js es material de estudio de nivel avanzado. Las metáforas del "Inspector 
de Aduanas" y "Gritador con Contrato" son didacticas para entender:
function Juego() {
  const [nivel, setNivel] = useState(1);
  const esPrimerRender = useRef(true); // El "escudo"

  useEffect(() => {
    if (esPrimerRender.current) {
      // 1. En el primer render, bajamos la bandera y NO hacemos nada
      esPrimerRender.current = false;
      return;
    }

    // 2. A partir de acá, solo se ejecuta si el nivel cambia de verdad
    console.log("¡Subiste de nivel REALMENTE!");
  }, [nivel]);

  return <button onClick={() => setNivel(n => n + 1)}>Subir Nivel</button>;
}

Ciclo de vida de efectos
Cleanup previo a re-ejecución
Comparación superficial de React
Optimización con useMemo
 * 🎓 GUÍA MAESTRA DE HOOKS: EL PUENTE ENTRE REACT Y EL NAVEGADOR
 * 
 * Conceptos clave:
 * - useState: El "motor" de la pantalla. Si cambia, el usuario 
 * ve el cambio.
 * - useRef: La "caja fuerte" silenciosa. 
 * Guarda datos sin disparar renders. Es el PUENTE.
 * - useEffect: El "Inspector de Aduanas". Decide cuándo ocurren las cosas.
 */

/* -------------------------------------------------------------------------
   ESTRATEGIA 1: EL GRITADOR CON CONTRATO FIJO (Eficiencia Máxima)
    Clausura (Closure) sobre una Referencia Mutante.
El setInterval vive en el "pasado" (se creó al nacer el componente).
Sin embargo, dentro de su ejecución, tiene acceso a timerRef.current.
Cuando el contador llega a 9, el interval puede "suicidarse" a sí mismo llamando a clearInterval(timerRef.current
   ------------------------------------------------------------------------- */
export function ContadorEficiente() {
  const [segundos, setSegundos] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    /* 
       ALIANZA CON EL NAVEGADOR:
       Al usar [], contratamos a UN SOLO gritador al nacer el componente.
       No hay despidos ni re-contrataciones constantes.
    */
    timerRef.current = setInterval(() => {
      setSegundos(s => {//funcion la tarea a repetir
        if (s >= 9) {
          /* EL PUENTE: Usamos la 'llave' en timerRef para que el motor se apague solo */
          clearInterval(timerRef.current);
          return 10;
        }
        return s + 1;
      });
    }, 1000);//tarea a repetir por cada segundo

    /* MOMENTO "YOU'RE FIRED": Limpieza final si el componente muere 
    Para frenar la repetición, se debe usar clearInterval() pasando el identificador 
    que se obtubo al crear el intervalo que lo asignamos a.timeRef.current*/
    return () => clearInterval(timerRef.current);
  }, []); 

  return (
    <div style={{ border: '2px solid green', padding: '10px', margin: '10px' }}>
      <h3>Contador Eficiente (Contrato Fijo)</h3>
      <p>Segundos: {segundos}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------
   ESTRATEGIA 2: LA CARRERA DE RELEVOS (Gritadores Temporales)
    forzando un ciclo de destrucción y creación constante.
   ------------------------------------------------------------------------- */
export function ContadorRelevos() {
  const [segundos, setSegundos] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    /* 
       RE-CONTRATACIÓN:
       Como depende de [segundos], React despide al viejo y contrata uno nuevo cada segundo.
    */
    if (segundos < 10) {
      timerRef.current = setInterval(() => {
        setSegundos(s => s + 1);
      }, 1000);
    }

    /* EL FINIQUITO: React grita "YOUR'RE FIRED" antes de cada nuevo render */
    return () => clearInterval(timerRef.current);
  }, [segundos]);//Ejecutá esta función solo SI el valor de segundos es distinto al que tenía en el render anterio

  return (
    <div style={{ border: '2px solid blue', padding: '10px', margin: '10px' }}>
      <h3>Contador de Relevos (Cleanup constante)</h3>
      <p>Segundos: {segundos}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------
   ESTRATEGIA 3: EL OBJETO FANTASMA (El problema de la Comparación Superficial)
   ------------------------------------------------------------------------- */
export function EjemploUseMemo() {
  const [conteo, setConteo] = useState(0);
  
  /* 
     EL ERROR DE JR: 
     Crear un objeto o array "suelto" dentro del componente.
     En cada render (cada vez que conteo cambia), 
     este objeto es NUEVO en memoria.
     Para el Inspector de Aduanas, [] no es igual a [].
  */
  // const opciones = ["A", "B"]; 
  // // <-- Si usas esto como dependencia, ¡Bucle Infinito!

  /* 
     LA SOLUCIÓN SENIOR: useMemo
     "Congela" el objeto en memoria. 
     React recordará que es el MISMO objeto 
     mientras nada en su equipaje cambie.
  */
  const opcionesEstables = useMemo(() => ["Laptop", "Monitor"], []);

  useEffect(() => {
    console.log("Inspector de Aduanas: 'Veo que las opciones son las mismas, no ejecuto nada'.");
  }, [opcionesEstables]); // Ahora el Inspector está tranquilo.

  return (
    <div style={{ border: '2px solid orange', padding: '10px', margin: '10px' }}>
      <h3>useMemo: El Objeto Estable</h3>
      <p>Renders totales: {conteo}</p>
      <button onClick={() => setConteo(c => c + 1)}>Disparar Render</button>
    </div>
  );
}

/* -------------------------------------------------------------------------
   ESTRATEGIA 4: LA CALCULADORA DE STOCK (useMemo en Proyecto Real)
   ------------------------------------------------------------------------- */
export function CalculadoraStock() {
  const [laptops, setLaptops] = useState([
    { id: 1, nombre: "Laptop Gamer", precio: 1200, stock: 5, categoria: "gaming" },
    { id: 2, nombre: "Laptop Office", precio: 800, stock: 12, categoria: "oficina" },
    { id: 3, nombre: "Laptop Dev", precio: 1500, stock: 3, categoria: "desarrollo" },
    { id: 4, nombre: "Laptop Student", precio: 600, stock: 8, categoria: "educacion" }
  ]);
  
  const [carrito, setCarrito] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  //): Es la señal. Cada vez que cambia, obliga a React a re-renderizar 
 // <--- Este estado es el que suele causar re-renders innecesarios

  /* 
  import React, { useState, useEffect, useMemo } from 'react';

export function MiComponente({ listaDeProductos }) {
  // 1. Estados
  const [segundos, setSegundos] = useState(0);
  const [busqueda, setBusqueda] = useState("");

  // 2. El "Motor" (useEffect)
  // Se encarga del tiempo. Solo se activa una vez al montar.
  useEffect(() => {
    const intervalo = setInterval(() => {
      setSegundos(s => s + 1);
    }, 1000);

    return () => clearInterval(intervalo); // Limpieza (Cleanup)
  }, []);

  // 3. El "Escudo" (useMemo)
  // Evita filtrar 100.000 productos cada vez que el reloj cambia.
  const productosFiltrados = useMemo(() => {
    console.log("Calculando filtro pesado..."); // Solo verás esto cuando cambie 'busqueda'
    return listaDeProductos.filter(p => 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [listaDeProductos, busqueda]); // 🚩 NO incluimos 'segundos' aquí

  return (
    <div>
      <h1>⏳ Tiempo: {segundos}s</h1>
      
      <input 
        type="text" 
        placeholder="Buscar producto..." 
        onChange={(e) => setBusqueda(e.target.value)} 
      />

      <ul>
        {productosFiltrados.map(p => <li key={p.id}>{p.nombre}</li>)}
      </ul>
    </div>
  );
}

   si usaramos 
   useEffect: Es el motor. Se encarga de cambiar el estado segundos cada 1000ms.
   useEffect(() => {
  const intervalo = setInterval(() => {
    setSegundos(s => s + 1);
  }, 1000);

  // ESTO ES CLAVE:
  return () => clearInterval(intervalo); 
  // Cuando el componente muere, el reloj se detiene.
}, []);
 Es el escudo. Evita que el "motor" del reloj (que es muy rápido) obligue al procesador a 
 repetir el filtrado de productos (que es muy lento).

useEffect: Es el motor. Se encarga de cambiar el estado segundos cada 1000ms.
useState (segundos): Es la señal. Cada vez que cambia, obliga a React a re-renderizar para mostrar el nuevo número en pantalla.
useMemo: Es el escudo. Evita que el "motor" del reloj (que es muy rápido) obligue al procesador a repetir el filtrado de productos (que es muy lento).
  Usa useMemo no para evitar que el cálculo se haga nunca, sino para que se
   haga únicamente cuando los datos que lo originan cambian.
   Escribir en un chat de soporte: Si tenés un input de chat en la misma pantalla, cada letra que escribe el usuario dispara un render. Sin useMemo, ¡filtrarías 100,000 laptops por cada letra escrita!
Animaciones o Timers: Si tenés un reloj segundero en la pantalla, cada segundo se re-renderiza el componente. useMemo evita filtrar las laptops cada segundo.
Abrir un Modal de "Ayuda": Al abrirlo, cambias un estado showModal.
 El componente se renderiza, pero el filtro de laptops ni se inmuta.
 ¿Cambió la lista de laptops? Calculo. ✅
¿Cambió la categoría? Calculo. ✅
¿Cambió el nombre del usuario en el header? NO calculo. (Uso memoria) 🏆
¿Se abrió un menú desplegable? NO calculo. (Uso memoria) 🏆


  ✅ filtroCategoria = string que indica qué sección mostrar
✅ laptops = array completo de objetos
✅ "todas" = palabra clave que significa "el objeto completo"
✅ Filtrado = transformar string → subconjunto de objetos
     ❌ EL ERROR SIN useMemo:
     Cada vez que se renderiza (cada clic), se recalcula TODO:
     - Filtrado de laptops
     - Cálculo de totales
     - Verificación de stock
     ¡Ineficiente con listas grandes!
  */

  /* 
     ✅ LA SOLUCIÓN CON useMemo:
     "Congelamos" los cálculos pesados. Solo se recalculan si sus 
     dependencias específicas cambian.
  */

  // 1. Filtrado de laptops (solo cambia si cambia filtroCategoria o laptops)
  const laptopsFiltradas = useMemo(() => {
    console.log("🔍 Filtrando laptops...");
    return filtroCategoria === "todas" 
      ? laptops 
      : laptops.filter(laptop => laptop.categoria === filtroCategoria);
  }, [laptops, filtroCategoria]);

  // 2. Cálculo del total del carrito (solo cambia si cambia carrito o laptops)
  const totalCarrito = useMemo(() => {
    console.log("💰 Calculando total...");
    return carrito.reduce((total, item) => {
      const laptop = laptops.find(l => l.id === item.id);
      return total + (laptop?.precio || 0) * item.cantidad;
    }, 0);
  }, [carrito, laptops]);

  // 3. Verificación de stock disponible (solo cambia si cambia carrito o laptops)
  const stockDisponible = useMemo(() => {
    console.log("📦 Verificando stock...");
    return carrito.map(item => {
      const laptop = laptops.find(l => l.id === item.id);
      return {
        ...item,
        stockDisponible: laptop?.stock || 0,
        puedeComprar: (laptop?.stock || 0) >= item.cantidad
      };
    });
  }, [carrito, laptops]);

  // 4. Resumen de categorías (solo cambia si cambia laptops)
  const resumenCategorias = useMemo(() => {
    console.log("📊 Generando resumen...");
    return laptops.reduce((resumen, laptop) => {
      if (!resumen[laptop.categoria]) {
        resumen[laptop.categoria] = { count: 0, totalStock: 0 };
      }
      resumen[laptop.categoria].count++;
      resumen[laptop.categoria].totalStock += laptop.stock;
      return resumen;
    }, {});
  }, [laptops]);

  const agregarAlCarrito = (laptopId) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === laptopId);
      if (existe) {
        return prev.map(item => 
          item.id === laptopId 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { id: laptopId, cantidad: 1 }];
    });
  };

  return (
    <div style={{ border: '2px solid purple', padding: '15px', margin: '10px' }}>
      <h3>🛒 Calculadora de Stock con useMemo</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Filtrar por categoría: </label>
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="todas">Todas</option>
          <option value="gaming">Gaming</option>
          <option value="oficina">Oficina</option>
          <option value="desarrollo">Desarrollo</option>
          <option value="educacion">Educación</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {/* Lista de laptops */}
        <div>
          <h4>📱 Laptops Disponibles</h4>
          {laptopsFiltradas.map(laptop => (
            <div key={laptop.id} style={{ 
              border: '1px solid #ddd', 
              padding: '8px', 
              margin: '5px',
              borderRadius: '5px'
            }}>
              <strong>{laptop.nombre}</strong><br/>
              Precio: ${laptop.precio} | Stock: {laptop.stock}<br/>
              <button 
                onClick={() => agregarAlCarrito(laptop.id)}
                disabled={laptop.stock === 0}
                style={{ 
                  background: laptop.stock > 0 ? '#4CAF50' : '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  cursor: laptop.stock > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                {laptop.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
              </button>
            </div>
          ))}
        </div>

        {/* Carrito y resumen */}
        <div>
          <h4>🛒 Carrito de Compras</h4>
          {carrito.length === 0 ? (
            <p>Carrito vacío</p>
          ) : (
            <>
              {stockDisponible.map(item => {
                const laptop = laptops.find(l => l.id === item.id);
                return (
                  <div key={item.id} style={{ 
                    border: item.puedeComprar ? '1px solid green' : '1px solid red',
                    padding: '8px',
                    margin: '5px',
                    borderRadius: '5px',
                    backgroundColor: item.puedeComprar ? '#f0fff0' : '#fff0f0'
                  }}>
                    <strong>{laptop?.nombre}</strong><br/>
                    Cantidad: {item.cantidad}<br/>
                    <span style={{ color: item.puedeComprar ? 'green' : 'red' }}>
                      {item.puedeComprar ? '✅ Stock disponible' : `❌ Stock insuficiente (solo ${item.stockDisponible})`}
                    </span>
                  </div>
                );
              })}
              <hr style={{ margin: '10px 0' }}/>
              <strong>Total: ${totalCarrito}</strong>
            </>
          )}

          <h4 style={{ marginTop: '15px' }}>📊 Resumen por Categoría</h4>
          {Object.entries(resumenCategorias).map(([categoria, data]) => (
            <div key={categoria} style={{ fontSize: '0.9em', margin: '3px 0' }}>
              <strong>{categoria}:</strong> {data.count} modelos, {data.totalStock} unidades totales
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '15px', fontSize: '0.85em', color: '#666' }}>
        <p>💡 <strong>useMemo en acción:</strong></p>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Filtrado: solo se recalcula si cambias el filtro o las laptops</li>
          <li>Total: solo se recalcula si modificas el carrito o precios</li>
          <li>Stock: solo se recalcula si cambia el carrito o inventario</li>
          <li>Resumen: solo se recalcula si cambia el catálogo de laptops</li>
        </ul>
        <p>🎯 <strong>Abre la consola para ver cuándo se ejecuta cada cálculo</strong></p>
      </div>
    </div>
  );
}

/**
 * 📖 APUNTES TEÓRICOS: EL MANUAL DEL INSPECTOR (useEffect)
 * 
 * 1. El Primer Parámetro: La Función (El "Qué")
 *    - Es el trabajo a realizar.
 *    - El 'return' es el momento "You're Fired": Limpia el desorden anterior.
 * 
 * 2. El Segundo Parámetro: El Array (El "Cuándo")
 *    - Sin array []: Peligro ⚠️. Se ejecuta en CADA parpadeo. Caos total.
 *    - Array vacío []: Solo al nacer. Contrato fijo.
 *    - Con variables [segundos]: Carrera de relevos. Se activa solo si eso cambia.
 * 
 * 3. 🧠 EL GRAN SECRETO: LA COMPARACIÓN SUPERFICIAL
 *    React es un poco "corto de vista". Para comparar dependencias usa "===".
 *    - 5 === 5 ? SÍ (No ejecuta el efecto)
 *    - "Hola" === "Hola" ? SÍ (No ejecuta el efecto)
 *    - [1,2] === [1,2] ? NO ❌ (Porque son dos objetos distintos en memoria)
 * 
 *    Si el Inspector ve que le traes una "maleta nueva" (un objeto nuevo), 
 *    aunque por dentro tenga lo mismo, él te hace pasar por la aduana.
 *    Por eso usamos useMemo: para que la maleta sea siempre la misma.
 * 
 * 4. Responsabilidad Única:
 *    Es mejor tener 3 useEffect cortos que 1 gigante. 
 *    - Uno para el Timer.
 *    - Uno para la API.
 *    - Uno para el Título.
 *    Así, si el Timer se vuelve loco, no afecta a tu llamada a la API.
 */
