import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';



function CartWidget({ closeWidget }) {
  const { cart } = useCart();

  return (
    <div className="cart-widget-container">
      <button onClick={closeWidget} className="btn-close-widget">X</button>

      {cart.length === 0 ? (
        <p className='carritovacio'>Tu carrito está vacío.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="cart-widget-item">
              <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
              <h5>{item.nombre}</h5>
              <p>{item.descripcion}</p>
              <p>Cantidad: {item.quantity}</p>
            </div>
          ))}
            <div className='bononesitem'>
                <Link to="/cart" className="btn btn-primary" onClick={closeWidget}>Ver Carrito</Link>
                <Link to="/checkout" className="btn btn-success" onClick={closeWidget}>Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default CartWidget;