import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./reducers/cartSlice";
import { wishlistReducer } from "./reducers/wishlistSlice";
import { themeReducer } from "./reducers/themeSlice";
import userReducer from "./reducers/userSlice"; 
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
  whitelist: ["user"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export const persistor = persistStore(store);
