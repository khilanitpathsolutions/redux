import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../store/reducers/wishlistSlice";
import { addToWishlistInFirestore, auth, removeFromWishlistInFirestore } from "../services/firebase";
import { useWishlist } from "../utils/wishlistContext"; 
import { toast } from "react-toastify";

const useToggleWishlist = () => {
  const dispatch = useDispatch();
  const { wishlistItems, fetchWishlistItems } = useWishlist(); 
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleToggleWishlist = async (item) => {
    if (!isLoggedIn) {
      toast.error("Please Login to Add product to Wishlist", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
  
    const isItemInWishlist = wishlistItems.find(
      (wishlistItem) => wishlistItem.id === item.id
    );
  
    if (isItemInWishlist) {
      await removeFromWishlistInFirestore(auth.currentUser.uid, item.id);
      toast.success("Item removed from the wishlist", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      await addToWishlistInFirestore(auth.currentUser.uid, item);
      toast.success("Item added to the wishlist", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  
    dispatch(toggleWishlist({ email: auth.currentUser.uid, item }));
  
    fetchWishlistItems();
  };
  

  return handleToggleWishlist;
};

export default useToggleWishlist;
