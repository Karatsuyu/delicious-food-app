#!/bin/bash

# Quick Setup Script para Mac/Linux
# Configura automáticamente el entorno de desarrollo

echo "🚀 Configurando entorno de desarrollo para Delicious Food App..."

# Verificar si estamos en el directorio correcto
if [[ ! -d "backend" ]] || [[ ! -d "frontend" ]]; then
    echo "❌ Error: Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

# Configurar Backend
echo "📦 Configurando Backend..."

cd backend

# Crear entorno virtual si no existe
if [[ ! -d "venv" ]]; then
    echo "🐍 Creando entorno virtual de Python..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "📚 Instalando dependencias de Python..."
pip install -r requirements.txt

# Crear archivo .env si no existe
if [[ ! -f ".env" ]]; then
    echo "🔐 Creando archivo .env..."
    cat > .env << 'EOF'
# Stripe (TEST) - Para pagos de prueba
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_de_stripe_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_de_stripe_aqui
FRONTEND_URL=http://localhost:5174

# (Opcional) Llave personalizada de Django
# DJANGO_SECRET_KEY=tu-clave-secreta-aqui
EOF
    echo "⚠️  IMPORTANTE: Edita el archivo .env y reemplaza los placeholders con tus claves reales de Stripe"
fi

# Aplicar migraciones
echo "🗄️ Aplicando migraciones de base de datos..."
python manage.py migrate

# Configurar datos de desarrollo
echo "👥 Configurando usuarios y datos de prueba..."
python manage.py shell < setup_dev_environment.py

# Volver al directorio raíz
cd ..

# Configurar Frontend
echo "🎨 Configurando Frontend..."

cd frontend

# Instalar dependencias
echo "📦 Instalando dependencias de Node.js..."
npm install

# Volver al directorio raíz
cd ..

echo "✅ ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita backend/.env con tus claves reales de Stripe (modo TEST)"
echo "2. Inicia el backend: cd backend && python manage.py runserver"
echo "3. Inicia el frontend: cd frontend && npm run dev"
echo ""
echo "👥 Usuarios de prueba creados:"
echo "   Admin: admin@deliciousfood.com / admin123"
echo "   Chef: chef@example.com / chef123"
echo "   Comprador: comprador@example.com / comprador123"
echo ""
echo "🌐 URLs del proyecto:"
echo "   Backend: http://localhost:8000"
echo "   Frontend: http://localhost:5174"