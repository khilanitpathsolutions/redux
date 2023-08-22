import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {},
  reducers: {
    addToCart: (state, action) => {
      const { username, item } = action.payload;
      if (!state[username]) {
        state[username] = [];
      }

      const itemInCart = state[username].find((cartItem) => cartItem.id === item.id);
      if (itemInCart) {
        itemInCart.quantity++;
      } else {
        state[username].push({ ...item, quantity: 1 });
      }
    },
    incrementQuantity: (state, action) => {
      const { username, itemId } = action.payload;
      const item = state[username].find((cartItem) => cartItem.id === itemId);
      item.quantity++;
    },
    decrementQuantity: (state, action) => {
      const { username, itemId } = action.payload;
      const item = state[username].find((cartItem) => cartItem.id === itemId);
      if (item.quantity > 1) {
        item.quantity--;
      }
    },
    removeItem: (state, action) => {
      const { username, itemId } = action.payload;
      state[username] = state[username].filter((item) => item.id !== itemId);
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
