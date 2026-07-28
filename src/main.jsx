import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import { CurrencyProvider } from './context/CurrencyContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CurrencyProvider>
        <CartProvider>
          <App />
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 3000,
              className: 'pointer-events-none sm:pointer-events-auto'
            }} 
          />
        </CartProvider>
      </CurrencyProvider>
    </BrowserRouter>
  </StrictMode>,
)

