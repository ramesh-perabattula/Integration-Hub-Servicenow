import React from 'react';
import ReactDOM from 'react-dom/client';
import ZoomIntegrationForm from './ZoomIntegrationForm.jsx';
import FloatingAssistant from './FloatingAssistant.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ZoomIntegrationForm />
    <FloatingAssistant />
  </React.StrictMode>
);