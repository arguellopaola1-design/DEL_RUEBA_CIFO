// ===== app.js: el COMPORTAMIENTO de la página =====

// Aquí guardamos los productos: un array (una lista) en la memoria del navegador.
// Ojo: si recargas la página, esta lista empieza vacía otra vez.
const productos = [];

// Buscamos en el HTML los elementos que vamos a usar (por su id)
const formulario = document.getElementById('form-producto');
const tablaProductos = document.getElementById('lista-productos');

// Cuando se pulsa "Guardar", se ejecuta esta función
formulario.addEventListener('submit', function (evento) {
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

  // 2. Lo añadimos a la lista
  productos.push(producto);

  // 3. Volvemos a pintar la tabla con todos los productos
  pintarTabla();

  // 4. Vaciamos el formulario para el siguiente producto
  formulario.reset();
});

// Dibuja una fila de la tabla por cada producto de la lista
function pintarTabla() {
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
