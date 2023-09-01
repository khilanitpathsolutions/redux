import React, { useEffect, useState } from "react";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { useWishlist } from "../utils/wishlistContext";

const WishlistIcon = ({ item, onToggleWishlist }) => {
  const { wishlistItems } = useWishlist();
  const [isItemInWishlist, setIsItemInWishlist] = useState(false);

  useEffect(() => {
    const itemInWishlist = wishlistItems.find(
      (wishlistItem) => wishlistItem.id === item.id
    );
    setIsItemInWishlist(!!itemInWishlist);
  }, [wishlistItems, item.id]);

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
