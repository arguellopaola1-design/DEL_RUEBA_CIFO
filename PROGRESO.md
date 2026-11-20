# PROGRESO.md — Diario del proyecto

> Registro de lo que vamos haciendo, para no perder el contexto entre sesiones.
> Claude lo actualiza al terminar cada paso. Las reglas del proyecto están en `CLAUDE.md`.

---

## 📍 Dónde estamos ahora

- **Fase actual:** ✅ **Las tres fases están cerradas.**
- **Trabajo extra en curso:** página del **cliente** (escaparate) en `/tienda.html`, usando el mismo backend y la misma base de datos. ✅ **Hecha** (`tienda.html`, `tienda.css`, `tienda.js`), sin cambios en el backend.
- **Trabajo extra en curso:** **despliegue en Render** (GitHub Actions + MongoDB Atlas). Archivos preparados y probados en local; **sin commit todavía**.
- **Hecho:** paso 1 de `DESPLIEGUE.md` (MongoDB Atlas). La alumna comprobó la conexión con `mongosh` → `{ ok: 1 }`.
- **Siguiente paso:** la alumna da el permiso **Workflows** al token (paso 0) → Claude hace commit + push → pasos 2-5 (Render, Auto-Deploy Off, Deploy Hook, prueba).
- **Pendiente para la alumna:** leer "📘 Fase 2 explicada" y responder las reflexiones de las fases 1 y 2.
- **Git:** commits "fase1", "fase2" y "Añadir README del proyecto" subidos a GitHub. **Los cambios de la fase 3 aún no tienen commit.**

### Estado de las fases

| Fase | Estado |
|---|---|
| Fase 1 — Frontend (HTML, CSS, JS) | ✅ Cerrada (falta la reflexión de la alumna) |
| Fase 2 — Backend (NestJS) | ✅ Cerrada (falta la reflexión de la alumna) |
| Fase 3 — Base de datos (MongoDB) | ✅ Cerrada |

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

### Pasos de la fase 3

- [x] 1. MongoDB instalado (en `~/mongodb`, sin administrador), arrancado y verificado con `mongosh` → `{ ok: 1 }`
- [x] 2. Mongoose instalado en `backend/` y conexión configurada en `app.module.ts` (`mongodb://localhost:27017/actividad01`)
- [x] 3. Crear `product.schema.ts` (y registrarlo en `products.module.ts`)
- [x] 4. Cambiar el servicio para que use la base de datos (y ajustar los tipos del controlador)
- [x] 5. Comprobación: 4 productos (uno añadido por la alumna desde la web) → servidor apagado (MongoDB sigue con 4) → servidor arrancado → la API devuelve los 4. ✅

### 🗄️ Cómo arrancar MongoDB (cada día, antes del backend)

MongoDB está instalado **solo en tu carpeta personal** (`~/mongodb`) y **no arranca solo** al encender el Mac.

```
# Arrancar MongoDB (en segundo plano)
~/mongodb/servidor/bin/mongod --dbpath ~/mongodb/datos --bind_ip 127.0.0.1 --port 27017 --logpath ~/mongodb/mongod.log --fork

# Comprobar que responde (esperamos { ok: 1 })
~/mongodb/mongosh/bin/mongosh --quiet --eval "db.runCommand({ ping: 1 })"

# Pararlo
~/mongodb/mongosh/bin/mongosh --quiet admin --eval "db.shutdownServer()"
```

