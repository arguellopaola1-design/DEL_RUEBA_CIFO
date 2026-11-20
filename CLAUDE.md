# CLAUDE.md — Proyecto fullstack mínimo: catálogo de productos tecnológicos

> Este archivo lo lee Claude automáticamente al trabajar en esta carpeta.
> Contiene el contexto del proyecto y las reglas de trabajo. **Síguelas siempre.**

---

## 1. Contexto y objetivo

- Es un **entorno de aprendizaje**. La alumna tiene **experiencia baja** con terminal, Node y programación.
- El objetivo es **entender las piezas de una aplicación fullstack y cómo se conectan**, no aprender a programar.
  - Qué hace el frontend, qué hace el backend y qué hace la base de datos.
  - Cómo viaja un dato: formulario → petición HTTP → backend → MongoDB → respuesta → listado.
- El proyecto se construye **por capas, en tres fases**. Cada fase añade una pieza nueva sobre lo que ya funciona, para ver qué problema resuelve.
- El código debe ser **mínimo, claro y comentado en español**. Nada de optimizaciones, patrones avanzados ni "buenas prácticas" que añadan piezas innecesarias.

## 2. Qué construimos

Una web sencilla con:
1. Un **formulario** para dar de alta productos tecnológicos.
2. Un **listado** de los productos guardados.

### Stack (se va incorporando por fases)

| Pieza | Tecnología | Fase en la que entra |
|---|---|---|
| Frontend | HTML + CSS3 + JavaScript "vanilla" (sin frameworks ni librerías) | Fase 1 |
| Backend | NestJS (Node.js + TypeScript), API REST que también sirve el frontend | Fase 2 |
| Base de datos | MongoDB instalado en local, conectado con Mongoose. MongoDB Compass (opcional) para ver los datos | Fase 3 |

### Restricciones
- **Solo local.** Nada de despliegues ni servicios en la nube.
- **Sin autenticación** de momento.
- **Git solo en local.** Hay un único repositorio git en la raíz del proyecto (`actividad01/`). Los commits se hacen solo cuando la alumna lo pida. Remoto en GitHub: `https://github.com/arguellopaola1-design/DEL_RUEBA_CIFO.git` (`origin`). Solo se sube (`git push`) cuando la alumna lo pida. El login lo hace ella con un token: Claude nunca ve ni guarda credenciales. Al crear el proyecto NestJS, usa la opción `--skip-git`, porque `nest new` crea su propio repositorio git por defecto y no queremos uno dentro de otro.
- **Sistema operativo:** macOS o Linux. Si un comando es distinto en cada uno, indica las dos versiones.

## 3. Modelo de datos: `Product`

| Campo | Tipo | Obligatorio | Ejemplo |
|---|---|---|---|
| `nombre` | texto | sí | "MacBook Air M3" |
| `marca` | texto | sí | "Apple" |
| `categoria` | texto (lista cerrada) | sí | "portátil" |
| `precio` | número (euros) | sí | 1299 |
| `stock` | número entero | no (por defecto 0) | 5 |

Categorías permitidas: `portátil`, `móvil`, `tablet`, `audio`, `accesorio`.

El mismo modelo se usa en las tres fases. Lo único que cambia es **dónde se guarda** el producto.

---

## 4. Las tres fases

Cada fase termina con una **comprobación** visible ("¿cómo sé que esto funciona?") y con una **pregunta de reflexión** sobre la limitación que resolverá la fase siguiente. No se pasa a la siguiente fase sin que la anterior funcione y la alumna lo confirme.

### Fase 1 — Solo frontend

**Objetivo:** entender qué es el frontend: estructura (HTML), aspecto (CSS) y comportamiento (JS).

- Formulario y listado en una sola página.
- Los productos se guardan en un **array de JavaScript en memoria**, es decir, en el navegador.
- Se abre `index.html` directamente en el navegador, haciendo doble clic. No hace falta instalar nada.

**Pasos:**
1. `index.html`: estructura con el formulario y el contenedor del listado.
2. `styles.css`: estilos básicos y limpios.
3. `app.js`: recoger los datos del formulario, añadirlos al array y pintar el listado.
4. Comprobación: añadir varios productos y verlos en el listado.

**Reflexión:** al recargar la página los productos desaparecen. ¿Por qué? ¿Dónde estaban guardados?

```
actividad-01/
├── CLAUDE.md
└── frontend/
    ├── index.html
    ├── styles.css
    └── app.js
```

### Fase 2 — Añadimos el backend (NestJS)

**Objetivo:** entender qué es un servidor, qué es una API y cómo hablan el frontend y el backend mediante peticiones HTTP y JSON.

- Requisitos: Node.js y npm. Comprueba si están instalados y, si falta algo, propón la instalación y pide aprobación.
- Se crea el proyecto NestJS en `/backend` con `--skip-git` y usando npm.
- Los productos pasan a guardarse en un **array en memoria dentro del backend**, en el servicio.
- NestJS **sirve el frontend** (con `@nestjs/serve-static`) en `http://localhost:3000/`, y la API va bajo el prefijo `/api`.
- `app.js` deja de usar el array local y usa `fetch` para llamar a la API.

**API:**

| Método | Ruta | Qué hace |
|---|---|---|
| `GET` | `/api/products` | Devuelve todos los productos |
| `POST` | `/api/products` | Crea un producto con los datos del formulario |

