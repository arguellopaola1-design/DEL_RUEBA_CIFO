# 🚀 Guía de despliegue: Render + MongoDB Atlas + GitHub Actions

Esta guía explica cómo poner la aplicación **en internet**, para que cualquiera pueda abrirla desde su móvil o su ordenador.

> 🛍️ **Con la analogía de la tienda:** hasta ahora la tienda estaba montada dentro de casa (tu Mac). Desplegar es **abrirla en la calle**:
> - **Render** es el **local comercial**: un ordenador en internet donde funcionará el backend, que a su vez entrega el frontend.
> - **MongoDB Atlas** es el **almacén en la nube**. Render no puede llegar al MongoDB de tu Mac, así que el almacén también tiene que estar en internet.
> - **GitHub Actions** es el **encargado de control de calidad**: cada vez que subes cambios, comprueba que todo compila y, si está bien, avisa a Render para que actualice la tienda.

---

## 🗺️ Cómo encaja todo

```
 Tu Mac                 GitHub                                   Render (internet)           MongoDB Atlas
 ──────                 ──────                                   ─────────────────           ─────────────
 git push ──────▶  repositorio ──▶ GitHub Actions
                                    1. npm ci + npm run build
                                    2. ¿todo bien? ── sí ──▶ Deploy Hook ──▶ descarga el código,
                                                   └─ no ──▶ (se para)        compila y arranca ──▶ guarda y lee
                                                                              https://….onrender.com   los productos
```

**Qué NO cambia:** en tu Mac todo sigue funcionando igual, con tu MongoDB local y `http://localhost:3000`. El backend usa Atlas solo cuando existe la variable `MONGODB_URI`, y eso solo pasa en Render.

---

## ⚠️ Antes de empezar: lo que hay que saber

| Tema | Qué significa |
|---|---|
| **Sin login** | Cualquiera con el enlace podrá **añadir productos** desde la página de administración. |
| **Render gratuito se duerme** | Tras **15 minutos** sin visitas se apaga. La siguiente visita tarda unos **50 segundos** en cargar. Es normal. |
| **La base de datos empieza vacía** | Los productos de tu MongoDB local **no** se copian a Atlas. |
| **Secretos** | La contraseña de Atlas y el Deploy Hook **nunca** se escriben en el código ni en el chat. Solo van en Render y en los *Secrets* de GitHub. |

---

## Paso 0 — Dar permiso al token para subir workflows

GitHub **no deja** subir archivos de `.github/workflows/` con un token que no tenga el permiso **Workflows**. El token actual solo tiene "Contents".

1. GitHub → tu foto de perfil → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**.
2. Abre el token **`actividad01`** y pulsa **Edit**.
3. En **Permissions → Repository permissions**, busca **Workflows** y ponlo en **Read and write**.
4. Pulsa **Update** al final de la página.
5. **Avisa a Claude** para que haga el commit y el `git push`.

✅ **Comprobación:** en GitHub, pestaña **Actions**, aparecerá el workflow **"Comprobar y desplegar en Render"**:
- El trabajo **"Instalar y compilar el backend"** saldrá en verde ✅.
- El trabajo **"Avisar a Render"** también saldrá en verde, con un aviso amarillo: *"Todavía no existe el secret…"*. Es lo esperado, porque Render aún no existe.

---

## Paso 1 — Crear la base de datos en MongoDB Atlas (gratis)

### 1.1 Crear la cuenta
1. Entra en **https://www.mongodb.com/cloud/atlas/register**.
2. Regístrate con tu correo o con tu cuenta de Google.
3. Si te hace preguntas de bienvenida (para qué lo usarás, lenguaje…), responde lo que quieras; por ejemplo, "Learning" y "JavaScript".

### 1.2 Crear el cluster gratuito
Un **cluster** es el servidor de MongoDB en la nube: tu almacén.
1. Pulsa **Create** (o **Build a Database**).
2. Elige el plan **M0 — Free**.
3. **Provider:** AWS. **Region:** **Frankfurt (eu-central-1)**, cerca de España y de la región de Render que usaremos.
4. **Name:** `Cluster0` (o el que quieras).
5. Pulsa **Create Deployment**.

