# Guía de Configuración para Nuevos Desarrolladores

## 🚀 Configuración Inicial del Entorno de Desarrollo

Sigue estos pasos después de hacer `git pull` para tener todas las funcionalidades del proyecto:

### 1. Configurar el Backend

```bash
# Navegar al directorio del backend
cd backend

# Crear y activar entorno virtual (opcional pero recomendado)
python -m venv venv
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones (crear la base de datos)
python manage.py migrate

# Configurar datos de desarrollo
python manage.py shell < setup_dev_environment.py
```

### 2. Configurar el Frontend

```bash
# Navegar al directorio del frontend (nueva terminal)
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```env
# Stripe (TEST) - Para pagos de prueba
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_de_stripe_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_de_stripe_aqui
FRONTEND_URL=http://localhost:5174

# (Opcional) Llave personalizada de Django
# DJANGO_SECRET_KEY=tu-clave-secreta-aqui
```

**⚠️ IMPORTANTE:** Reemplaza `tu_clave_secreta_de_stripe_aqui` y `tu_webhook_secret_de_stripe_aqui` con las claves reales de tu cuenta de Stripe (modo TEST). Puedes obtenerlas en tu [Dashboard de Stripe](https://dashboard.stripe.com/test/apikeys).

### 4. Iniciar los Servidores

```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 👥 Usuarios de Prueba Creados

Después de ejecutar el script `setup_dev_environment.py`, tendrás estos usuarios disponibles:

### 👨‍💼 Administrador
- **Email**: admin@deliciousfood.com
- **Password**: admin123
- **Rol**: Administrador del sistema

### 👨‍🍳 Chef Creativo
- **Email**: chef@example.com  
- **Password**: chef123
- **Características**:
  - ✅ Productos personalizados creados y publicados
  - ✅ Combos personalizados de la comunidad
  - ✅ 150 puntos acumulados
  - ✅ Productos vendidos a otros usuarios

### 🛒 Comprador Activo
- **Email**: comprador@example.com
- **Password**: comprador123
- **Características**:
  - ✅ Historial de compras completo
  - ✅ Reseñas dejadas en productos
  - ✅ 75 puntos acumulados
  - ✅ Puede dejar reseñas y editar perfil

## 🎯 Funcionalidades Disponibles

Con esta configuración tendrás acceso a todas las funcionalidades:

### ✅ Perfil de Usuario
- Editar información personal
- Ver historial de compras
- Gestionar productos personalizados
- Gestionar combos publicados
- Sistema de puntos funcionando

### ✅ Productos Personalizados
- Crear productos personalizados
- Publicar en la comunidad
- Comprar productos de otros usuarios
- Sistema de pagos con Stripe

### ✅ Combos de la Comunidad
- Crear combos personalizados
- Publicar combos para que otros compren
- Explorar combos de otros usuarios
- Comprar combos publicados

### ✅ Sistema de Reseñas
- Dejar reseñas en productos comprados
- Ver reseñas de otros usuarios
- Calificación por estrellas

### ✅ Sistema de Puntos
- Ganar puntos al vender productos/combos
- Usar puntos como descuentos
- Ver historial de puntos ganados/usados

## 🔧 Comandos Útiles

### Reiniciar Base de Datos (si algo sale mal)
```bash
cd backend
rm db.sqlite3  # Eliminar base de datos actual
python manage.py migrate  # Crear nueva base de datos
python manage.py shell < setup_dev_environment.py  # Reconfigurar datos
```

### Crear Superusuario Personalizado
```bash
cd backend
python manage.py createsuperuser
```

### Ver Logs del Backend
```bash
cd backend
python manage.py runserver --verbosity=2
```

## ❗ Problemas Comunes

### "No se ven las funcionalidades en el perfil"
**Causa**: No ejecutaste el script de configuración de datos de desarrollo.
**Solución**: Ejecuta `python manage.py shell < setup_dev_environment.py`

### "Error de base de datos al hacer migraciones"
**Causa**: Conflictos en las migraciones.
**Solución**: Elimina `db.sqlite3` y vuelve a ejecutar las migraciones.

### "No funcionan los pagos con Stripe"
**Causa**: Falta el archivo `.env` o las variables de entorno.
**Solución**: Crea el archivo `.env` con las variables de Stripe.

### "El frontend no se conecta con el backend"
**Causa**: Los servidores no están ejecutándose en los puertos correctos.
**Solución**: Backend en puerto 8000, Frontend en puerto 5174.

## 📞 Soporte

Si tienes problemas con la configuración, verifica:

1. ✅ Que ejecutaste todos los comandos en orden
2. ✅ Que tienes las dependencias instaladas
3. ✅ Que los servidores están ejecutándose  
4. ✅ Que el archivo `.env` existe y tiene las variables correctas
5. ✅ Que ejecutaste el script `setup_dev_environment.py`

¡Con esta configuración deberías tener exactamente las mismas funcionalidades que ves en tu entorno de desarrollo! 🚀