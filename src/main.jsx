import "@fontsource/jost"; // Defaults to weight 400
import "@fontsource/jost/700.css"; // Optional: Import bold weight
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
