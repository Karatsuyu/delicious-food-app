import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1>Test App - Si ves esto, React está funcionando</h1>
      <p>Fecha: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default TestApp;