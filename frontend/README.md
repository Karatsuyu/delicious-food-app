

# delicious-food-app — Frontend (React + Vite)

Este repositorio contiene la aplicación frontend (React + Vite) del proyecto "delicious-food-app".  
Este README está organizado de forma paralela al README del backend para facilitar la puesta en marcha y la integración.

## Contenido
- Descripción
- Requisitos
- Instalación (desarrollo)
- Variables de entorno
- Scripts útiles
- Estructura relevante del proyecto
- Uso de assets (imágenes)
- Conectar con el backend
- Pruebas
- Despliegue
- Contribuir
- Licencia

## Descripción
Frontend en React + Vite que permite personalizar y pedir productos (hamburguesas, pizzas, pollo, perros, postres). Consume la API del backend para productos, carrito y órdenes.

## Requisitos
- Node.js 18+ (recomendado)
- npm o yarn
- Backend corriendo o acceso a la URL pública de la API

## Instalación (desarrollo)
En una terminal (Windows PowerShell/CMD) dentro de la carpeta `frontend`:

1. Instalar dependencias:
   - npm:
     npm install
   - yarn:
     yarn

2. Crear archivo de variables de entorno (ejemplo):
   - Crea `.env` en `frontend/` con:
     VITE_API_URL=http://localhost:8000/api

3. Ejecutar aplicación en modo desarrollo:
   - npm:
     npm run dev
   - yarn:
     yarn dev

La app abrirá en http://localhost:5173 (u otro puerto asignado por Vite).

## Variables de entorno
- VITE_API_URL — URL base del backend (ej: http://localhost:8000/api).  
Asegúrate de usar el prefijo VITE_ para que Vite exponga la variable al frontend.

Ejemplo de `.env`:
VITE_API_URL=http://localhost:8000/api

## Scripts útiles
- npm run dev — iniciar servidor de desarrollo (HMR)
- npm run build — generar build de producción (dist)
- npm run preview — previsualizar build localmente
- npm test — ejecutar tests (si existen)
- npm run lint — correr linters (si están configurados)

(Usar yarn equivalentes reemplazando `npm run` por `yarn`.)

## Estructura relevante
- src/
  - assets/ — imágenes (ingredientes, panes, etc.)
  - api/ — clientes de API (conexión al backend)
  - components/ — componentes reutilizables
  - pages/ — páginas (Personalizador, Home, AdminDashboard, etc.)
  - context/ — contextos React (carrito, usuario)
  - styles/ — estilos globales / css
- public/ — archivos estáticos

## Uso de assets (imágenes)
- Coloca imágenes en `src/assets/` y usa imports relativos en componentes:
  import nombreImg from '../assets/nombre-de-imagen.png'
- Normaliza nombres (sin espacios preferible, ejemplo: `carne-de-bisonte.png`) o importa con el nombre real que tengas en la carpeta.
- Para los ingredientes del personalizador se utiliza un mapeo en `Personalizador.jsx` — actualiza ese map si agregas más imágenes.

## Conectar con el backend
- Asegúrate de que el backend esté corriendo y que `VITE_API_URL` apunte a la ruta correcta.
- Si el backend corre en otra máquina, usa `http://IP:PUERTO/api` y ajusta CORS en el backend.

## Pruebas
- Si existen tests: npm test
- Para agregar pruebas unitarias, usar Jest + React Testing Library (sugerido).

## Despliegue
- Generar build:
  npm run build
- Subir la carpeta `dist/` al servicio de hosting (Netlify, Vercel, Surge, S3 + CloudFront, etc.).  
- Asegurar que `VITE_API_URL` en producción apunte al backend desplegado.

## Crear administrador / Dashboard (notas)
- Existe una página `AdminDashboard` en `src/pages/AdminDashboard.jsx` (si la añadiste).
- Para persistir creación/edición de productos integra los endpoints del backend (POST/PUT/DELETE) y autenticación (token/usuario admin).
- Para mostrar "producto más vendido" el backend debería exponer estadísticas; el frontend consume esa ruta.

## Contribuir
1. Hacer fork y branch con descripción clara.
2. Abrir PR con cambios y pruebas.
3. Mantener estilo de código y pasar linters.

## Recursos útiles
- Backend README: revisar `../backend/README.md` para detalles de API, endpoints y autenticación.
- Documentación Vite: https://vitejs.dev
- React: https://reactjs.org

## Contacto
Para dudas sobre este frontend, abrir issue en el repositorio o contactar al mantenedor del proyecto.

## Licencia
Especificar la licencia del proyecto (ej: MIT) o añadir archivo LICENSE en la raíz.

