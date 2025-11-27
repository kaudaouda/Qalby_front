import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import fundReducer from './slices/fundSlice';
import homeReducer from '../features/home/homeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fund: fundReducer,
    home: homeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
