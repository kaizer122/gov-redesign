import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// The DS plugin loads Roboto 300–900, Inter 200/600–800 and Alexandria 200/600–800.
// Self-host only the weights it does not provide.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/alexandria/400.css'
import '@fontsource/alexandria/500.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
