/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_SINGLE_PRODUCT } from '../utils/queries';
import { useStoreContext } from '../contexts/GlobalContext';
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../utils/actions';
import CartContainer from '../components/User/CartContainer';

import PriceChart from '../components/User/PriceChart/priceHistoryChart';

export default function ProductPage() {
  const [state, dispatch] = useStoreContext();
  const {cart} = state;

  const { id } = useParams();

  console.log(id)

  const [newproduct, setNewProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [AmazonPriceHistory, setAmazonPriceHistory] = useState([]);
  const [WalmartPriceHistory, setWalmartPriceHistory] = useState([]);
  const [LoblawsPriceHistory, setLoblawsPriceHistory] = useState([]);

  const addToCart = () => {
    // Determine if the item is in the cart, then add to cart and update quantity
    const productInCart = state.cart.find((cartProduct) => cartProduct._id === newproduct._id);
    if (productInCart && productInCart.purchaseCount > 0) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: productInCart._id,
        purchaseCount: parseInt(productInCart.purchaseCount) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...newproduct, purchaseCount: 1 }
      });
    }
    console.log('cart',state);
  }
  
  const { data } = useQuery(QUERY_SINGLE_PRODUCT, {
    variables: { id },
  })

  useEffect(() => {
    if (data && data.getProductById.AmazonHistory.priceHistory) {
      setAmazonPriceHistory(data.getProductById.AmazonHistory.priceHistory);
      setWalmartPriceHistory(data.getProductById.WalmartHistory.priceHistory);
      setLoblawsPriceHistory(data.getProductById.LoblawsHistory.priceHistory);
      setIsLoading(false)
    }
  }, [data]);

  useEffect(() => {
    if (data && data.getProductById) {
      setNewProduct(data.getProductById);
      setIsLoading(false)
    }
  }, [data]);

  return (
    <div className='row'>
      <div className="d-flex">
        <div className="d-flex flex-column justify-content-center align-items-center p-3" style={{ margin: '20px' }}>
          <img src={newproduct.image} className="mx-auto d-block" width="500" height="500" />
          <button className="btn btn-primary w-100 mt-3" onClick={addToCart}>Add to Cart</button>
        </div>
        <div className="p-3" >
          <div className="d-flex flex-column justify-content-center align-items-center p-3" style={{ margin: '20px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 'bold' }}>{newproduct.name}</h1>
          <hr style={{ width: '100%', height: '2px', backgroundColor: 'black', border: 'none', margin: '1rem 0' }} />
            <p className="mb-4">{newproduct.description}</p>
            <div className="d-flex flex-row justify-content-center align-items-center mb-4">
              <h2 className="mr-3">Price: ${newproduct.price} </h2>
            </div>
            <p>Quantity: {newproduct.quantity}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
            <div style={{ margin: '0 10px' }}>
              <PriceChart key={newproduct._id} priceHistory={AmazonPriceHistory} comp="Amazon" lineColour="orange" />
            </div>
            <div style={{ margin: '0 10px' }}>
              <PriceChart key={newproduct._id} priceHistory={WalmartPriceHistory} comp="Walmart" lineColour="blue" />
            </div>
            <div style={{ margin: '0 10px' }}>
              <PriceChart key={newproduct._id} priceHistory={LoblawsPriceHistory} comp="Loblaws" lineColour="red" />
            </div>
          </div>
          <CartContainer />
        </div>
      </div>
    </div>
  );
}