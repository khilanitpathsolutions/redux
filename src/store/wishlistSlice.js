import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {},
  reducers: {
    toggleWishlist: (state, action) => {
      const { username, item } = action.payload;
      if (!state[username]) {
        state[username] = [];
      }

      const itemExists = state[username].some((wishlistItem) => wishlistItem.id === item.id);

      if (itemExists) {
        state[username] = state[username].filter((wishlistItem) => wishlistItem.id !== item.id);
      } else {
        state[username].push(item);
      }
    },
  },
});

export const wishlistReducer = wishlistSlice.reducer;
export const { toggleWishlist } = wishlistSlice.actions;
