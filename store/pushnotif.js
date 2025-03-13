import { createSlice } from "@reduxjs/toolkit";

const pushnotifSlice = createSlice({
  name: "pushnotif",
  initialState: {
    dataNotif: {},
  },
  reducers: {
    setDataNotif: (state, action) => {
      console.log("store", action.payload);
      state.dataNotif = action.payload;
    },
  },
});

export const { setDataNotif } = pushnotifSlice.actions;

export default pushnotifSlice.reducer;
