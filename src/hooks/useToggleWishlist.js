import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../store/reducers/wishlistSlice";
import { addToWishlistInFirestore, auth, removeFromWishlistInFirestore } from "../services/firebase";

const useToggleWishlist = (fetchWishlistItems) => {
  const dispatch = useDispatch();
  const loggedInEmail = useSelector((state) => state.user.loggedInEmail);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const wishlist = useSelector((state) => state.wishlist); 

  const handleToggleWishlist = async (item) => {
    if (!isLoggedIn) {
      alert("Please Login to Add product to Wishlist");
      return;
    }

    const isItemInWishlist = wishlist[loggedInEmail]?.find(
      (wishlistItem) => wishlistItem.id === item.id
    );

    if (isItemInWishlist) {
      await removeFromWishlistInFirestore(auth.currentUser.uid, item.id); 
    } else {
      await addToWishlistInFirestore(auth.currentUser.uid, item); 
    }

    dispatch(toggleWishlist({ email: loggedInEmail, item }));

    fetchWishlistItems()
  };

  return handleToggleWishlist;
};

export default useToggleWishlist;
