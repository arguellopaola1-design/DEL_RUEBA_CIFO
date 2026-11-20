# PROGRESO.md — Diario del proyecto

> Registro de lo que vamos haciendo, para no perder el contexto entre sesiones.
> Claude lo actualiza al terminar cada paso. Las reglas del proyecto están en `CLAUDE.md`.

---

## 📍 Dónde estamos ahora

- **Fase actual:** Fase 2 **cerrada**. Siguiente: **Fase 3 — Base de datos (MongoDB)**.
- **Siguiente paso:** fase 3, paso 1: comprobar si MongoDB y `mongosh` están instalados (proponer y pedir aprobación).
- **Pendiente para la alumna:** leer "📘 Fase 2 explicada" y responder las reflexiones de las fases 1 y 2.
- **Git:** commits "fase1" y "fase2" subidos a GitHub.

### Estado de las fases

| Fase | Estado |
|---|---|
| Fase 1 — Frontend (HTML, CSS, JS) | ✅ Cerrada (falta la reflexión de la alumna) |
| Fase 2 — Backend (NestJS) | ✅ Cerrada (falta la reflexión de la alumna) |
| Fase 3 — Base de datos (MongoDB) | ⚪ Sin empezar |

### Pasos de la fase 1

- [x] 1. `index.html`: estructura (formulario + tabla)
- [x] 2. `styles.css`: aspecto (malva, formulario y tabla lado a lado)
- [x] 3. `app.js`: comportamiento (guardar en un array y pintar la tabla)
- [x] 4. Comprobación: verificada por Claude en un navegador simulado (2 productos dados de alta → 2 filas; stock vacío → 0; formulario vaciado)
- [ ] Reflexión (para la alumna): al recargar la página, los productos desaparecían. ¿Por qué? ¿Dónde estaban guardados?

### Pasos de la fase 2

- [x] 1. Comprobar Node y npm: Node v26.13.1, npm 11.20.0 (ya estaban instalados)
- [x] 2. Crear el proyecto NestJS en `backend/` (con `--skip-git`) y ver que responde ("Hello World!")
- [x] 3. Módulo `products`: controlador (rutas) y servicio (array en memoria)
- [x] 4. Probar la API sin frontend con `curl`: `GET` → `[]`; `POST` × 2 → `GET` devuelve los 2 productos
- [x] 5. Servir `/frontend` desde NestJS (`@nestjs/serve-static`)
- [x] 6. Cambiar `app.js` para usar `fetch`
- [x] 7. Comprobación: verificada por Claude (2 altas → recargar la página → los 2 productos siguen ahí)
- [x] Comprobado por Claude: al reiniciar el servidor, `GET /api/products` devuelve `[]` (la lista se pierde).
- [ ] Reflexión (para la alumna): si paramos el servidor y lo volvemos a arrancar, los productos desaparecen. ¿Por qué?

---

## 📘 Fase 2 explicada (para leer a la vuelta)

**Qué cambia respecto a la fase 1:** aparece una pieza nueva, el **backend** (el *dependiente* de la tienda). La página ya no guarda los productos: se los **pide y se los envía al servidor**.
**Qué se mantiene:** `index.html` y `styles.css` no se han tocado. Solo ha cambiado `app.js`.

**Términos nuevos:**
- **Servidor:** un programa que está siempre encendido esperando peticiones y respondiéndolas. El nuestro es NestJS.
- **Puerto:** el "número de mostrador" por el que el servidor atiende. El nuestro es el **3000**, y `localhost` significa "este mismo ordenador". Por eso la dirección es `http://localhost:3000`.
- **Petición HTTP:** un mensaje del navegador al servidor. `GET` = "dame algo"; `POST` = "toma, guarda esto".
- **API:** la lista de peticiones que el servidor sabe atender. La nuestra tiene dos: `GET /api/products` y `POST /api/products`.
- **JSON:** el formato de texto en el que viajan los datos, por ejemplo `{"nombre":"AirPods Pro","precio":279}`.
- **CORS:** una protección de los navegadores. Si una página de una dirección intenta hablar con un servidor de **otra** dirección, el navegador lo bloquea salvo que el servidor lo permita. **Aquí no aparece** porque la página y la API salen del **mismo servidor** (`localhost:3000`).

**El viaje de un producto:**
`formulario` → `app.js` hace `fetch` (POST con JSON) → **controlador** (`products.controller.ts`, recibe la petición) → **servicio** (`products.service.ts`, lo guarda en su array) → respuesta → `app.js` pide la lista (GET) → pinta la tabla.

