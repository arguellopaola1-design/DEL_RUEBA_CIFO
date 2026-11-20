# PROGRESO.md — Diario del proyecto

> Registro de lo que vamos haciendo, para no perder el contexto entre sesiones.
> Claude lo actualiza al terminar cada paso. Las reglas del proyecto están en `CLAUDE.md`.

---

## 📍 Dónde estamos ahora

- **Fase actual:** Fase 1 — Solo frontend
- **Último paso terminado:** paso 3 (`app.js`) — pendiente de que la alumna confirme que funciona
- **Siguiente paso:** paso 4 — comprobación: añadir varios productos y verlos en la tabla. Después, la reflexión.

### Estado de las fases

| Fase | Estado |
|---|---|
| Fase 1 — Frontend (HTML, CSS, JS) | 🟡 En curso (3 de 4 pasos) |
| Fase 2 — Backend (NestJS) | ⚪ Sin empezar |
| Fase 3 — Base de datos (MongoDB) | ⚪ Sin empezar |

### Pasos de la fase 1

- [x] 1. `index.html`: estructura (formulario + tabla)
- [x] 2. `styles.css`: aspecto (malva, formulario y tabla lado a lado)
- [x] 3. `app.js`: comportamiento (guardar en un array y pintar la tabla)
- [ ] 4. Comprobación: añadir varios productos y verlos en la tabla
- [ ] Reflexión: ¿por qué desaparecen los productos al recargar?

---

## 📁 Archivos del proyecto

```
actividad01/
├── .git/            ← (oculta) donde git guarda las "fotos" (commits)
├── .gitignore       ← archivos que git no debe guardar (.DS_Store)
├── CLAUDE.md        ← reglas y plan del proyecto
├── PROGRESO.md      ← este diario
└── frontend/
    ├── index.html   ← estructura: formulario + tabla de productos
    ├── styles.css   ← aspecto: tonos malva, distribución lado a lado
    └── app.js       ← comportamiento: guarda productos en un array y pinta la tabla
```

---

## ✅ Decisiones tomadas

| Decisión | Elección | Motivo |
|---|---|---|
| Cómo mostrar el listado | **Tabla** (Nombre, Marca, Categoría, Precio, Stock) | Más claro para comparar productos |
| Colores | **Tonos malva** (guardados como variables al inicio de `styles.css`) | Preferencia de la alumna |
| Distribución | **Formulario a la izquierda, tabla a la derecha**; en pantallas estrechas, uno debajo del otro | Se ve el producto aparecer al lado al guardar |
| Cómo ver la web | **En local**, abriendo `index.html` en el navegador (`file://...`) | `CLAUDE.md`: solo local, sin despliegues |
| Despliegue en internet | **No** (se pidió dos veces; se explicó que está fuera de alcance) | `CLAUDE.md`: solo local |
| Control de versiones | **Git solo en local**, un único repositorio en la raíz y commits solo cuando la alumna lo pida. Se actualizó `CLAUDE.md` (antes decía "sin git") | Petición de la alumna, para guardar "fotos" del proyecto |
| Analogías | **De una tienda de tecnología** (mostrador = frontend, dependiente = backend, almacén = base de datos) | Petición de la alumna |

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
