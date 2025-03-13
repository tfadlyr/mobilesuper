import { createSlice } from "@reduxjs/toolkit";

const referensiSlice = createSlice({
  name: "referensi",
  initialState: {
    prevAgenda: {},
  },
  reducers: {
    setPrevAgenda: (state, action) => {
      state.prevAgenda = action.payload;
    },
  },
});

export const { setPrevAgenda } = referensiSlice.actions;

export default referensiSlice.reducer;
