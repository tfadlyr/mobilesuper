import { createSlice } from "@reduxjs/toolkit";

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: {
    clipboard: false,
    fab: false,
  },
  reducers: {
    setClipboard: (state, action) => {
      state.clipboard = action.payload;
    },
    setFAB: (state, action) => {
      state.fab = action.payload;
    },
  },
});

export const { setClipboard, setFAB } = snackbarSlice.actions;

export default snackbarSlice.reducer;
