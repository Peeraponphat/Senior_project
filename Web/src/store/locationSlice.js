import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  location: JSON.parse(localStorage.getItem('location')) || null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
      localStorage.setItem('location', JSON.stringify(action.payload));
    },
  },
});

export const { setLocation } = locationSlice.actions;
export const selectLocation = state => state.location;
export default locationSlice.reducer;
