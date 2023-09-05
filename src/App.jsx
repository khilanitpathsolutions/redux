import React, { Suspense } from 'react'
import './index.css'
import Routing from './routes'
import 'bootstrap/dist/css/bootstrap.min.css';
import { WishlistProvider } from './utils/wishlistContext';
import { CartProvider } from './utils/cartContext';

const App = () => {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
    <WishlistProvider>
      <CartProvider>
        <Routing />
      </CartProvider>
    </WishlistProvider>
    </Suspense>
  );
}

export default App
