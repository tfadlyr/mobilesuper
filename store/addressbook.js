import { createSlice } from "@reduxjs/toolkit";

const addressbookSlice = createSlice({
  name: "addressbook",
  initialState: {
    sender: [],
    receivers: [],
    copytos: [],
    additional_approver: [],
    approver: [],
    km: [],
  },
  reducers: {
    initSender: (state,action) => {
      state.sender = action.payload;
    },
    initReceivers: (state,action) => {
      state.receivers = action.payload;
    },
    initCopytos: (state,action) => {
      state.copytos = action.payload;
    },
    initAdditionalApprover: (state,action) => {
      state.additional_approver = action.payload;
    },
    initApprover: (state,action) => {
      state.approver = action.payload;
    },
    initKM: (state,action) => {
      state.km = action.payload;
    },
    setSenderAddressbook: (state, action) => {
      //addressbook 1 Sender
      //cari index data
      let index;
      if (action.payload.selected.nik) {
        index = state.sender.findIndex(
          (item) => item.nik == action.payload.selected.nik
        );
        //handle addressbook init
        if(index==-1){
          index = state.sender.findIndex(
            (item) => item.code == action.payload.selected.nik
          );
        }
      } else {
        index = state.sender.findIndex(
          (item) => item.code == action.payload.selected.code
        );
      }
      if (index == -1 || index == undefined) {
        //ADD
        state.sender.splice(index, 1);
        state.sender.push(action.payload.selected);
      } else {
        //REMOVE
        state.sender.splice(index, 1);
      }
    },
    setReceiversAddressbook: (state, action) => {
      //cari index data
      let index;
      if (action.payload.selected.nik) {
        index = state.receivers.findIndex(
          (item) => item.nik == action.payload.selected.nik
        );
        //handle addressbook init
        if(index==-1){
          index = state.receivers.findIndex(
            (item) => item.code == action.payload.selected.nik
          );
        }
      } else {
        index = state.receivers.findIndex(
          (item) => item.code == action.payload.selected.code
        );
      }
      if (action.payload.multiple == false) {
        //addressbook 1 Receivers
        if (index == -1 || index == undefined) {
          //ADD
          state.receivers.splice(index, 1);
          state.receivers.push(action.payload.selected);
        } else {
          //REMOVE
          state.receivers.splice(index, 1);
        }
      } else {
        // addressbook multiple Receivers
        if (index == -1 || index == undefined) {
          //ADD
          state.receivers.push(action.payload.selected);
        } else {
          //REMOVE
          state.receivers.splice(index, 1);
        }
      }
    },
    setCopytosAddressbook: (state, action) => {
      //cari index data
      let index;
      if (action.payload.selected.nik) {
        index = state.copytos.findIndex(
          (item) => item.nik == action.payload.selected.nik
        );
        //handle addressbook init
        if(index==-1){
          index = state.copytos.findIndex(
            (item) => item.code == action.payload.selected.nik
          );
        }
      } else {
        index = state.copytos.findIndex(
          (item) => item.code == action.payload.selected.code
        );
      }
      if (action.payload.multiple == false) {
        //addressbook 1 copytos
        if (index == -1 || index == undefined) {
          //ADD
          state.copytos.splice(index, 1);
          state.copytos.push(action.payload.selected);
        } else {
          //REMOVE
          state.copytos.splice(index, 1);
        }
      } else {
        // addressbook multiple copytos
        if (index == -1 || index == undefined) {
          //ADD
          state.copytos.push(action.payload.selected);
        } else {
          //REMOVE
          state.copytos.splice(index, 1);
        }
      }
    },
    setAdditionalApproverAddressbook: (state, action) => {
      //cari index data
      let index;
      if (action.payload.selected.nik) {
        index = state.additional_approver.findIndex(
          (item) => item.nik == action.payload.selected.nik
        );
      } else {
        index = state.additional_approver.findIndex(
          (item) => item.code == action.payload.selected.code
        );
      }
      //addressbook 1 additional_approver
      if (index == -1 || index == undefined) {
        //ADD
        state.additional_approver.splice(index, 1);
        state.additional_approver.push(action.payload.selected);
      } else {
        //REMOVE
        state.additional_approver.splice(index, 1);
      }
    },
    setApproverAddressbook: (state, action) => {
      //cari index data
      let index;
      if (action.payload.selected.nik) {
        index = state.approver.findIndex(
          (item) => item.nik == action.payload.selected.nik
        );
        //handle addressbook init
        if(index==-1){
          index = state.approver.findIndex(
            (item) => item.code == action.payload.selected.nik
          );
        }
      } else {
        index = state.approver.findIndex(
          (item) => item.code == action.payload.selected.code
        );
      }
      if (action.payload.multiple == false) {
        //addressbook 1 approver
        if (index == -1 || index == undefined) {
          //ADD
          state.approver.splice(index, 1);
          state.approver.push(action.payload.selected);
        } else {
          //REMOVE
          state.approver.splice(index, 1);
        }
      } else {
        // addressbook multiple approver
        if (index == -1) {
          //ADD
          state.approver.push(action.payload.selected);
        } else {
          //REMOVE
          state.approver.splice(index, 1);
        }
      }
    },
    setKMAddressbook: (state, action) => {
      //addressbook klasifikasi masalah
      let index = state.km.findIndex(
        (item) => item.code == action.payload.selected.code
      );
      if (index == -1 || index == undefined) {
        //ADD
        state.km.splice(index, 1);
        state.km.push(action.payload.selected);
      } else {
        //REMOVE
        state.km.splice(index, 1);
      }
    },
    removeAll: (state) => {
      state.sender = [];
      state.receivers = [];
      state.copytos = [];
      state.additional_approver = [];
      state.km = [];
    },
  },
});

export const {
  initSender,
  initReceivers,
  initCopytos,
  initAdditionalApprover,
  initApprover,
  initKM,
  setSenderAddressbook,
  setReceiversAddressbook,
  setCopytosAddressbook,
  setAdditionalApproverAddressbook,
  setApproverAddressbook,
  setKMAddressbook,
  removeAll,
} = addressbookSlice.actions;

export default addressbookSlice.reducer;