Contenido de `~/mongodb/`: `servidor/` (MongoDB 8.0.38), `mongosh/` (2.14.1), `datos/` (**el almacén: aquí se guardan los productos**), `descargas/` (los archivos descargados), `mongod.log` (el registro de lo que hace MongoDB).

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
├── README.md        ← "portada" del proyecto en GitHub (qué es, fases, cómo arrancarlo)
├── frontend/
│   ├── index.html   ← estructura: formulario + tabla de productos
│   ├── styles.css   ← aspecto: tonos malva, distribución lado a lado
│   ├── app.js       ← comportamiento: envía/pide productos al servidor con fetch y pinta la tabla
│   ├── tienda.html  ← (extra) página del cliente: estructura del escaparate
│   ├── tienda.css   ← (extra) aspecto del escaparate: cabecera malva y tarjetas en rejilla
│   └── tienda.js    ← (extra) pide los productos (GET /api/products) y crea una tarjeta por producto
└── backend/         ← proyecto NestJS (servidor)
    ├── package.json ← lista de librerías del backend y comandos (npm run start)
    ├── node_modules/← librerías descargadas (no se guardan en git)
    └── src/
        ├── main.ts             ← arranque: prefijo /api y puerto 3000
        ├── app.module.ts       ← módulo principal: sirve /frontend, conecta con MongoDB y carga ProductsModule
        ├── app.controller.ts   ← (de serie en NestJS) responde "Hello World!" en /api
        ├── app.service.ts      ← (de serie en NestJS)
        └── products/
            ├── product.schema.ts       ← esquema: cómo es un producto en MongoDB (campos, obligatorios, categorías)
            ├── products.module.ts      ← agrupa controlador + servicio y registra el esquema
            ├── products.controller.ts  ← rutas HTTP: GET y POST /api/products
            └── products.service.ts     ← lógica: lee y guarda los productos en MongoDB
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
| Página del cliente (extra) | **Tarjetas**, mismos colores malva, aviso "En stock / Agotado", sin filtro ni enlaces entre páginas. Archivos propios: `tienda.html`, `tienda.css`, `tienda.js`. **Sin cambios en el backend** | Elección de la alumna. Lección: un mismo backend sirve a varios frontends |
| Despliegue (extra) | **Render** (Free) + **MongoDB Atlas** (M0) + **GitHub Actions** con *Deploy Hook*; Auto-Deploy de Render **apagado** | Petición de la alumna. Render no puede llegar al MongoDB local; Actions hace de control de calidad antes de desplegar |
| Node en producción | **22.x** (`engines` en `package.json` y en Actions) | Versión LTS, compatible con NestJS 11 |
| Analogías | **De una tienda de tecnología** (mostrador = frontend, dependiente = backend, almacén = base de datos) | Petición de la alumna |
| Herramienta de NestJS | Usada con **`npx`** (versión 11.0.24), **sin instalar nada global** | `CLAUDE.md` 5.5: nada global sin permiso |
| Versión de `@nestjs/serve-static` | **5.0.5** (la 12.x es para NestJS 12; nuestro NestJS es el 11) | Compatibilidad |
| Instalación de MongoDB | **En `~/mongodb`, descargado de la web oficial**, sin Homebrew | El Homebrew del aula es de otra cuenta y `alumne_mati1` no es administradora |
| Versiones de la fase 3 | MongoDB **8.0.38**, mongosh **2.14.1**, `@nestjs/mongoose` **11.0.4** (la 12 es para NestJS 12), `mongoose` **8.24.7** (las más nuevas tenían menos de 2 semanas) | Estabilidad y compatibilidad |
| MongoDB Compass | **Instalado** (1.53.2) en `~/Applications`, sin administrador | Petición de la alumna, para ver los datos con ventanas |
| Avisos de `npm audit` | **No** se ejecuta `npm audit fix --force` | Puede romper versiones; el proyecto es local y de aprendizaje |
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

### Sesión 2 (continuación) — Fase 3: instalación

10. Comprobación: no estaban `mongod` ni `mongosh`; Homebrew sí.
11. `brew tap mongodb/brew` **falló** ("Permission denied"): el Homebrew de este Mac pertenece a otra cuenta (`gc00612734`) y `alumne_mati1` no es administradora. No se usó `sudo`.
12. Plan B aprobado: descargar MongoDB 8.0.38 y mongosh 2.14.1 de la web oficial a `~/mongodb`, descomprimirlos, arrancar `mongod` con `--dbpath ~/mongodb/datos` y verificarlo con `mongosh` → `{ ok: 1 }`. ✅
    - Se intentó quitar la "cuarentena" de macOS con `xattr` y el sistema de seguridad lo bloqueó. No hizo falta: los archivos no estaban en cuarentena.
13. Instalados `@nestjs/mongoose@11.0.4` y `mongoose@8.24.7` en `backend/`.
    - Concepto: **Mongoose** es la librería con la que NestJS habla con MongoDB (el "idioma" entre el dependiente y el almacén).
