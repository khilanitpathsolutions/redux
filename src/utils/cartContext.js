import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, fetchCartItemsFromFirestore } from "../services/firebase";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const fetchCartItems = async () => {
      if (auth.currentUser) {
        try {
          const items = await fetchCartItemsFromFirestore(auth.currentUser.uid);
          setCartItems(items);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
        if (user) {
          fetchCartItems();
        }
      });
  
      return () => unsubscribe();
    }, []);

  return (
    <CartContext.Provider value={{ cartItems, fetchCartItems,user }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
