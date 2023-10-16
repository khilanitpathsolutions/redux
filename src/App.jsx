import React, { Suspense } from 'react'
import './index.css'
import Routing from './routes'
import 'bootstrap/dist/css/bootstrap.min.css';
import { WishlistProvider } from './utils/wishlistContext';
import { CartProvider } from './utils/cartContext';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const helmetContext = {};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <HelmetProvider context={helmetContext}>
    <Suspense fallback={<div>Loading ...</div>}>
    <WishlistProvider>
      <CartProvider>
        <Routing />
      </CartProvider>
    </WishlistProvider>
    </Suspense>
    </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App
