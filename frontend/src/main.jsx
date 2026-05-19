import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext.jsx'
import CartProvider from './context/CartContext.jsx'
import ShopContextProvider from './context/ShopContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>,
)
