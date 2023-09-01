import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../store/reducers/wishlistSlice";
import { addToWishlistInFirestore, auth, removeFromWishlistInFirestore } from "../services/firebase";
import { useWishlist } from "../utils/wishlistContext"; 

const useToggleWishlist = () => {
  const dispatch = useDispatch();
  const { wishlistItems, fetchWishlistItems } = useWishlist(); 
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleToggleWishlist = async (item) => {
    if (!isLoggedIn) {
      alert("Please Login to Add product to Wishlist");
      return;
    }

    const isItemInWishlist = wishlistItems.find(
      (wishlistItem) => wishlistItem.id === item.id
    );

    if (isItemInWishlist) {
      await removeFromWishlistInFirestore(auth.currentUser.uid, item.id);
    } else {
      await addToWishlistInFirestore(auth.currentUser.uid, item);
    }

    dispatch(toggleWishlist({ email: auth.currentUser.uid, item }));

    fetchWishlistItems();
  };

  return handleToggleWishlist;
};

export default useToggleWishlist;
