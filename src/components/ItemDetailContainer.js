import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function ItemDetailContainer() {
  const { itemId } = useParams();
  const { addToCart, cart, stock } = useCart();
  const [quantity, setQuantity] = useState(1);

  const item = stock.find(p => p.id === itemId);

  const getProductQuantityInCart = (productId) => {
    const productInCart = cart.find(item => item.id === productId);
    return productInCart ? productInCart.quantity : 0;
  };

  const productQtyInCart = item ? getProductQuantityInCart(item.id) : 0;
  const availableStock = item ? item.stock - productQtyInCart : 0;

  useEffect(() => {
    if (availableStock < quantity) {
      setQuantity(availableStock);
    }
  }, [availableStock, quantity]);

  if (!item) {
    return <p>Producto no encontrado</p>;
  }


  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img src={item.imagen} alt={item.nombre} className="img-fluid"/>
        </div>
        <div className="col-md-6">
          <h1>{item.nombre}</h1>
          <p>{item.descripcion}</p>
          <p>Stock disponible: {availableStock}</p>
          
        <p>Precio: ${item.precio}</p>

          <p>Cantidad: 
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity === 1}
            >
              -
            </button>
            {` ${quantity} `}
            <button 
              onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
              disabled={quantity === availableStock}
            >
              +
            </button>
          </p>

          <button 
            className="btn btn-primary" 
            onClick={() => addToCart(item, quantity)}
            disabled={availableStock === 0}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailContainer;
