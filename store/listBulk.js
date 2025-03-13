import { createSlice } from "@reduxjs/toolkit";

const listBulkSlice = createSlice({
  name: "listbulk",
  initialState: {
    selectedAll: false,
    listAll: [],
    list: [],
    typeLetter: [{ id: "", name: "Semua Jenis Surat" }],
  },
  reducers: {
    setSelectedAll: (state, action) => {
      state.selectedAll = action.payload;
    },
    initListAll: (state, action) => {
      state.listAll = action.payload;
    },
    initList: (state, action) => {
      state.list = action.payload;
    },
    setSelectedList: (state, action) => {
      let index;
      if (action.payload != undefined) {
        if (action?.payload?.id) {
          index = state.list.findIndex((item) => item == action.payload.id);
        }
        if (index == -1 || index == undefined) {
          //ADD
          if (!action.payload.progress) {
            state.list.push(action.payload.id);
          }
        } else {
          //REMOVE
          state.list.splice(index, 1);
        }
      }
      if (state.list.length == state.listAll.length) {
        state.selectedAll = true;
      } else {
        state.selectedAll = false;
      }
    },
    removeAllSelectedList: (state) => {
      state.list = [];
    },
    setTypeLetter: (state, action) => {
      if (state.typeLetter.length == 1) {
        state.typeLetter = state.typeLetter.concat(action.payload);
        console.log(state.typeLetter)
      }
    },
  },
});

export const {
  setSelectedAll,
  initListAll,
  initList,
  setSelectedList,
  removeAllSelectedList,
  setTypeLetter,
} = listBulkSlice.actions;

export default listBulkSlice.reducer;
