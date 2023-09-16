import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, addToCart, removeFromCart, setCart, stock } = useCart();

  const clearCart = () => {
    setCart([]); // Limpia todos los productos del carrito.
  }

  const getAvailableStock = (productId) => {
    const productStock = stock.find(p => p.id === productId)?.stock || 0;
    const inCartQuantity = cart.find(p => p.id === productId)?.quantity || 0;
    return productStock - inCartQuantity;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-5">Tu Carrito</h1>

      {cart.length === 0 && (
        <p className="text-center">Tu carrito está vacío.</p>
      )}

      {cart.map(item => (
        <div key={item.id} className="border rounded p-4 mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img src={item.imagen} alt={item.nombre} className="img-fluid" style={{maxWidth: '100px', marginRight: '15px'}} />
            <div>
              <h5>{item.nombre}</h5>
              <p>{item.descripcion}</p>
              <p>Cantidad en carrito: {item.quantity}</p>
              <p>Stock disponible: {getAvailableStock(item.id)}</p>
            </div>
          </div>

          <div>
            <button className="btn btn-primary me-2" 
                    onClick={() => addToCart(item, 1)} 
                    disabled={getAvailableStock(item.id) <= 0}>
              +
            </button>
            <button className="btn btn-primary me-2" onClick={() => removeFromCart(item, 1)}>-</button>
            <button className="btn btn-danger" onClick={() => removeFromCart(item, item.quantity)}>🗑️</button>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="d-flex justify-content-between">
          <button className="btn btn-danger" onClick={clearCart}>Vaciar Carrito</button>
          <Link className="btn btn-success" to="/checkout">Ir al Checkout</Link>
        </div>
      )}
    </div>
  )
}

export default Cart;