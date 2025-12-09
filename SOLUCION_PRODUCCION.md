# 🚨 SOLUCIÓN DE PROBLEMAS EN PRODUCCIÓN

## Problemas Identificados:
1. ❌ Error 500 del backend Django
2. ❌ Problemas de CORS entre Netlify y Render
3. ❌ Variables de entorno no configuradas
4. ❌ Base de datos no configurada correctamente
5. ❌ Archivos estáticos no servidos correctamente

## ✅ PASOS PARA SOLUCIONARLO:

### 1. CONFIGURAR VARIABLES DE ENTORNO EN RENDER

Ve a tu panel de Render (https://dashboard.render.com) y configura estas variables:

```bash
# Variables de entorno para Render (Backend)
DEBUG=False
SECRET_KEY=tu-secret-key-super-seguro-generado-por-django
FRONTEND_URL=https://delicious-food-app-beta.netlify.app
STRIPE_SECRET_KEY=sk_test_tu_stripe_secret_key_real
DATABASE_URL=postgresql://... # (Render lo genera automáticamente)
```

### 2. CONFIGURAR VARIABLES DE ENTORNO EN NETLIFY

Ve a tu panel de Netlify > Site settings > Environment variables:

```bash
# Variables de entorno para Netlify (Frontend)
VITE_BACKEND_URL=https://delicious-food-app.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_publishable_key_real
```

### 3. ACTUALIZAR CONFIGURACIÓN DE BASE DE DATOS EN RENDER

1. Ve a tu servicio en Render
2. Conecta una base de datos PostgreSQL
3. Copia la DATABASE_URL generada automáticamente
4. Pégala en las variables de entorno

### 4. REDEPLOY BACKEND

1. Push de los cambios actuales a GitHub
2. Render automáticamente hará redeploy
3. Verifica los logs en Render Dashboard

### 5. REDEPLOY FRONTEND

1. Ve a Netlify Dashboard
2. Site settings > Build & deploy
3. Trigger deploy

### 6. VERIFICAR FUNCIONAMIENTO

Prueba estos endpoints para verificar:

```bash
# Verificar que el backend esté funcionando
https://delicious-food-app.onrender.com/api/products/

# Verificar login
https://delicious-food-app.onrender.com/api/token/

# Verificar CORS desde el frontend
https://delicious-food-app-beta.netlify.app
```

## 🔧 COMANDOS DE DIAGNÓSTICO

Si los errores persisten, usa estos comandos en Render logs:

```bash
# Ver migraciones
python manage.py showmigrations

# Crear superusuario
python manage.py createsuperuser

# Verificar configuración
python manage.py check --deploy

# Collect static files
python manage.py collectstatic --no-input
```

## 📞 ERRORES COMUNES Y SOLUCIONES

### Error 500: Internal Server Error
- ✅ Verifica variables de entorno
- ✅ Verifica configuración de base de datos
- ✅ Revisa logs de Render

### Error CORS
- ✅ Verifica que CORS_ALLOWED_ORIGINS incluya tu dominio de Netlify
- ✅ Asegúrate de que CORS_ALLOW_CREDENTIALS = True

### Error Stripe
- ✅ Los errores de Stripe son normales (bloqueados por adblockers)
- ✅ No afectan el login/funcionamiento principal
- ✅ Se solucionarán cuando implementes pagos reales

## 🎯 SIGUIENTE PASO INMEDIATO

1. **Configura las variables de entorno en Render y Netlify**
2. **Haz redeploy de ambos servicios**
3. **Verifica que el login funcione**

¿Necesitas ayuda con algún paso específico?