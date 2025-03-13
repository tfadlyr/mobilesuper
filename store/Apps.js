import { createSlice } from "@reduxjs/toolkit";

const AppsSlice = createSlice({
  name: "Apps",
  initialState: {
    device: "",
  },
  reducers: {
    setDevice: (state, action) => {
      state.device = action.payload;
    },
  },
});

export const { setDevice } = AppsSlice.actions;

export default AppsSlice.reducer;
