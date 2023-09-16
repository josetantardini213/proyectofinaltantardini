import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { db } from '../index';
import { collection, doc, updateDoc, onSnapshot } from '@firebase/firestore';

function Checkout() {
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Escuchar cambios en la colección 'productos' de Firestore
    const unsub = onSnapshot(collection(db, 'productos'), (snapshot) => {
      const prodData = [];
      snapshot.forEach(doc => prodData.push({ ...doc.data(), id: doc.id }));
      setProducts(prodData);
    });

    return () => unsub(); // Limpiar el listener al desmontar el componente
  }, []);

  const getProductFromLocalState = id => products.find(p => p.id === id);

  const getTotal = () => {
    return cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
  }

  const handlePayment = async () => {
    let updatedProducts = [...products];

    for (const item of cart) {
      const productRef = doc(db, 'productos', item.id);
      const newStock = getProductFromLocalState(item.id).stock - item.quantity;
      await updateDoc(productRef, {
        stock: newStock
      });

      const productIndex = updatedProducts.findIndex(p => p.id === item.id);
      if (productIndex !== -1) {
        updatedProducts[productIndex].stock = newStock;
      }
    }
    setCart([]); // Vacía el carrito tras la compra.
    setProducts(updatedProducts); // Actualiza el estado local de los productos.
    alert("¡Compra realizada con éxito!");
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-5">Checkout</h1>

      <div className="row">
        {/* Detalles de la compra */}
        <div className="col-md-7 border-end">
          {cart.map(item => (
            <div key={item.id} className="mb-4 d-flex align-items-center">
              <img src={item.imagen} alt={item.nombre} className="img-fluid me-3" style={{ maxWidth: '80px' }} />
              <div>
                <h5>{item.nombre}</h5>
                <p>{item.descripcion}</p>
                <p>Cantidad: {item.quantity}</p>
                <p>Precio unitario: ${item.precio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Total y botón de pagar */}
        <div className="col-md-5">
          <div className="p-4 border rounded">
            <h4 className="mb-4">Total: ${getTotal()}</h4>
            <button className="btn btn-success" onClick={handlePayment}>Pagar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout;