14. **Conexión configurada:** `MongooseModule.forRoot('mongodb://localhost:27017/actividad01')` en `app.module.ts`. Al arrancar aparece `MongooseCoreModule dependencies initialized` y MongoDB muestra conexiones abiertas. ✅
    - Concepto: la "cadena de conexión" `mongodb://localhost:27017/actividad01` = tipo de base de datos (`mongodb`), dónde está (`localhost`, este ordenador), por qué puerto (`27017`) y qué base de datos (`actividad01`).
    - Los productos **todavía** se guardan en el array del servicio (cambia en los pasos 3 y 4).
15. **Creado `product.schema.ts`:** nombre, marca, categoría y precio obligatorios; categoría limitada a portátil/móvil/tablet/audio/accesorio; stock 0 por defecto; colección `products`. Registrado en `products.module.ts` con `MongooseModule.forFeature`. El servidor arranca sin errores (`ProductsModule dependencies initialized`). ✅
    - Concepto: un **esquema** es la "ficha" o plantilla de etiqueta de cada producto en el almacén. Mongoose lo usa para comprobar los datos antes de guardarlos.
    - Concepto: una **colección** es como una estantería del almacén donde se guardan todos los productos del mismo tipo (aquí, `products`).
16. La alumna preguntó por qué GitHub no mostraba un README: no existía en la raíz (el de `backend/` es el genérico de NestJS). Se creó **`README.md`** (qué es, analogía, fases, tecnología, API, modelo, cómo arrancarlo y estructura) y se subió en un commit **solo con ese archivo**: "Añadir README del proyecto".
    - Concepto: GitHub muestra como "portada" el `README.md` de la carpeta principal.
    - Al cerrar la fase 3, actualizar en el README la fila de la fase 3 (🟡 → ✅) y quitar "La fase 3 está en desarrollo".
17. **Servicio cambiado a MongoDB:** ya no hay array. `findAll()` usa `productModel.find()` y `create()` usa `new productModel(datos).save()`.
    - **Cambio no previsto:** el controlador también se tocó, pero solo los tipos (ahora devuelve `Promise<...>` porque hay que esperar a la base de datos e importa `Product` del esquema). Las rutas no cambian. **El frontend no se tocó.**
    - Prueba con `curl`: GET `[]` → 2 POST → GET con los 2. Vistos también en `mongosh` (`db.products.find()`). ✅
    - Ahora cada producto lleva `_id` (identificador único que pone MongoDB) y `__v` (versión, lo pone Mongoose).
    - Prueba del esquema: un POST con categoría "electrodoméstico" se **rechaza** ("validation failed") y no se guarda. La API responde con un error genérico 500. Devolver un error más claro (400) quedaría fuera de alcance; en la web no puede pasar porque la categoría es un desplegable.
    - Concepto: `async/await` = "espera a que la base de datos responda antes de seguir".
18. **Comprobación final de la fase 3:** la alumna añadió "KUAWEI 350" desde la web y Claude añadió "iPad Air" con el formulario (navegador simulado). Con el servidor **apagado**, la web no responde, pero MongoDB sigue teniendo 4 productos. Al **volver a arrancar**, la API devuelve los 4. ✅ **Fase 3 cerrada.**
    - Concepto: **persistencia** = los datos sobreviven aunque se apague el programa que los usa, porque están guardados en el disco (en `~/mongodb/datos`).
    - README actualizado: fase 3 🟡 → ✅.
19. **Repaso final** hecho en el chat: diagrama del recorrido de un producto, qué hace cada pieza y qué aportó cada fase. Commit **"fase3"** subido a GitHub.
20. Se exploraron los datos con `mongosh`: bases de datos, la colección `products`, los 4 documentos y consultas de ejemplo (`find({categoria:'tablet'})`, `$lt`, `sort`).
    - Concepto: base de datos = almacén; colección = estantería; documento = caja; `_id` = número de serie.
    - La alumna escribió `mongosh` y salió "command not found": no está en el `PATH` porque se instaló en `~/mongodb`. Se usa con la ruta completa `~/mongodb/mongosh/bin/mongosh`. Se ofreció añadirlo al `PATH` (`~/.zshrc`), sin respuesta todavía.
