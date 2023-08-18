import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../container/home'
import Cart from '../container/cart'
import WishList from '../container/wishList'

const Routing = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path='/wishlist' element={<WishList />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default Routing