### 1.3 Crear el usuario de la base de datos
Atlas te pedirá crear un usuario. **Es distinto** de tu cuenta de Atlas: es la "llave del almacén" que usará el backend.
1. **Username:** por ejemplo `tienda`.
2. **Password:** pulsa **Autogenerate Secure Password** y **cópiala** en un lugar seguro.
   - ⚠️ Usa una contraseña **solo con letras y números**. Símbolos como `@`, `:`, `/` o `#` rompen la dirección de conexión.
3. Pulsa **Create Database User**.

### 1.4 Permitir que Render se conecte
Render gratuito no tiene una dirección fija, así que hay que dejar entrar **desde cualquier sitio**. La protección es la contraseña del paso anterior.
1. Menú izquierdo → **Network Access** (o **Security → Network Access**).
2. **Add IP Address** → **Allow Access from Anywhere**. Rellenará `0.0.0.0/0`.
3. **Confirm**.

### 1.5 Copiar la dirección de conexión
1. Menú izquierdo → **Clusters** (o **Database**) → botón **Connect** de tu cluster.
2. Elige **Drivers**.
3. Copia la dirección que aparece. Tiene esta forma:
   ```
   mongodb+srv://tienda:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. **Modifícala así:**
   - Cambia `<db_password>` por tu contraseña, **sin** los símbolos `< >`.
   - Escribe **`actividad01`** justo **después de `.net/`** y **antes de `?`**. Es el nombre de la base de datos.

   Resultado (ejemplo):
   ```
   mongodb+srv://tienda:Abc123xyz@cluster0.abcde.mongodb.net/actividad01?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Guárdala. Es tu **`MONGODB_URI`** y la necesitarás en el paso 2. ⚠️ **Es secreta:** no la pegues en el chat ni en el código.

---

## Paso 2 — Crear el servicio en Render

1. Entra en **https://dashboard.render.com** con vuestra cuenta.
2. Pulsa **+ New** → **Web Service**.
3. **Conectar GitHub:** elige **GitHub** y autoriza a Render. Si te pregunta a qué repositorios puede acceder, selecciona **`DEL_RUEBA_CIFO`**.
4. Selecciona el repositorio **`arguellopaola1-design/DEL_RUEBA_CIFO`**.
5. Rellena la configuración **exactamente así**:

| Campo | Valor | Por qué |
|---|---|---|
| **Name** | `catalogo-tecnologia` (o el que quieras) | Será tu dirección: `https://catalogo-tecnologia.onrender.com` (si el nombre está libre) |
| **Language** | `Node` | Nuestro backend es Node.js |
| **Branch** | `main` | La rama que subimos con `git push` |
| **Region** | `Frankfurt (EU Central)` | Cerca de Atlas y de España |
| **Root Directory** | `backend` | El backend está en esa carpeta. **Importante:** sin esto, Render no encuentra `package.json` |
| **Build Command** | `npm ci && npm run build` | Instala las librerías y compila (lo mismo que comprueba GitHub Actions) |
| **Start Command** | `npm run start:prod` | Arranca el servidor ya compilado (`node dist/main`) |
| **Instance Type** | **Free** | El plan gratuito |

6. En **Environment Variables**, pulsa **Add Environment Variable**:
   - **Key:** `MONGODB_URI`
   - **Value:** la dirección del paso 1.5.
7. Pulsa **Deploy Web Service**.

✅ **Comprobación:** Render abrirá la pantalla de **Logs**. Tarda unos minutos. Espera a ver estas dos líneas:
```
Nest application successfully started
==> Your service is live 🎉
```
Arriba aparecerá tu dirección, `https://….onrender.com`. Ábrela y verás la **página de administración**, vacía. Prueba también **`/tienda.html`**.

> 💡 **No hace falta configurar el puerto.** Render le dice al backend qué puerto usar con la variable `PORT`, y nuestro `main.ts` ya la lee: `process.env.PORT ?? 3000`.

