# Catálogo de productos tecnológicos

Proyecto de aprendizaje para **entender las piezas de una aplicación fullstack** (frontend, backend y base de datos) y **cómo se comunican** entre ellas.

La web es sencilla: un **formulario** para dar de alta productos tecnológicos y un **listado** (tabla) con los productos guardados.

> 🛍️ **La analogía de la tienda de tecnología**
> - **Frontend** → el mostrador y el escaparate: lo que ve y usa el cliente.
> - **Backend** → el dependiente: recibe las peticiones y decide qué hacer con ellas.
> - **Base de datos** → el almacén: donde los productos quedan guardados de verdad.

---

## 🧱 Construido por fases

Cada fase añade una pieza nueva sobre lo que ya funciona, para ver qué problema resuelve.

| Fase | Pieza nueva | Dónde se guardan los productos | Limitación |
|---|---|---|---|
| ✅ **1. Frontend** | HTML + CSS + JavaScript | En un array, en la memoria del **navegador** | Al recargar la página, se pierden |
| ✅ **2. Backend** | NestJS (API REST) | En un array, en la memoria del **servidor** | Al reiniciar el servidor, se pierden |
| ✅ **3. Base de datos** | MongoDB + Mongoose | En **MongoDB**, en el disco | Ninguna: los datos **persisten** |

### El viaje de un producto

```
Formulario ──fetch (POST, JSON)──▶ Backend NestJS ──Mongoose──▶ MongoDB
    ▲                                   │
    └──── tabla ◀── fetch (GET, JSON) ──┘
```

---

## 🛠️ Tecnología

| Pieza | Tecnología |
|---|---|
| Frontend | HTML, CSS3 y JavaScript "vanilla" (sin frameworks) |
| Backend | [NestJS](https://nestjs.com/) 11 (Node.js + TypeScript) |
| Base de datos | [MongoDB](https://www.mongodb.com/) 8.0 en local, con [Mongoose](https://mongoosejs.com/) |

### API

| Método | Ruta | Qué hace |
|---|---|---|
| `GET` | `/api/products` | Devuelve todos los productos |
| `POST` | `/api/products` | Crea un producto |

### Modelo de datos: `Product`

| Campo | Tipo | Obligatorio | Ejemplo |
|---|---|---|---|
| `nombre` | texto | sí | "MacBook Air M3" |
| `marca` | texto | sí | "Apple" |
| `categoria` | `portátil`, `móvil`, `tablet`, `audio` o `accesorio` | sí | "portátil" |
| `precio` | número (euros) | sí | 1299 |
| `stock` | número entero | no (por defecto 0) | 5 |

---

## ▶️ Cómo ponerlo en marcha (en local)

**Requisitos:** [Node.js](https://nodejs.org/) y npm, y MongoDB en local.

1. **Arrancar MongoDB** (debe estar escuchando en `localhost:27017`).
2. **Instalar las dependencias y arrancar el backend:**
   ```bash
   cd backend
   npm install
   npm run start
   ```
3. Cuando aparezca `Nest application successfully started`, abrir **http://localhost:3000** en el navegador.

Para parar el servidor: `Ctrl + C`.

---

## 📁 Estructura

```
├── README.md          ← este archivo
├── CLAUDE.md          ← contexto y reglas de trabajo del proyecto
├── PROGRESO.md        ← diario de lo que se ha hecho en cada sesión
├── frontend/
│   ├── index.html     ← estructura: formulario + tabla
│   ├── styles.css     ← aspecto (tonos malva)
│   └── app.js         ← comportamiento: habla con la API mediante fetch
└── backend/           ← servidor NestJS
    └── src/
        ├── main.ts                     ← arranque (puerto 3000, prefijo /api)
        ├── app.module.ts               ← sirve el frontend y conecta con MongoDB
        └── products/
            ├── product.schema.ts       ← cómo es un producto en MongoDB
            ├── products.module.ts      ← agrupa las piezas de productos
            ├── products.controller.ts  ← rutas HTTP (GET y POST)
            └── products.service.ts     ← lógica: guardar y leer productos
```
