import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {},
  reducers: {
    addToCart: (state, action) => {
      const { email, item } = action.payload;
      if (!state[email]) {
        state[email] = [];
      }

      const itemInCart = state[email].find((cartItem) => cartItem.id === item.id);
      if (itemInCart) {
        itemInCart.quantity++;
      } else {
        state[email].push({ ...item, quantity: 1 });
      }
    },
    incrementQuantity: (state, action) => {
      const { email, itemId } = action.payload;
      const item = state[email].find((cartItem) => cartItem.id === itemId);
      item.quantity++;
    },
    decrementQuantity: (state, action) => {
      const { email, itemId } = action.payload;
      const item = state[email].find((cartItem) => cartItem.id === itemId);
      if (item.quantity > 1) {
        item.quantity--;
      }
    },
    removeItem: (state, action) => {
      const { email, itemId } = action.payload;
      state[email] = state[email].filter((item) => item.id !== itemId);
    },
  },
});

export const cartReducer = cartSlice.reducer;
export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeItem,
} = cartSlice.actions;
