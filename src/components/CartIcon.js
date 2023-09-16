import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import CartWidget from './CartWidget';

function CartIcon() {
  const { cart } = useCart();
  const [isWidgetOpen, setWidgetOpen] = useState(false);

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <div onClick={() => setWidgetOpen(!isWidgetOpen)}>
        🛒 {totalQuantity}
      </div>

      {isWidgetOpen && <CartWidget closeWidget={() => setWidgetOpen(false)} />}
    </>
  );
}

export default CartIcon;