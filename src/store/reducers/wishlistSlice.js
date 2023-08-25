import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {},
  reducers: {
    toggleWishlist: (state, action) => {
      const { email, item } = action.payload;
      if (!state[email]) {
        state[email] = [];
      }

      const itemExists = state[email].some((wishlistItem) => wishlistItem.id === item.id);

      if (itemExists) {
        state[email] = state[email].filter((wishlistItem) => wishlistItem.id !== item.id);
      } else {
        state[email].push(item);
      }
    },
  },
});

export const wishlistReducer = wishlistSlice.reducer;
export const { toggleWishlist } = wishlistSlice.actions;
