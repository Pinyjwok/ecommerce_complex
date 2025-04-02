import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

console.log('Main entry point loaded');

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
