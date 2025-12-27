#!/usr/bin/env pwsh

# Quick Setup Script para Windows (PowerShell)
# Configura automáticamente el entorno de desarrollo

Write-Host "🚀 Configurando entorno de desarrollo para Delicious Food App..." -ForegroundColor Green

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: Ejecuta este script desde el directorio raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Configurar Backend
Write-Host "📦 Configurando Backend..." -ForegroundColor Yellow

Set-Location backend

# Crear entorno virtual si no existe
if (-not (Test-Path "venv")) {
    Write-Host "🐍 Creando entorno virtual de Python..." -ForegroundColor Blue
    python -m venv venv
}

# Activar entorno virtual
Write-Host "🔧 Activando entorno virtual..." -ForegroundColor Blue
& .\venv\Scripts\Activate.ps1

# Instalar dependencias
Write-Host "📚 Instalando dependencias de Python..." -ForegroundColor Blue
pip install -r requirements.txt

# Crear archivo .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "🔐 Creando archivo .env..." -ForegroundColor Blue
    @"
# Stripe (TEST) - Para pagos de prueba
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_de_stripe_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_de_stripe_aqui
FRONTEND_URL=http://localhost:5174

# (Opcional) Llave personalizada de Django
# DJANGO_SECRET_KEY=tu-clave-secreta-aqui
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "⚠️  IMPORTANTE: Edita el archivo .env y reemplaza los placeholders con tus claves reales de Stripe" -ForegroundColor Red
}

# Aplicar migraciones
Write-Host "🗄️ Aplicando migraciones de base de datos..." -ForegroundColor Blue
python manage.py migrate

# Configurar datos de desarrollo
Write-Host "👥 Configurando usuarios y datos de prueba..." -ForegroundColor Blue
python manage.py shell < setup_dev_environment.py

# Volver al directorio raíz
Set-Location ..

# Configurar Frontend
Write-Host "🎨 Configurando Frontend..." -ForegroundColor Yellow

Set-Location frontend

# Instalar dependencias
Write-Host "📦 Instalando dependencias de Node.js..." -ForegroundColor Blue
npm install

# Volver al directorio raíz
Set-Location ..

Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Edita backend/.env con tus claves reales de Stripe (modo TEST)" -ForegroundColor White
Write-Host "2. Inicia el backend: cd backend && python manage.py runserver" -ForegroundColor White  
Write-Host "3. Inicia el frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "👥 Usuarios de prueba creados:" -ForegroundColor Cyan
Write-Host "   Admin: admin@deliciousfood.com / admin123" -ForegroundColor White
Write-Host "   Chef: chef@example.com / chef123" -ForegroundColor White
Write-Host "   Comprador: comprador@example.com / comprador123" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs del proyecto:" -ForegroundColor Cyan
Write-Host "   Backend: http://localhost:8000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5174" -ForegroundColor White