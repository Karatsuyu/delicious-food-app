import React  from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import TestApp from './TestApp.jsx';
import './index.css';

// Componente con manejo de errores
function AppWithErrorBoundary() {
  try {
    return <App />;
  } catch (error) {
    console.error('Error en App:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error en la aplicación:</h1>
        <pre>{error.toString()}</pre>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithErrorBoundary />
  </React.StrictMode>,
)
