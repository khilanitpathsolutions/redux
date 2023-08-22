import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./cartSlice";
import { wishlistReducer } from "./wishlistSlice";
import { themeReducer } from "./themeSlice";
import userReducer from "./userSlice"; 
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  theme: themeReducer,
  user: userReducer, 
});

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export const persistor = persistStore(store);
