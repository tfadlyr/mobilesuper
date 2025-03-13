import { createSlice } from "@reduxjs/toolkit";

const payloadSlice = createSlice({
  name: "selected",
  initialState: {
    subject: "",
    lampiran: "",
    masalah: "",
    kepada: [],
    kepada_addressbook: [],
    kepada_external: [],
    dari: [],
    tembusan: [],
    additional_approver: [],
    pemeriksa: [],
    isi: "",
    isi_atas: "",
    isi_bawah: "",
    salam: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    zona_waktu: "",
    waktu_mulai: "",
    waktu_selesai: "",
    agenda: "",
    tempat: "",
  },
  reducers: {
    setSubject: (state, action) => {
      state.subject = action.payload;
    },
    setLampiran: (state, action) => {
      state.lampiran = action.payload;
    },
    setMasalah: (state, action) => {
      state.masalah = action.payload;
    },
    setKepada: (state, action) => {
      state.kepada = action.payload;
    },
    setKepadaAddressbook: (state, action) => {
      state.kepada_addressbook = action.payload;
    },
    setKepadaExternal: (state, action) => {
      state.kepada_external = action.payload;
    },
    setDari: (state, action) => {
      state.dari = action.payload;
    },
    setTembusan: (state, action) => {
      state.tembusan = action.payload;
    },
    setAdditionalApprover: (state, action) => {
      state.additional_approver = action.payload;
    },
    setPemeriksa: (state, action) => {
      state.pemeriksa = action.payload;
    },
    setIsi: (state, action) => {
      state.isi = action.payload;
    },
    setIsiAtas: (state, action) => {
      state.isi_atas = action.payload;
    },
    setIsiBawah: (state, action) => {
      state.isi_bawah = action.payload;
    },
    setSalam: (state, action) => {
      state.salam = action.payload;
    },
    setTanggalMulai: (state, action) => {
      state.tanggal_mulai = action.payload;
    },
    setTanggalSelesai: (state, action) => {
      state.tanggal_selesai = action.payload;
    },
    setZonaWaktu: (state, action) => {
      state.zona_waktu = action.payload;
    },
    setWaktuMulai: (state, action) => {
      state.waktu_mulai = action.payload;
    },
    setWaktuSelesai: (state, action) => {
      state.waktu_selesai = action.payload;
    },
    setAgenda: (state, action) => {
      state.agenda = action.payload;
    },
    setTempat: (state, action) => {
      state.tempat = action.payload;
    },
    removeAll: (state) => {
      state.subject = "";
      state.lampiran = "";
      state.masalah = "";
      state.kepada = [];
      state.kepada_addressbook = [];
      state.kepada_external = [];
      state.dari = [];
      state.tembusan = [];
      state.additional_approver = [];
      state.pemeriksa = [];
      state.isi = "";
      state.isi_atas = "";
      state.isi_bawah = "";
      state.salam = "";
      state.tanggal_mulai = "";
      state.tanggal_selesai = "";
      state.zona_waktu = "";
      state.waktu_mulai = "";
      state.waktu_selesai = "";
      state.agenda = "";
      state.tempat = "";
    },
  },
});

export const {
  setSubject,
  setLampiran,
  setMasalah,
  setKepada,
  setKepadaAddressbook,
  setKepadaExternal,
  setDari,
  setTembusan,
  setAdditionalApprover,
  setPemeriksa,
  setIsi,
  setIsiAtas,
  setIsiBawah,
  setSalam,
  setTanggalMulai,
  setTanggalSelesai,
  setZonaWaktu,
  setWaktuMulai,
  setWaktuSelesai,
  setAgenda,
  setTempat,
  removeAll,
} = payloadSlice.actions;

export default payloadSlice.reducer;
