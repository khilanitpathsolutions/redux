import React, { Suspense } from 'react'
import './index.css'
import Routing from './routes'
import 'bootstrap/dist/css/bootstrap.min.css';
import { WishlistProvider } from './utils/wishlistContext';
import { CartProvider } from './utils/cartContext';
import { HelmetProvider } from 'react-helmet-async';

const helmetContext = {};

const App = () => {
  return (
    <HelmetProvider context={helmetContext}>
    <Suspense fallback={<div>Loading ...</div>}>
    <WishlistProvider>
      <CartProvider>
        <Routing />
      </CartProvider>
    </WishlistProvider>
    </Suspense>
    </HelmetProvider>
  );
}

export default App
