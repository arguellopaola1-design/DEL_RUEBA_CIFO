// ===== tienda.js: el COMPORTAMIENTO del escaparate (página del cliente) =====
// Usa la MISMA API que la administración, pero solo para LEER productos.

const API_URL = '/api/products';
const escaparate = document.getElementById('escaparate');

// Al abrir la página, pedimos los productos al servidor
cargarProductos();

// Pide la lista al servidor (petición GET) y pinta las tarjetas
async function cargarProductos() {
  const respuesta = await fetch(API_URL);
  const productos = await respuesta.json(); // convertimos el JSON en un array
  pintarTarjetas(productos);
}

// Crea una tarjeta por cada producto
function pintarTarjetas(productos) {
  escaparate.innerHTML = '';

  // Si no hay productos, mostramos un mensaje
  if (productos.length === 0) {
    const aviso = document.createElement('p');
    aviso.className = 'vacio';
    aviso.textContent = 'Todavía no hay productos.';
    escaparate.appendChild(aviso);
    return;
  }

  for (const producto of productos) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta';

    // Cada parte de la tarjeta: etiqueta de categoría, nombre, marca, precio y stock.
    // Usamos textContent para que el texto se muestre tal cual, sin interpretarse como HTML.
    tarjeta.appendChild(crear('span', 'categoria', producto.categoria));
    tarjeta.appendChild(crear('h2', 'nombre', producto.nombre));
    tarjeta.appendChild(crear('p', 'marca', producto.marca));
    tarjeta.appendChild(crear('p', 'precio', formatearPrecio(producto.precio)));

    // Disponibilidad: si el stock es mayor que 0, está disponible
    if (producto.stock > 0) {
      tarjeta.appendChild(crear('p', 'stock disponible', '✔ En stock'));
    } else {
      tarjeta.appendChild(crear('p', 'stock agotado', '✖ Agotado'));
    }

    escaparate.appendChild(tarjeta);
  }
}

// Crea un elemento HTML con una clase (para el CSS) y un texto
function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = texto;
  return elemento;
}

// Muestra el precio al estilo español: 279 → "279,00 €"; 12999 → "12.999,00 €"
function formatearPrecio(precio) {
  return precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}
