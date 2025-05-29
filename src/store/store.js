import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import Cities from "./reducers/Cities";
import cartSlice from "./reducers/cartSlice";
import WalletData from "./reducers/WalletData";
import selectedMapAddressSlice from "./reducers/selectedMapAddressSlice";
import settings from "./reducers/settings";
import homeSlice from "./reducers/Home/homeSlice";
import darkModeSlice from "./reducers/darkModeSlice";
import authenticationSlice from "./reducers/authenticationSlice";
import userAddressesSlice from "./reducers/userAddressesSlice";
import favoritesSlice from "./reducers/favoritesSlice";
import userSettingsSlice from "./reducers/userSettingsSlice";
import promoCodeSlice from "./reducers/promoCodeSlice";
import deliveryTipSlice from "./reducers/deliveryTipSlice";
import languageSlice from "@/store/reducers/languageSlice";
import rtlReducer from "@/store/reducers/rtlSlice";
import searchDrawerReducer from "@/store/reducers/searchDrawerSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  settings: settings,
  language: languageSlice,
  homepage: homeSlice,
  authentication: authenticationSlice,
  walletData: WalletData,
  cart: cartSlice,
  selectedCity: selectedMapAddressSlice,
  userSettings: userSettingsSlice,
  promoCode: promoCodeSlice,
  userAddresses: userAddressesSlice,
  darkMode: darkModeSlice,
  favorites: favoritesSlice,
  deliveryHelper: deliveryTipSlice,
  rtl: rtlReducer,
  searchDrawer: searchDrawerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false,
//         })
// })

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});

export const persistor = persistStore(store);
