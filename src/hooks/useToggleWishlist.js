import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../store/reducers/wishlistSlice";

const useToggleWishlist = () => {
  const dispatch = useDispatch();
  const loggedInEmail = useSelector((state) => state.user.loggedInEmail);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleToggleWishlist = (item) => {
    if (isLoggedIn) {
      dispatch(toggleWishlist({ email: loggedInEmail, item }));
    } else {
      alert("Please Login to Add product to Cart & Wishlist");
    }
  };

  return handleToggleWishlist;
};

export default useToggleWishlist;