**Pasos:**
1. Comprobar Node y npm.
2. Crear el proyecto NestJS, arrancarlo y ver que responde en el navegador.
3. Módulo `products`: controlador (rutas) y servicio (array en memoria).
4. Probar la API sin frontend, con el navegador para `GET` y con `curl` para `POST`.
5. Servir la carpeta `/frontend` desde NestJS.
6. Cambiar `app.js` para usar `fetch`.
7. Comprobación: los productos siguen ahí al recargar la página.

**CORS:** como frontend y backend se sirven desde el mismo origen, no hace falta. Explica brevemente qué es CORS y por qué aquí no aparece.

**Reflexión:** si paramos el servidor y lo volvemos a arrancar, los productos desaparecen. ¿Por qué?

```
actividad-01/
├── CLAUDE.md
├── frontend/              ← mismos archivos; app.js ahora usa fetch
└── backend/               ← proyecto NestJS
    └── src/
        ├── main.ts
        ├── app.module.ts  ← sirve /frontend
        └── products/
            ├── products.module.ts
            ├── products.controller.ts   ← rutas HTTP
            └── products.service.ts      ← lógica (array en memoria)
```

### Fase 3 — Añadimos la base de datos (MongoDB)

**Objetivo:** entender qué es una base de datos y qué significa que los datos **persistan**.

- Requisitos: MongoDB instalado en local, `mongosh` y, opcionalmente, MongoDB Compass. Comprueba qué hay, propón la instalación y pide aprobación.
- Conexión: `mongodb://localhost:27017/actividad01`, colección `products`.
- Se añade Mongoose a NestJS y un esquema `Product` (`product.schema.ts`).
- El servicio deja de usar el array y pasa a leer y escribir en MongoDB.
- **El frontend no cambia.** Es una lección en sí misma: cada pieza tiene su responsabilidad.

**Pasos:**
1. Comprobar o instalar MongoDB y arrancarlo. Verificar que responde con `mongosh`.
2. Instalar Mongoose en el backend y configurar la conexión en `app.module.ts`.
3. Crear `product.schema.ts`.
4. Cambiar el servicio para que use la base de datos.
5. Comprobación: añadir productos, reiniciar el servidor y ver que siguen ahí. Verlos también en Compass o `mongosh`.

**Repaso final:** diagrama del recorrido completo de un dato y resumen de cada pieza y de lo que aportó cada fase.

---

## 5. Reglas de trabajo (MUY IMPORTANTES)

### 5.1 Siempre: plan → aprobación → ejecución
Antes de **cualquier** acción (crear o modificar archivos, ejecutar comandos, instalar paquetes):
1. Muestra **qué vas a hacer**, en una lista corta.
2. Explica **por qué**: qué pieza del sistema estamos tocando.
3. **Espera aprobación explícita** ("ok", "adelante", "sí"…). No actúes sin ella.

Si durante la ejecución aparece algo no previsto (un error, un cambio de plan), **para**, explícalo y vuelve a pedir aprobación.

### 5.2 Pregunta siempre que haga falta
- Ante cualquier duda o ambigüedad, **pregunta en vez de suponer**.
- Tómate el tiempo necesario. **No hay prisa**: es preferible ir lento y que se entienda.
- Haz preguntas concretas, a poder ser con opciones.
- De vez en cuando, comprueba que se entiende ("¿queda claro qué hace este archivo?").

### 5.3 Pasos pequeños
- Un paso cada vez: un archivo o un concepto.
- Nunca generes una fase entera de golpe, y menos todo el proyecto.
- No adelantes trabajo de fases posteriores. Por ejemplo, en la fase 1 no prepares nada para el backend.
- Después de cada paso, una comprobación sencilla de que funciona.

### 5.4 Explicaciones para nivel principiante
- Lenguaje sencillo y en español. Si usas un término técnico (servidor, API, endpoint, JSON, petición HTTP, puerto, esquema…), defínelo en una frase la primera vez.
- Antes de ejecutar un comando, explica **qué hace** y **qué resultado esperamos**.
- Usa analogías cuando ayuden (p. ej., frontend = sala del restaurante, backend = camarero y cocina, base de datos = despensa).
- Al crear un archivo, explica su papel en el conjunto, no cada línea de código.
- Al cambiar de fase, explica **qué cambia y qué se mantiene** respecto a la fase anterior.
- Comenta el código en español, con comentarios breves y útiles.

### 5.5 Seguridad y limpieza
- No borres archivos ni carpetas sin aprobación explícita.
- No instales nada global (`npm install -g`, `brew`, `apt`…) sin explicarlo y pedir aprobación.
- No añadas dependencias que no estén justificadas en el plan.
- Si un comando necesita `sudo`, avisa y explica por qué antes de proponerlo.
- Git: solo commits locales cuando la alumna lo pida (ver restricciones).

### 5.6 Diario del proyecto (`PROGRESO.md`)
- **Al empezar cada sesión**, lee `PROGRESO.md` para recuperar el contexto: dónde estamos, qué decisiones se han tomado y cuál es el siguiente paso.
- **Al terminar cada paso**, actualízalo: estado actual, archivos, decisiones nuevas y una entrada en el registro de la sesión.

### 5.7 Errores
- Si algo falla, **no lo arregles en silencio**. Muestra el error, explica en lenguaje sencillo qué significa, propón la solución y espera aprobación.
- Los errores son parte del aprendizaje: aprovéchalos para explicar.

## 6. Fuera de alcance (de momento)
Autenticación, despliegue, Docker, tests automatizados, frameworks de frontend, editar o borrar productos, paginación y validaciones complejas. Si alguna parece necesaria, **propónla y pregunta**; no la añadas por tu cuenta.
