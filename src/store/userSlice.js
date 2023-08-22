import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  loggedInUsername: '', 
  registeredUsers: [], 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.loggedInUsername = action.payload.username; 
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.loggedInUsername = ''; 
    },
    register: (state, action) => {
      const { username, password } = action.payload;
      if (!state.registeredUsers.some((user) => user.username === username)) {
        state.registeredUsers.push({ username, password });
      }
    },
  },
});

export const { login, logout, register } = userSlice.actions;

export default userSlice.reducer;
