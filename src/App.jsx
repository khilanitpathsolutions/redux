import React from 'react'
import './index.css'
import Routing from './routes'
import 'bootstrap/dist/css/bootstrap.min.css';
import { WishlistProvider } from '../src/utils/wishlistContext'; 

const App = () => {
  return (
    <WishlistProvider>
      <Routing />
    </WishlistProvider>
  );
}

export default App
