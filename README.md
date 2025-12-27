# 🍕 Delicious Food App

Una aplicación completa de restaurante con funcionalidades de personalización de productos, combos de la comunidad, sistema de puntos y reseñas.

## ✨ Características Principales

- 🍔 **Productos Personalizados**: Los usuarios pueden personalizar productos y publicarlos para la comunidad
- 🎯 **Combos de la Comunidad**: Crea y comparte combos personalizados
- ⭐ **Sistema de Reseñas**: Deja reseñas en productos comprados
- 🏆 **Sistema de Puntos**: Gana puntos vendiendo productos y úsalos como descuentos
- 📱 **Interfaz Moderna**: Frontend desarrollado con React y diseño responsivo
- 💳 **Pagos Seguros**: Integración con Stripe para pagos
- 👤 **Gestión de Perfiles**: Edita tu información y ve tu historial de compras

## 🚀 Configuración Rápida para Desarrolladores

### Opción 1: Script Automático (Recomendado)

**Windows PowerShell:**
```powershell
.\quick_setup.ps1
```

**Mac/Linux:**
```bash
chmod +x quick_setup.sh
./quick_setup.sh
```

### Opción 2: Configuración Manual

1. **Configurar Backend:**
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py shell < setup_dev_environment.py
```

2. **Configurar Frontend:**
```bash
cd frontend
npm install
```

3. **Iniciar Servidores:**
```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend  
npm run dev
```

## 👥 Usuarios de Prueba

Después de la configuración automática tendrás estos usuarios:

| Usuario | Email | Password | Características |
|---------|--------|-----------|----------------|
| 👨‍💼 **Admin** | admin@deliciousfood.com | admin123 | Administrador del sistema |
| 👨‍🍳 **Chef Creativo** | chef@example.com | chef123 | Productos y combos publicados, 150 puntos |
| 🛒 **Comprador Activo** | comprador@example.com | comprador123 | Historial de compras, reseñas, 75 puntos |

## 🌐 URLs de la Aplicación

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 📁 Estructura del Proyecto

```
delicious-food-app/
├── backend/                 # API Django REST Framework
│   ├── products/           # Modelos de productos y combos
│   ├── users/              # Gestión de usuarios y compras
│   ├── reviews/            # Sistema de reseñas
│   ├── orders/             # Gestión de pedidos
│   ├── payments/           # Integración con Stripe
│   └── setup_dev_environment.py  # Script de datos de prueba
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   └── utils/          # Utilidades y helpers
│   └── public/            # Archivos estáticos
├── GUIA_CONFIGURACION_DESARROLLADORES.md  # Guía detallada
├── quick_setup.ps1        # Script de configuración Windows
└── quick_setup.sh         # Script de configuración Mac/Linux
```

## 🎯 Funcionalidades por Usuario

### 👨‍🍳 Chef Creativo (Creador de Contenido)
- ✅ Crear productos personalizados
- ✅ Publicar combos para la comunidad
- ✅ Ganar puntos por ventas
- ✅ Ver estadísticas de productos vendidos

### 🛒 Comprador Activo (Cliente)
- ✅ Comprar productos personalizados
- ✅ Dejar reseñas en productos
- ✅ Usar puntos como descuentos
- ✅ Ver historial de compras completo

### 👨‍💼 Admin (Administrador)
- ✅ Gestionar todos los productos
- ✅ Ver estadísticas de la plataforma
- ✅ Administrar usuarios
- ✅ Configurar precios base

## 🔧 Comandos Útiles

### Reiniciar Base de Datos
```bash
cd backend
rm db.sqlite3  # Eliminar base de datos
python manage.py migrate
python manage.py shell < setup_dev_environment.py
```

### Ejecutar Tests
```bash
cd backend
python manage.py test

cd frontend
npm test
```

### Build de Producción
```bash
cd frontend
npm run build
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Django REST Framework**: API REST
- **SQLite**: Base de datos (desarrollo)
- **Stripe**: Procesamiento de pagos
- **Pillow**: Procesamiento de imágenes

### Frontend
- **React 19**: Framework de UI
- **Vite**: Herramientas de desarrollo
- **Axios**: Cliente HTTP
- **React Router**: Enrutamiento

## 📚 Documentación Adicional

- 📖 [Guía Completa para Desarrolladores](GUIA_CONFIGURACION_DESARROLLADORES.md)
- 🚀 [Documentación del Backend](backend/README.md)
- 🎨 [Documentación del Frontend](frontend/README.md)
- 📋 [API Reference](backend/API_REFERENCE.md)

## ❗ Solución de Problemas Comunes

### "No veo las funcionalidades en el perfil"
**Causa**: No ejecutaste el script de configuración de datos.
**Solución**: Ejecuta `python manage.py shell < setup_dev_environment.py`

### "Error al conectar frontend con backend"
**Causa**: Los servidores no están ejecutándose.
**Solución**: Verifica que el backend esté en puerto 8000 y frontend en 5174.

### "Los pagos no funcionan"
**Causa**: Faltan las variables de entorno de Stripe.
**Solución**: Crea el archivo `.env` en la carpeta backend con las claves de Stripe.

## 📞 Soporte

Si encuentras problemas:

1. ✅ Revisa la [Guía de Configuración](GUIA_CONFIGURACION_DESARROLLADORES.md)
2. ✅ Verifica que ejecutaste todos los pasos de configuración
3. ✅ Asegúrate de tener las dependencias instaladas
4. ✅ Confirma que los servidores están ejecutándose en los puertos correctos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ve el archivo [LICENSE](LICENSE) para más detalles.

---

**¡Con esta configuración tendrás exactamente las mismas funcionalidades en todos los entornos de desarrollo!** 🚀