**Cómo arrancar el servidor** (en la terminal):
```
cd backend
npm run start
```
Cuando aparezca `Nest application successfully started`, abre **http://localhost:3000**. Para pararlo, pulsa **Ctrl + C**.

⚠️ **Importante:** desde la fase 2, la página **ya no funciona con doble clic** en `index.html` (`file://`). Hay que abrirla desde el servidor (`http://localhost:3000`), porque es él quien guarda los productos.

---

## 📁 Archivos del proyecto

```
actividad01/
├── .git/            ← (oculta) donde git guarda las "fotos" (commits). Remoto: GitHub (origin)
├── .gitignore       ← archivos que git no debe guardar (.DS_Store, node_modules/, dist/)
├── CLAUDE.md        ← reglas y plan del proyecto
├── PROGRESO.md      ← este diario
├── frontend/
│   ├── index.html   ← estructura: formulario + tabla de productos
│   ├── styles.css   ← aspecto: tonos malva, distribución lado a lado
│   └── app.js       ← comportamiento: envía/pide productos al servidor con fetch y pinta la tabla
└── backend/         ← proyecto NestJS (servidor)
    ├── package.json ← lista de librerías del backend y comandos (npm run start)
    ├── node_modules/← librerías descargadas (no se guardan en git)
    └── src/
        ├── main.ts             ← arranque: prefijo /api y puerto 3000
        ├── app.module.ts       ← módulo principal: sirve /frontend y carga ProductsModule
        ├── app.controller.ts   ← (de serie en NestJS) responde "Hello World!" en /api
        ├── app.service.ts      ← (de serie en NestJS)
        └── products/
            ├── products.module.ts      ← agrupa controlador + servicio
            ├── products.controller.ts  ← rutas HTTP: GET y POST /api/products
            └── products.service.ts     ← lógica: array de productos en memoria del servidor
```

NestJS también crea archivos que **no usamos** (tests, configuración de formato…): `src/app.controller.spec.ts`, `test/`, `eslint.config.mjs`, `.prettierrc`, `README.md`. No se han borrado (las reglas dicen no borrar sin permiso).

---

## ✅ Decisiones tomadas

| Decisión | Elección | Motivo |
|---|---|---|
| Cómo mostrar el listado | **Tabla** (Nombre, Marca, Categoría, Precio, Stock) | Más claro para comparar productos |
| Colores | **Tonos malva** (guardados como variables al inicio de `styles.css`) | Preferencia de la alumna |
| Distribución | **Formulario a la izquierda, tabla a la derecha**; en pantallas estrechas, uno debajo del otro | Se ve el producto aparecer al lado al guardar |
| Cómo ver la web | Fase 1: `file://` (doble clic). **Desde la fase 2: http://localhost:3000** | `CLAUDE.md`: solo local, sin despliegues |
| Despliegue en internet | **No** (se pidió dos veces; se explicó que está fuera de alcance) | `CLAUDE.md`: solo local |
| Control de versiones | **Git en local + GitHub** (`origin`). Commits y push solo cuando la alumna lo pida | Petición de la alumna |
| Analogías | **De una tienda de tecnología** (mostrador = frontend, dependiente = backend, almacén = base de datos) | Petición de la alumna |
| Herramienta de NestJS | Usada con **`npx`** (versión 11.0.24), **sin instalar nada global** | `CLAUDE.md` 5.5: nada global sin permiso |
| Versión de `@nestjs/serve-static` | **5.0.5** (la 12.x es para NestJS 12; nuestro NestJS es el 11) | Compatibilidad |
| Validación de datos en el backend | **Ninguna** de momento (solo se convierten precio/stock a número) | `CLAUDE.md`: validaciones complejas fuera de alcance |

---

## ❓ Dudas abiertas

- Ninguna por ahora.

---

## 📓 Registro por sesiones

### Sesión 1 — 19/11/2026

1. Leímos `CLAUDE.md` y repasamos las tres piezas (frontend, backend y base de datos) y las tres fases.
2. Se decidió mostrar el listado en una **tabla**.
3. Se pidió desplegar la web. Se explicó que el despliegue está fuera de alcance y que la web aún no existía.
4. **Creada la carpeta `frontend/` y `index.html`** con el formulario (5 campos, desplegable de categorías y botón Guardar) y una tabla vacía. Se abrió en el navegador.
   - Concepto: el atributo `required` del HTML ya avisa de que faltan campos, sin JavaScript.
