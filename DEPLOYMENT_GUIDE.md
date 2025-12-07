# 🚀 Guía de Despliegue - Delicious Food App

Esta guía te llevará paso a paso para desplegar tu aplicación completa.

## 📋 Prerrequisitos

- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Render](https://render.com)
- Cuenta en [Netlify](https://netlify.com)
- Cuenta en [Stripe](https://stripe.com) (modo test)

## 1. 🗄️ Configurar Base de Datos en Supabase

### Paso 1: Crear Proyecto
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Clic en "New Project"
3. Elige una organización
4. Nombra tu proyecto: `delicious-food-db`
5. Crea una contraseña segura para la base de datos
6. Selecciona una región cercana
7. Clic en "Create new project"

### Paso 2: Obtener Credenciales
1. Ve a Settings > Database
2. Copia la "Connection String" (formato: `postgresql://...`)
3. Guarda esta URL, la necesitarás para Render

### Paso 3: Configurar Tablas
Las tablas se crearán automáticamente cuando Django ejecute las migraciones en Render.

## 2. 🚀 Desplegar Backend en Render

### Paso 1: Preparar Repositorio
1. Asegúrate de que todos los cambios estén en GitHub:
```bash
git add .
git commit -m "Preparar para despliegue"
git push origin main
```

### Paso 2: Crear Web Service en Render
1. Ve a [render.com](https://render.com) y crea una cuenta
2. Clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona tu repositorio `delicious-food-app`
5. Configuración:
   - **Name**: `delicious-food-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn restaurant_api.wsgi:application`

### Paso 3: Variables de Entorno en Render
En la sección "Environment Variables", añade:

```
DEBUG=False
SECRET_KEY=tu-secret-key-super-seguro-aqui-generar-nuevo
DATABASE_URL=postgresql://... (la URL de Supabase)
STRIPE_SECRET_KEY=sk_test_tu_stripe_secret_key
FRONTEND_URL=https://tu-app.netlify.app
ALLOWED_HOST=tu-app.onrender.com
DJANGO_SETTINGS_MODULE=restaurant_api.production_settings
```

### Paso 4: Deploy
1. Clic en "Create Web Service"
2. Render clonará tu repo y ejecutará el build
3. Espera a que termine (puede tardar 5-10 minutos)
4. Anota la URL que te asigna Render (ej: `https://delicious-food-backend.onrender.com`)

## 3. 🌐 Desplegar Frontend en Netlify

### Paso 1: Configurar Variables de Entorno Locales
Crea un archivo `.env.production` en `frontend/`:
```env
VITE_BACKEND_URL=https://tu-app.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_publishable_key
```

### Paso 2: Actualizar CORS en Backend
1. Ve a Render Dashboard → tu servicio backend
2. En Environment Variables, actualiza:
```
FRONTEND_URL=https://tu-app.netlify.app
```
3. Redeploy el backend

### Paso 3: Deploy en Netlify
1. Ve a [netlify.com](https://netlify.com) y crea una cuenta
2. Clic en "Add new site" → "Import an existing project"
3. Conecta GitHub y selecciona tu repositorio
4. Configuración:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### Paso 4: Variables de Entorno en Netlify
1. Ve a Site settings → Environment variables
2. Añade:
```
VITE_BACKEND_URL=https://tu-app.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_publishable_key
```

### Paso 5: Deploy
1. Clic en "Deploy site"
2. Netlify construirá y desplegará tu frontend
3. Anota la URL asignada (ej: `https://amazing-name.netlify.app`)

## 4. ⚙️ Configuración Final

### Paso 1: Actualizar CORS en Backend
1. Ve a Render → Variables de entorno
2. Actualiza `FRONTEND_URL` con tu URL real de Netlify
3. Redeploy

### Paso 2: Configurar Webhooks de Stripe (Opcional)
1. Ve a Stripe Dashboard → Developers → Webhooks
2. Clic en "Add endpoint"
3. URL: `https://tu-app.onrender.com/api/payments/stripe/webhook/`
4. Selecciona eventos: `payment_intent.succeeded`, `checkout.session.completed`

### Paso 3: Pruebas
1. Visita tu frontend en Netlify
2. Crea una cuenta
3. Prueba el flujo completo de compra
4. Verifica que los puntos se asignen correctamente

## 🔧 Comandos Útiles

### Restart Backend en Render:
1. Ve a tu dashboard de Render
2. Clic en "Manual Deploy" → "Deploy latest commit"

### Ver logs en Render:
1. Dashboard → tu servicio → pestaña "Logs"

### Rebuild frontend en Netlify:
1. Dashboard → tu sitio → "Site deploys" → "Trigger deploy"

## 🚨 Solución de Problemas Comunes

### Backend no conecta con la base de datos:
- Verifica que DATABASE_URL esté correcto
- Asegúrate de que Supabase permite conexiones externas

### Frontend no puede comunicarse con backend:
- Verifica CORS en settings de Django
- Confirma que VITE_BACKEND_URL esté correcto

### Errores de Stripe:
- Verifica que las claves de Stripe sean correctas
- Asegúrate de usar claves de test para desarrollo

## 📱 URLs Finales

Cuando termines, tendrás:
- **Frontend**: `https://tu-app.netlify.app`
- **Backend**: `https://tu-app.onrender.com`
- **Base de datos**: Supabase (administrada automáticamente)

¡Tu aplicación estará lista para usar! 🎉