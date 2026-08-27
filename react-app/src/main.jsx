import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Automatically reload the page when a dynamic chunk import fails (usually after a new deployment)
window.addEventListener('error', (e) => {
  const isChunkError = 
    e.message && 
    (e.message.includes('Failed to fetch dynamically imported module') || 
     e.message.includes('Expected a JavaScript-or-Wasm module script') ||
     e.message.includes('MIME type'));
  
  if (isChunkError) {
    console.warn('Dynamic import chunk error detected. Reloading page to fetch latest deployment...');
    window.location.reload();
  }
}, true);

window.addEventListener('unhandledrejection', (e) => {
  const isChunkError = 
    e.reason && 
    (e.reason.name === 'ChunkLoadError' || 
     (e.reason.message && 
      (e.reason.message.includes('Failed to fetch dynamically imported module') || 
       e.reason.message.includes('Expected a JavaScript-or-Wasm module script'))));

  if (isChunkError) {
    console.warn('Unhandled rejection chunk error detected. Reloading page to fetch latest deployment...');
    window.location.reload();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


