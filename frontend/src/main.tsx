import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { AuthProvider } from './provider/authProvider';



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
  </React.StrictMode>,
);
