import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {
    toggleWishlist: (state, action) => {
      const newItem = action.payload;
      const itemExists = state.find(item => item.id === newItem.id);

      if (itemExists) {
        return state.filter(item => item.id !== newItem.id);
      } else {
        return [...state, newItem];
      }
    }
  }
});

export const wishlistReducer = wishlistSlice.reducer;
export const { toggleWishlist } = wishlistSlice.actions;
