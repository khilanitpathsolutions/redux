import React from "react";
import { useSelector } from "react-redux";
import { Heart, HeartFill } from "react-bootstrap-icons";

const WishlistIcon = ({ item, onToggleWishlist }) => {
  const loggedInEmail = useSelector((state) => state.user.loggedInEmail);
  const wishlist = useSelector((state) => state.wishlist);

  const isItemInWishlist = wishlist[loggedInEmail]?.find(
    (wishlistItem) => wishlistItem.id === item.id
  );

  const IconComponent = isItemInWishlist ? HeartFill : Heart;

  return (
    <div
      style={{
        position: "absolute",
        right: "12px",
        top: "12px",
      }}
    >
      <IconComponent
        size={30}
        onClick={() => onToggleWishlist(item)}
        style={{ color: isItemInWishlist ? "#ff4d4d" : "inherit", cursor: "pointer" }}
      />
    </div>
  );
};

export default WishlistIcon;