21. **Compass instalado:** se descargó `mongodb-compass-1.53.2-darwin-arm64.zip` (la 1.53.3 era del mismo día) y se descomprimió en `~/Applications/MongoDB Compass.app`. Los archivos de licencia sueltos del zip se movieron a `~/mongodb/compass-licencias/`. Se abrió sin problemas.
    - Para conectarse: `mongodb://localhost:27017` → base de datos `actividad01` → colección `products`.

### Extra — Página del cliente (escaparate)

22. La alumna pidió "cómo lo vería el usuario" con el mismo backend y la misma base de datos. Se propuso una página de **cliente** (solo lectura) separada de la de **administración**. Elecciones: tarjetas, mismos colores malva, aviso de stock; sin filtro ni enlaces.
23. **Creado `frontend/tienda.html`:** cabecera y contenedor `#escaparate` vacío. Se sirve en `http://localhost:3000/tienda.html` (200) sin tocar el backend, porque `serve-static` entrega cualquier archivo de `frontend/`.
24. **Creado `frontend/tienda.css`:** mismas variables malva, cabecera con degradado, rejilla de tarjetas (`auto-fill`, mínimo 220px: se adapta sola al ancho de la pantalla) y estilos de etiqueta de categoría, precio y stock (verde/rojo).
    - Se repiten las variables de color en lugar de enlazar `styles.css`, porque `styles.css` coloca la página en dos columnas (formulario + tabla) y estropearía el escaparate.
25. **Creado `frontend/tienda.js`:** hace `GET /api/products` (la misma ruta que la administración), crea una tarjeta por producto (categoría, nombre, marca, precio en formato español, "✔ En stock" o "✖ Agotado") y muestra "Todavía no hay productos" si la lista está vacía.
    - Comprobación: 5 tarjetas (la alumna había añadido "Smart watch"); AirPods Pro, con stock 0, sale como "Agotado". ✅
    - Concepto: **un mismo backend, dos frontends**. La administración escribe (POST) y lee (GET); la tienda solo lee (GET). Las dos ven los mismos datos porque comparten API y base de datos.

### Extra — Despliegue en Render

26. La alumna pidió desplegar en Render (cuenta free) con GitHub Actions. Se explicó: choca con "solo local" de `CLAUDE.md`; hace falta **MongoDB Atlas** porque Render no llega al MongoDB del Mac; la app no tiene login (cualquiera podrá añadir productos); Render free se duerme a los 15 min; el token necesita el permiso **Workflows**. La alumna aprobó el plan (la guía incluye crear la cuenta de Atlas; la tienda va incluida).
27. Cambios:
    - `app.module.ts`: `MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/actividad01')`. En local no cambia nada.
    - `backend/package.json`: `"engines": { "node": "22.x" }`.
    - **Nuevo** `.github/workflows/deploy.yml`: trabajo 1 `npm ci` + `npm run build` (Node 22); trabajo 2 (solo si el 1 va bien) llama al secret `RENDER_DEPLOY_HOOK_URL`. Si el secret no existe todavía, avisa y no falla.
    - **Nuevo** `DESPLIEGUE.md`: guía paso a paso (token → Atlas → Render → Auto-Deploy Off → Deploy Hook en Secrets → prueba) con una tabla de problemas frecuentes.
    - `CLAUDE.md`: se permite el despliegue en Render (y nada más en la nube sin preguntar). `README.md`: las dos caras (administración y tienda), la sección de despliegue y la estructura.
28. **Simulación de Render en local** (copia limpia del proyecto): `npm ci` ✅ → `npm run build` ✅ (`dist/main.js`) → `PORT=4000 MONGODB_URI=… npm run start:prod` ✅ → `/`, `/tienda.html`, `/tienda.js` y `/api/products` responden 200 y devuelven los 5 productos.
    - Concepto: **variable de entorno** = un dato que se le da al programa desde fuera (no está en el código). Sirve para que el mismo código funcione distinto en local y en Render, y para no escribir secretos en el código.
29. **MongoDB Atlas listo (paso 1):** la alumna creó el cluster y lo comprobó **ella misma en la app Terminal** (opción B, para que la contraseña no pase por el chat): `mongosh "<su URI>" --eval "db.runCommand({ ping: 1 })"` → `{ ok: 1 }`. ✅ La dirección, el usuario y la contraseña son correctos y Network Access está abierto.
