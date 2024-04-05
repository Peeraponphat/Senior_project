// store.js
import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationSlice';
import loadingReducer from './loading';

const store = configureStore({
  reducer: {
    location: locationReducer,
    loading: loadingReducer,
  },
});

export default store;
