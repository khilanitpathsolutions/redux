import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  loggedInEmail: '', 
  userRole: 'user'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.loggedInEmail = action.payload.email; 
      state.userRole = action.payload.userRole
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.loggedInEmail = ''; 
      state.userRole = ''
    },
    register: (state, action) => {
      const { email, password } = action.payload; 
      if (!state.registeredUsers.some((user) => user.email === email)) {
        state.registeredUsers.push({ email, password }); 
      }
    },
  },
});

export const { login, logout, register } = userSlice.actions;

export default userSlice.reducer;