5. **Creado `styles.css`** con estilos básicos en azul.
6. **Rediseño de `styles.css`:** tonos malva y formulario y tabla lado a lado.
   - Concepto: se cambió el aspecto **sin tocar el HTML** (cada archivo tiene su responsabilidad).
   - Concepto: variables de color en CSS para cambiar el tono desde un solo sitio.
7. Se volvió a pedir desplegar. Se ofrecieron opciones y la alumna eligió **verla en local**. Se abrió de nuevo en el navegador.
   - Concepto: la dirección `file://` significa que el navegador abre un archivo del disco, sin servidor. En la fase 2 pasará a ser `http://localhost:3000`.

### Sesión 2 — 20/11/2026

1. Se creó este archivo `PROGRESO.md` para llevar el control del contexto.
2. Se añadió a `CLAUDE.md` la regla 5.6: leer `PROGRESO.md` al empezar cada sesión y actualizarlo al terminar cada paso.
3. Se descartó la duda de "los 4 comandos de comprobación".
4. **Creado `app.js`.** Al pulsar Guardar: evita que la página se recargue, recoge los 5 datos, los añade al array `productos`, vuelve a pintar la tabla y vacía el formulario.
   - Concepto: `preventDefault()` evita que el formulario recargue la página, que es su comportamiento por defecto.
   - Concepto: los datos viven en un array en la memoria del navegador, así que se pierden al recargar.
5. **Git:** git ya estaba instalado (2.39.5). Se actualizó `CLAUDE.md` para permitir git en local, se ejecutó `git init`, se creó `.gitignore` y se hizo el **primer commit, "fase1"**. La comprobación del paso 4 todavía estaba pendiente.
   - Concepto: un commit es una "foto" del proyecto en un momento dado. Permite ver qué cambió y volver atrás.
6. **GitHub:** se conectó el remoto `origin` → https://github.com/arguellopaola1-design/DEL_RUEBA_CIFO (repositorio **público**). La autora de los commits pasa a ser `arguellopaola1-design`, con su correo privado de GitHub (noreply). Se subió el commit "fase1" con `git push -u origin main`.
   - El token se usó solo para esa subida y **no está guardado** en el Mac. Para el próximo `push` habrá que volver a pegarlo (o guardarlo en el Llavero).
   - Pendiente: borrar el token en GitHub al terminar la actividad, porque quedó escrito en el chat.
   - Concepto: un repositorio "remoto" es una copia del proyecto en internet. `push` = subir los commits locales a esa copia.
7. **Pausa de clase.** La alumna pidió cerrar la fase 1 y seguir con la fase 2.
   - Fase 1 verificada por Claude: la sintaxis de `app.js` es correcta, los ids coinciden con `index.html` y una prueba simulada con 2 productos funciona.
8. **Fase 2 (durante la pausa, sin la alumna delante):**
   - Node y npm ya estaban instalados.
   - `npx @nestjs/cli@11.0.24 new backend --skip-git --package-manager npm` → proyecto creado, sin `.git` interno. Arrancado: responde "Hello World!".
   - Con `--skip-git` NestJS no crea `.gitignore`, así que se añadieron `node_modules/` y `dist/` al `.gitignore` de la raíz.
   - Creados `products.service.ts`, `products.controller.ts` y `products.module.ts`. Prefijo `/api` en `main.ts`. `ProductsModule` registrado en `app.module.ts`.
   - API probada con `curl`: GET vacío → 2 POST → GET con los 2 productos.
   - Instalado `@nestjs/serve-static@5.0.5` (solo en `backend/`). Configurado en `app.module.ts`. Comprobado: `/`, `/styles.css`, `/app.js` y `/api/products` responden.
     - npm mostró un aviso de "install-scripts" de `@parcel/watcher`: viene de `jest` (tests de NestJS), no afecta.
   - `app.js` reescrito con `fetch`: al abrir la página hace GET; al guardar hace POST y vuelve a pedir la lista.
   - Comprobación con navegador simulado contra `http://localhost:3000`: 2 altas → "recargar" → los 2 productos siguen ahí. ✅
   - El servidor se dejó **arrancado** (con los 2 productos de prueba de Claude: MacBook Air M3 y Galaxy S24).
9. **Vuelta de la pausa.** La alumna pidió revisar la fase 2, cerrarla y hacer commit y push.
   - Revisión: `/`, `/app.js` y `/api/products` responden 200; la prueba de "recargar" funciona.
   - Reinicio del servidor → `GET /api/products` devuelve `[]`: los datos en memoria del servidor se pierden al apagarlo (lo resolverá la fase 3).
   - **Fase 2 cerrada.** Commit **"fase2"** y push a GitHub.
