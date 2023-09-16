import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../App.css';

function ItemListContainer() {
  const { categoryId } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart, removeFromCart, cart, stock } = useCart();
  const [productQuantities, setProductQuantities] = useState({});  // Estado para manejar las cantidades de producto seleccionadas

  useEffect(() => {
    if (categoryId) {
      // Filtrar productos por categoría
      setFilteredProducts(stock.filter(p => p.categoryId === categoryId));
    } else {
      // Mostrar todos los productos si no hay categoría seleccionada
      setFilteredProducts(stock);
    }
  }, [categoryId, stock]);

  const getProductQuantityInCart = (productId) => {
    const productInCart = cart.find(item => item.id === productId);
    return productInCart ? productInCart.quantity : 0;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {filteredProducts.map(product => {
          const productQtyInCart = getProductQuantityInCart(product.id);
          const availableStock = product.stock - productQtyInCart;
          const productQuantity = productQuantities[product.id] || 1;

          return (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-img-container">
                  <img src={product.imagen} alt={product.nombre} className="card-img-top"/>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{product.nombre}</h5>
                  <p>Stock: {availableStock}</p>

                  {/* Selector de cantidad */}
                  <p>Cantidad: 
                    <button 
                      onClick={() => setProductQuantities({ ...productQuantities, [product.id]: Math.max(1, productQuantity - 1)})}
                      disabled={productQuantity === 1}
                    >
                      -
                    </button>
                    {` ${productQuantity} `}
                    <button 
                      onClick={() => setProductQuantities({ ...productQuantities, [product.id]: Math.min(availableStock, productQuantity + 1)})}
                      disabled={productQuantity === availableStock}
                    >
                      +
                    </button>
                  </p>

                  <Link to={`/item/${product.id}`} className="btn btn-primary mr-2">Ver detalles</Link>
                  <div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, productQuantity);  // Usando la cantidad seleccionada
                            setProductQuantities({ ...productQuantities, [product.id]: 1 }); // Resetear a 1 después de agregar al carrito
                        }} 
                        disabled={!product.stock || productQtyInCart >= product.stock}
                        className="btn btn-success"
                      >
                        Agregar al carrito
                      </button>

                    <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(product, 1);
                      }} 
                      disabled={!productQtyInCart}
                      className="btn btn-danger"
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ItemListContainer;