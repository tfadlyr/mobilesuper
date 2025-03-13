import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import profileReducer from "./profile";
import addressbookReducer from "./addressbook";
import dispoMultiReducer from "./dispoMulti";
import payloadReducer from "./payload";
import pushnotifReducer from "./pushnotif";
import snackbarReducer from "./snackbar";
import referensiReducer from "./referensi";
import superAppsReducer from "./SuperApps";
import GrupKalenderReducer from "./GrupKalender";
import Repository from "./Repository";
import TaskReducer from "./Task";
import KebijakanReducer from "./Kebijakan";
import DashboardReducer from "./Dashboard";
import PengetahuanReducer from "./Pengetahuan";
import DigitalSignReducer from "./DigitalSign";
import ProdukHukumReducer from "./ProdukHukum";
import PegawaiReducer from "./Pegawai";
import EventReducer from "./Event";
import AddressbookKKP from "./AddressbookKKP";
import Satker from "./Satker";
import LoginAuth from "./LoginAuth";
import Cuti from "./Cuti";
import SPPD from "./SPPD";
import HelpDesk from "./HelpDesk";
import Apps from "./Apps";
import Survey from "./Survey";
import KalenderPersonal from "./KalenderPersonal";
import AksiPerubahan from "./AksiPerubahan";
import FaqReducer from "./Faq";
import Kepegawain from "./Kepegawain";
import listBulk from "./listBulk";
import KalenderSatker from "./KalenderSatker";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    addressbook: addressbookReducer,
    dispoMulti: dispoMultiReducer,
    payload: payloadReducer,
    pushnotif: pushnotifReducer,
    snackbar: snackbarReducer,
    referensi: referensiReducer,
    superApps: superAppsReducer,
    grupKalender: GrupKalenderReducer,
    repository: Repository,
    task: TaskReducer,
    kebijakan: KebijakanReducer,
    dashboard: DashboardReducer,
    pengetahuan: PengetahuanReducer,
    digitalsign: DigitalSignReducer,
    produkHukum: ProdukHukumReducer,
    Pegawai: PegawaiReducer,
    event: EventReducer,
    addressBookKKP: AddressbookKKP,
    satker: Satker,
    login: LoginAuth,
    cuti: Cuti,
    sppd: SPPD,
    helpDesk: HelpDesk,
    apps: Apps,
    survey: Survey,
    kalenderPersonal: KalenderPersonal,
    KalenderSatker: KalenderSatker,
    aksiperubahan: AksiPerubahan,
    Faq: FaqReducer,
    kepegawaian: Kepegawain,
    listbulk: listBulk,
  },
});
