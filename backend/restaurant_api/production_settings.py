import os
import dj_database_url
from decouple import config
from .settings import *

# Configuración de producción
DEBUG = False

# Hosts permitidos
ALLOWED_HOSTS = [
    'localhost', 
    '127.0.0.1',
    '.onrender.com',  # Para Render
    config('ALLOWED_HOST', default='')  # Tu dominio personalizado si tienes uno
]

# Secret Key desde variable de entorno
SECRET_KEY = config('SECRET_KEY', default='django-insecure-6y5%)9^%p5cae!$old!9u@za2=_!gc&v@p!z0ccddoh79w4way')

# Base de datos PostgreSQL (Supabase)
DATABASES = {
    'default': dj_database_url.parse(config('DATABASE_URL'))
}

# Configuración de archivos estáticos para Render
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Whitenoise para servir archivos estáticos
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Añadir WhiteNoise
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS para producción
CORS_ALLOWED_ORIGINS = [
    config('FRONTEND_URL', default='http://localhost:5173'),
    "https://tu-app.netlify.app",  # Reemplazar con tu URL de Netlify
]

# Configuración de Stripe
STRIPE_SECRET_KEY = config('STRIPE_SECRET_KEY')
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:5174')

# Configuración de seguridad para producción
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True