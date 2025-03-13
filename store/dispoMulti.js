import { createSlice } from "@reduxjs/toolkit";

const dispoMultiSlice = createSlice({
  name: "dispoMulti",
  initialState: {
    data: [
      {
        kepadaDispo: [],
        btnDel: false,
        tindakan1: true,
        nota_tindakan1: "",
        nota_tindakan_free1: "",
        create_todo1: false,
        duedate_todo1: "",
        send_priority_todo1: "",
        remind_todo1: false,
        remind_count_todo1: 0,
      },
    ],
  },
  reducers: {
    addDispoMulti: (state, action) => {
      let temp = [...state.data, action.payload];
      temp[0].btnDel = true;
      state.data = temp;
    },
    removeDispoMulti: (state, action) => {
      state.data.splice(action.payload, 1);
      if (state.data.length == 1) {
        let temp = [...state.data];
        temp[0].btnDel = false;
        state.data = temp;
      }
    },
    setDispoReceiver: (state, action) => {
      //cari index data
      let indexDispo = action.payload.index;
      let index;
      if (action.payload.selected.nik) {
        index = state.data[indexDispo].kepadaDispo.findIndex(
          (item) => item.nik == action.payload.selected.nik
        );
      } else {
        index = state.data[indexDispo].kepadaDispo.findIndex(
          (item) => item.code == action.payload.selected.code
        );
      }

      if (index == -1) {
        //ADD
        state.data[indexDispo].kepadaDispo.push(action.payload.selected);
      } else {
        //REMOVE
        state.data[indexDispo].kepadaDispo.splice(index, 1);
      }
    },
    setTodoDuedate: (state, action) => {
      let index = action.payload.index;
      let temp = [...state.data];
      temp[index].duedate_todo1 = action.payload.duedate_todo1;
      state.data = temp;
    },
    setTodoPriority: (state, action) => {
      let index = action.payload.index;
      let temp = [...state.data];
      temp[index].send_priority_todo1 = action.payload.send_priority_todo1;
      state.data = temp;
    },
    setTodoRemind: (state, action) => {
      let index = action.payload;
      let temp = [...state.data];
      temp[index].remind_todo1 = !temp[index].remind_todo1;
      state.data = temp;
    },
    setTodoRemindCount: (state, action) => {
      let index = action.payload.index;
      let temp = [...state.data];
      temp[index].remind_count_todo1 = action.payload.remind_count_todo1;
      state.data = temp;
    },
    setNotaTindakanFree: (state, action) => {
      let index = action.payload.index;
      let temp = [...state.data];
      temp[index].nota_tindakan_free1 = action.payload.nota_tindakan_free1;
      state.data = temp;
    },
    setNotaTindakan: (state, action) => {
      let index = action.payload.index;
      let temp = [...state.data];
      temp[index].nota_tindakan1 = action.payload.nota_tindakan1;
      state.data = temp;
    },
    switchTindakan: (state, action) => {
      let index = action.payload;
      let temp = [...state.data];
      temp[index].tindakan1 = !temp[index].tindakan1;
      state.data = temp;
    },
    switchTodo: (state, action) => {
      let index = action.payload;
      let temp = [...state.data];
      temp[index].create_todo1 = !temp[index].create_todo1;
      state.data = temp;
    },
    removeAllDispoMulti: (state) => {
      state.data = [
        {
          kepadaDispo: [],
          btnDel: false,
          tindakan1: true,
          nota_tindakan1: "",
          nota_tindakan_free1: "",
          create_todo1: false,
          duedate_todo1: "",
          send_priority_todo1: "",
          remind_todo1: false,
          remind_count_todo1: 0,
        },
      ];
    },
  },
});

export const {
  addDispoMulti,
  removeDispoMulti,
  setDispoReceiver,
  switchTindakan,
  setNotaTindakan,
  setNotaTindakanFree,
  switchTodo,
  setTodoDuedate,
  setTodoPriority,
  setTodoRemind,
  setTodoRemindCount,
  removeAllDispoMulti,
} = dispoMultiSlice.actions;

export default dispoMultiSlice.reducer;
