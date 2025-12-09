# 🚀 Scripts de Desarrollo

## Cambiar entre local y producción

### Para desarrollo local:
```bash
# En frontend/.env cambiar:
VITE_BACKEND_URL=http://127.0.0.1:8000
```

### Para producción:
```bash
# En frontend/.env cambiar:
VITE_BACKEND_URL=https://delicious-food-app.onrender.com
```

## Comandos útiles

### Desarrollo:
```bash
# Backend
cd backend && python manage.py runserver

# Frontend (nueva terminal)
cd frontend && npm run dev
```

### Deploy:
```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

### Ver logs de producción:
- **Backend**: https://dashboard.render.com (Logs tab)
- **Frontend**: https://app.netlify.com (Functions tab)