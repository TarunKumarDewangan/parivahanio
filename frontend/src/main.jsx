import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthProvider } from './context/AuthContext.jsx';
import axios from 'axios'; // ✅ 1. Import axios here

// ✅ 2. Configure axios defaults globally before the app starts
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
