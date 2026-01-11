import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Gestionnaire d'erreurs CORS pour filtrer les erreurs d'extensions de navigateur
import './utils/corsErrorHandler'

createRoot(document.getElementById("root")!).render(<App />);
