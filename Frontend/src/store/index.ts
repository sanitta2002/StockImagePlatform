import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authReducer from './slices/authSlice';
import tokenReducer from './slices/tokenSlice';

// Custom storage to bypass Vite ESM import issues with redux-persist/lib/storage
const createWebStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(window.localStorage.getItem(_key));
    },
    setItem(_key: string, value: string) {
      window.localStorage.setItem(_key, value);
      return Promise.resolve();
    },
    removeItem(_key: string) {
      window.localStorage.removeItem(_key);
      return Promise.resolve();
    },
  };
};

const storage = createWebStorage();

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'token']
};

const rootReducer = combineReducers({
  auth: authReducer,
  token: tokenReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
