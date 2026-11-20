// ===== app.js: el COMPORTAMIENTO de la página =====
// Fase 2: los productos ya NO se guardan aquí, en el navegador.
// Se guardan en el servidor (backend), y hablamos con él mediante fetch.

// Dirección de la API (el servidor NestJS). Es relativa: el mismo servidor
// que nos ha entregado esta página (http://localhost:3000).
const API_URL = '/api/products';

// Buscamos en el HTML los elementos que vamos a usar (por su id)
const formulario = document.getElementById('form-producto');
const tablaProductos = document.getElementById('lista-productos');

// Al abrir la página, pedimos al servidor los productos que ya tiene
cargarProductos();

// Cuando se pulsa "Guardar", se ejecuta esta función
formulario.addEventListener('submit', async function (evento) {
  // Evitamos que la página se recargue (es lo que hace un formulario por defecto)
  evento.preventDefault();

  // 1. Recogemos los datos del formulario y formamos un producto
  const producto = {
    nombre: document.getElementById('nombre').value,
    marca: document.getElementById('marca').value,
    categoria: document.getElementById('categoria').value,
    precio: Number(document.getElementById('precio').value),
    stock: Number(document.getElementById('stock').value) || 0, // si está vacío, 0
  };

  // 2. Lo enviamos al servidor: petición POST con el producto en formato JSON
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });

  // 3. Volvemos a pedir la lista al servidor y pintamos la tabla
  await cargarProductos();

  // 4. Vaciamos el formulario para el siguiente producto
  formulario.reset();
});

// Pide al servidor la lista de productos (petición GET) y la pinta
async function cargarProductos() {
  const respuesta = await fetch(API_URL);
  const productos = await respuesta.json(); // convertimos el JSON en un array
  pintarTabla(productos);
}

// Dibuja una fila de la tabla por cada producto de la lista
function pintarTabla(productos) {
  // Vaciamos la tabla antes de volver a dibujarla
  tablaProductos.innerHTML = '';

  for (const producto of productos) {
    const fila = document.createElement('tr');

    // Creamos una celda por cada dato.
    // Usamos textContent para que el texto se muestre tal cual, sin interpretarse como HTML.
    const datos = [
      producto.nombre,
      producto.marca,
      producto.categoria,
      producto.precio.toFixed(2), // el encabezado ya indica que es en €
      producto.stock,
    ];
    for (const dato of datos) {
      const celda = document.createElement('td');
      celda.textContent = dato;
      fila.appendChild(celda);
    }

    tablaProductos.appendChild(fila);
  }
}