---

## Paso 3 — Que despliegue GitHub Actions, no Render por su cuenta

Render, por defecto, despliega solo en cuanto ve un cambio en GitHub. Queremos que **antes** pase el control de calidad de GitHub Actions. Así que apagamos el despliegue automático de Render:

1. En Render, dentro de tu servicio → **Settings** → sección **Build & Deploy**.
2. **Auto-Deploy** → cámbialo a **Off** → **Save**.

---

## Paso 4 — Conectar GitHub Actions con Render (Deploy Hook)

Un **Deploy Hook** es una **URL secreta**. Cuando alguien la "llama", Render despliega. GitHub Actions la llamará solo si la compilación ha ido bien.

### 4.1 Copiar el Deploy Hook de Render
1. En Render → tu servicio → **Settings** → sección **Deploy Hook**.
2. **Copia** la URL. Empieza por `https://api.render.com/deploy/srv-…`.
   - ⚠️ **Es secreta:** con ella, cualquiera podría lanzar despliegues.

### 4.2 Guardarla como *Secret* en GitHub
1. En GitHub, abre el repositorio → **Settings**, la pestaña del repositorio, no la de tu perfil.
2. Menú izquierdo → **Secrets and variables** → **Actions**.
3. **New repository secret**:
   - **Name:** `RENDER_DEPLOY_HOOK_URL`, exactamente así.
   - **Secret:** la URL del paso 4.1.
4. **Add secret**.

---

## Paso 5 — Probar el circuito completo

1. Pide a Claude un **cambio pequeño** (por ejemplo, en el README) con **commit y push**.
2. En GitHub → pestaña **Actions** → abre la ejecución más reciente:
   - ✅ **Instalar y compilar el backend**
   - ✅ **Avisar a Render para que despliegue**, con el mensaje *"Render ha recibido el aviso…"*
3. En Render → tu servicio → **Events**: aparecerá un despliegue nuevo, **lanzado por el Deploy Hook**.
4. Cuando termine, abre tu dirección `https://….onrender.com`:
   - Da de alta un producto en la **administración**.
   - Mira la **tienda** (`/tienda.html`): aparece en una tarjeta.
   - En **Atlas** → tu cluster → **Browse Collections** → `actividad01` → `products`: **ahí está guardado**.

🎉 **Si todo esto funciona, la tienda está abierta al público.**

---

## 🩺 Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| El `git push` falla con *"refusing to allow a Personal Access Token to create or update workflow"* | Al token le falta el permiso **Workflows** | Paso 0 |
| En los Logs de Render: `MongoServerSelectionError` o `ECONNREFUSED 127.0.0.1:27017` | Falta `MONGODB_URI` o Atlas no deja entrar | Revisa la variable (paso 2.6) y **Network Access** (paso 1.4) |
| En los Logs de Render: `bad auth : authentication failed` | Usuario o contraseña incorrectos en la URI | Revisa el paso 1.5 (sin `< >` y sin símbolos raros) |
| Render: `Could not read package.json` | Falta el **Root Directory** | Pon `backend` (paso 2) |
| La web tarda unos 50 s en abrir | Plan gratuito dormido | Normal. Espera y recarga |
| Actions en verde pero Render no despliega | Falta el secret o tiene otro nombre | Paso 4.2: nombre exacto `RENDER_DEPLOY_HOOK_URL` |
| Render despliega aunque Actions falle | Auto-Deploy sigue activado | Paso 3 |

---

## 📁 Archivos que intervienen en el despliegue

| Archivo | Papel |
|---|---|
| `.github/workflows/deploy.yml` | El "robot" de GitHub Actions: compila y, si va bien, llama al Deploy Hook |
| `backend/package.json` | `engines.node: 22.x` (versión de Node para Render) y los comandos `build` y `start:prod` |
| `backend/src/app.module.ts` | Lee `MONGODB_URI` (Atlas en Render; si no existe, MongoDB local) |
| `backend/src/main.ts` | Lee `PORT` (Render lo indica; en local, 3000) |
