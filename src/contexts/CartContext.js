import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../index'; // Asegúrate de que 'db' es tu instancia de Firestore.
import { collection, getDocs } from '@firebase/firestore';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      const stockCollection = collection(db, 'productos'); // Cambia esto al nombre correcto de tu colección, si es necesario.
      const stockSnapshot = await getDocs(stockCollection);
      const stockList = stockSnapshot.docs.map(doc => {
        return { ...doc.data(), id: doc.id }
      });
      setStock(stockList);
    };

    fetchStock();
  }, []);

  const addToCart = (item, qtyToAdd) => {
    const currentCart = [...cart];
    const existingProductIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

    if (existingProductIndex !== -1) {
        currentCart[existingProductIndex].quantity += qtyToAdd;
    } else {
        currentCart.push({ ...item, quantity: qtyToAdd });
    }

    setCart(currentCart);
  };

  const removeFromCart = (item, qtyToRemove = 1) => {
    const currentCart = [...cart];
    const existingProductIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

    if (existingProductIndex !== -1) {
        currentCart[existingProductIndex].quantity -= qtyToRemove;

        if (currentCart[existingProductIndex].quantity <= 0) {
            currentCart.splice(existingProductIndex, 1);
        }
    }

    setCart(currentCart);
  };

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, stock, setCart, quantity: totalQuantity, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
