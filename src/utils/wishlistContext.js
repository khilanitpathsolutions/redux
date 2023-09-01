import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, fetchWishlistItemsFromFirestore } from "../services/firebase";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchWishlistItems = async () => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const items = await fetchWishlistItemsFromFirestore(uid);
      setWishlistItems(items);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);
  

  return (
    <WishlistContext.Provider value={{ wishlistItems, fetchWishlistItems }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
