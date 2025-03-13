import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  StatusBar,
  ImageBackground,
  useWindowDimensions,
  Alert,
  BackHandler,
  Platform,
  Modal,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { setToken, setValidVersion } from "../../store/auth";
import { GlobalStyles } from "../../constants/styles";
import { toolbarBack } from "../../components/UI/ToolbarBack";
import DrawerNavigator from "./Drawer";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import DispositionDetail from "./Detail/DispositionDetail";
import SubmittedDetail from "./Detail/SubmittedDetail";
import AgendaDetail from "./Detail/Tab/AgendaDetail";
import IncomingDetail from "./Detail/IncomingDetail";
import NeedFollowUpDetail from "./Detail/NeedFollowUpDetail";
import TrackingDetail from "./Detail/TrackingDetail";
import DelegationDetail from "./Detail/DelegationDetail";
import SecretaryDetail from "./Detail/SecretaryDetail";
import TodoDetail from "./Detail/TodoDetail";
import DelegationForm from "./Form/DelegationForm";
import DetailAttachment from "./Detail/Tab/DetailAttachment";
import DetailComment from "./Detail/Tab/DetailComment";
import DetailPreview from "./Detail/Tab/DetailPreview";
import DetailLog from "./Detail/Tab/DetailLog";
import SecretaryForm from "./Form/SecretaryForm";
import AddressbookEmployee from "./Addressbook/AddressEmployee";
import DispositionForm from "./Form/DispositionForm";
import ForwardForm from "./Form/ForwardForm";
import AddressbookTitle from "./Addressbook/AddressTitle";
import Addressbook from "./Addressbook/Addressbook";
import { setDeviceUUID, setProfile } from "../../store/profile";
import AddressbookKM from "./Addressbook/AddressbookKM";
import DetailDispo from "./Detail/Tab/DetailDispo";
import LetterDetail from "./Detail/LetterDetail";
import TermOfUse from "./TermOfUse";
import { getHTTP, handleUpgradeLink, postHTTP } from "../../utils/http";
import { nde_api } from "../../utils/api.config";
import ViewAttachment from "./Detail/ViewAttachment";
import ReferenceDetail from "./Detail/ReferenceDetail";
import { Config } from "../../constants/config";
import TrackingLogDetail from "./Detail/TrackingLogDetail";
import ScanLogDetail from "./Detail/ScanLogDetail";
import DigisignSearchEmail from "./Detail/DigisignSearchEmail";
import { androidId } from "expo-application";
import * as Device from "expo-device";
import * as Application from "expo-application";
import Main from "../SuperApps/Main";
import DetailDashboard from "../../Apps/Kebijakan/DetailDashboard";
import PdfViewer from "../../Apps/Kebijakan/PdfViewer";
import MyTabBar from "../SuperApps/BottomTabs";
import { Onboarding } from "../Onboarding";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ListBerita } from "../SuperApps/ListBerita";
import { DetailBerita } from "../SuperApps/DetailBerita";
import { Dokumen } from "../Repository/Dokumen";
import MainRepo from "../Repository/MainRepo";
import MainKeb from "../Kebijakan/MainKeb";
import { Tp } from "../SuperApps/Tp";
import { DetailActivity } from "../Repository/DetailActivity";
import { MainDetailRepo } from "../Repository/MainDetailRepo";
import { MainKalender } from "../Kalender/MainKalender";
import { GrupKalender } from "../Kalender/GrupKalender";
import { TambahGrup } from "../Kalender/TambahGrup";
import { TambahAgenda } from "../Kalender/TambahAgenda";
import { DetailAcara } from "../Kalender/DetailAcara";
import { ListSuka } from "../Kalender/ListSuka";
import { MyTask } from "../Task Management/MyTask";
import MainDetailTask from "../Task Management/DetailTask/MainDetailTask";
import MainDetailKorespondensiTM from "../Task Management/DetailKorespondensiTM/MainDetailKorespondensiTM";
import { AddTask } from "../Task Management/AddTask";
import { ListGaleri } from "../SuperApps/ListGaleri";
import { Kepegawaian } from "../Dashboard/Kepegawaian";
import { DetailPengmuman } from "../Dashboard/DetailPengmuman";
import { ProduksiBudidaya } from "../Dashboard/ProduksiBudidaya";
import { DetailTeknologi } from "../Dashboard/DetailTeknologi";
import { DetailLinimasa } from "../Pengetahuan/DetailLinimasa";
import { JumlahPostingan } from "../Pengetahuan/JumlahPostingan";
import { PostinganBaru } from "../Pengetahuan/PostinganBaru";
import { ListPostinganPegawai } from "../Pengetahuan/ListPostinganPegawai";
import { DetailDokumenLain } from "../DigitalSignature/DetailDokumenLain";
import { LaporanDigitalSign } from "../DigitalSignature/LaporanDigitalSign";
import MainDigitalSign from "../DigitalSignature/MainDigitalSign";
import { DetailSertifikat } from "../DigitalSignature/DetailSertifikat";
import { TambahSertifikat } from "../DigitalSignature/TambahSertifikat";
import { TambahDokumenLain } from "../DigitalSignature/TambahDokumenLain";
import MainPengetahuan from "../Pengetahuan/MainPengetahuan";
import { DetailPenilaian } from "../Pengetahuan/DetailPenilaian";
import { ListSukaLinimasa } from "../Pengetahuan/ListSukaLinimasa";
import { FileViewer } from "../Pengetahuan/FileViewer";
import { ListPegawai } from "../Pegawai/ListPegawai";
import { DetailProfile } from "../Pegawai/DetailProfile";
import { Host } from "react-native-portalize";
import { HalamanUtama } from "../Event Management/HalamanUtama";
import { DetailEvent } from "../Event Management/DetailEvent";
import { MainDetailEvent } from "../Event Management/MainDetailEvent";
import { MainDetailAgenda } from "../Event Management/MainDetailAgenda";
import { Notulensi } from "../Event Management/Notulensi";
import { DetailTodo } from "../Event Management/DetailTodo";
import { TambahEvent } from "../Event Management/TambahEvent";
import { TambahAgendaEvent } from "../Event Management/TambahAgendaEvent";
import { TambahTodo } from "../Event Management/TambahTodo";
import { LoginToken } from "../LoginToken";
import { DetailAbsen } from "../Event Management/DetailAbsen";
import { ScannerBarCode } from "../Event Management/ScannerBarCode";
import { AddressBook } from "../AddressBook";
import { EditEvent } from "../Event Management/EditEvent";
import { TambahSubAgenda } from "../Event Management/TambahSubAgenda";
import { EditSubAgenda } from "../Event Management/EditSubAgenda";
import { EditTodo } from "../Event Management/EditTodo";
import { DetailAcaraAgenda } from "../Kalender/DetailAcaraAgenda";
import { AddCategory } from "../Task Management/AddCategory";
import { Penangkapan } from "../Dashboard/Penangkapan";
import { Keuangan } from "../Dashboard/Keuangan";
import { DetailGrup } from "../Kalender/DetailGrup";
import { EditTask } from "../Task Management/EditTask";
import { EditCategory } from "../Task Management/EditCategory";
import { EditGrup } from "../Kalender/EditGrup";
import { EditAgendaGrup } from "../Kalender/EditAgendaGrup";
import { ListBeritaSatker } from "../SuperApps/ListBeritaSatker";
import { DetailBeritaSatker } from "../SuperApps/DetailBeritaSatker";
import MainSPPD from "../SPPD/MainSPPD";
import { DetailDokumenSPPD } from "../SPPD/DetailDokumenSPPD";
import { DetailDokumenPersonal } from "../SPPD/DetailDokumenPersonal";
import MainOutgoingDetail from "./Detail/Outgoing/MainOutgoingDetail";
import { DetailSuratDiunggah } from "./Detail/Outgoing/DetailSuratDiunggah";
import MainCuti from "../Cuti/MainCuti";
import { Libur } from "../Cuti/Libur";
import { TambahCutiBesar } from "../Cuti/TambahCutiBesar";
import { TambahCutiSakit } from "../Cuti/TambahCutiSakit";
import { TambahCutiMelahirkan } from "../Cuti/TambahCutiMelahirkan";
import { TambahCutiDiluarTanggungan } from "../Cuti/TambahCutiDiluarTanggungan";
import { TambahCutiTahunan } from "../Cuti/TambahCutiTahunan";
import { TambahCutiAlasanPenting } from "../Cuti/TambahCutiAlasanPenting";
import { DetailDokumenCuti } from "../Cuti/DetailDokumenCuti";
import {
  getMenuType,
  getTokenValue,
  removeMenu,
  removeMenuLite,
  removeMenuType,
  setMenuType,
  setPushNotif,
} from "../../service/session";
import { ListArsipCuti } from "../Cuti/ListArsipCuti";
import { PencarianKorespondensi } from "./Pencarian/PencarianKorespondensi";
import { KegiatanBaru } from "../SPPD/KegiatanBaru";
import LihatSuratSPPD from "../SPPD/LihatSuratSPPD";
import { Laporan } from "../Task Management/Dashboard/Laporan";
import { PdfPerisai } from "../DigitalSignature/PdfPerisai";
import MainKoresp from "./MainKoresp";
import IncomingList from "./List/IncomingList";
import DispositionList from "./List/DispositionList";
import TrackingList from "./List/TrackingList";
import SubmittedList from "./List/SubmittedList";
import NeedFollowUpList from "./List/NeedFollowUpList";
import { HDLaporanSaya } from "../SuperApps/HDLaporanSaya";
import { HDFormLaporan } from "../SuperApps/HDFormLaporan";
import { FileViewerRepo } from "../Repository/FileViewerRepo";
import { TandaTanganNotulensi } from "../Event Management/TandaTanganNotulensi";
import * as Linking from "expo-linking";
// import OneSignal from "react-native-onesignal";
import InternalSatkerList from "./List/InternalSatkerList";
import { SurveyLayanan } from "../Survey/SurveyLayanan";
import { HasilSurvey } from "../Survey/HasilSurvey";
import { DetailSurvey } from "../Survey/DetailSurvey";
import { Dialog } from "../../components/Dialog";
import { DeviceType, getDeviceTypeAsync } from "expo-device";
import { setDevice } from "../../store/Apps";
import { AppState } from "react-native";
import { BantuanPemerintah } from "../Dashboard/BantuanPemerintah";
import { KalenderPersonal } from "../KalenderPersonal/KalenderPersonal";
import { DetailKalenderPersonal } from "../KalenderPersonal/DetailKalenderPersonal";
import { FirstRenderIos } from "../FirstRenderIos";
import { LoginIos } from "../LoginIos";
import { RegisterIos } from "../RegisterIos";
import { PortalIos } from "../PortalIos";
import { DokumenLain } from "../DigitalSignature/DokumenLain";
import { Bankom } from "../DigitalSignature/Bankom";
import { AksiPerubahan } from "../AksiPerubahan/AksiPerubahan";
import { AksiPerubahanView } from "../AksiPerubahan/AksiPerubahanView";
import { MainSertifikat } from "../DigitalSignature/MainSertifikat";
import { SertifikatLms } from "../DigitalSignature/SertifikatLms";
import { DetailSertifikatEksternal } from "../DigitalSignature/DetailSertifikatEksternal";
import * as Sentry from "@sentry/react-native";
import {
  LogLevel,
  OneSignal,
  NotificationWillDisplayEvent,
} from "react-native-onesignal";
import Constants from "expo-constants";
import { setDataNotif } from "../../store/pushnotif";
import { COLORS } from "../../config/SuperAppps";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { setNotifIos, setTypeMenu } from "../../store/SuperApps";
import { ListFaq } from "../Faq/ListFaq";
import { IPASN } from "../Kepegawaian/IPASN";
import { MainPegawaiIPASN } from "../Kepegawaian/MainPegawaiIPASN";
import { DetailPegawaiIPASN } from "../Kepegawaian/DetailPegawaiIPASN";
import { Nominatif } from "../Kepegawaian/Nominatif";
import { NominatifList } from "../Kepegawaian/NominatifList";
import { PerizinanMenteri } from "../DigitalSignature/PerizinanMenteri";
import { DetailPerizinanMenteri } from "../DigitalSignature/DetailPerizinanMenteri";
import NeedSignList from "./List/NeedSignList";
import { ListAplikasiKepegawaian } from "../Kepegawaian/ListAplikasiKepegawaian";
import { LPMUKP } from "../Dashboard/LPMUKP";
import { DokumenSPPD } from "../SPPD/DokumenSPPD";
import { MainIPASN } from "../Kepegawaian/MainIPASN";
import { DataPribadi } from "../Kepegawaian/DataPribadi";
import { ListBanner } from "../SuperApps/ListBanner";
import { MainKalenderSatker } from "../KalenderSatker/MainKalenderSatker";
import { DetailKalenderSatker } from "../KalenderSatker/DetailKalenderSatker";
import { MainGrupKalender } from "../Kalender/MainGrupKalender";
import { BerbagiDokumen } from "../Repository/BerbagiDokumen";
import { TambahDokumenTamplate } from "../Repository/TambahDokumenTemplate";
import ViewerAnnotation from "../Repository/ViewerAnnotation";
import { DetailTinjauan } from "../Repository/DetailTinjauan";
import DispositionLembar from "./Form/DispositionLembar";
import { MainPerizinanMenteri } from "../DigitalSignature/MainPerizinanMenteri";
import TambahDokumenPerizinan from "../DigitalSignature/TambahDokumenPerizinan";
import { DetailPKRL } from "../DigitalSignature/DetailPKRL";
import { DetailDokumenSK } from "../DigitalSignature/DetailDokumenSK";
import { ProdukHukum } from "../ProdukHukum/ProdukHukum";
import { DetailProdukHukum } from "../ProdukHukum/DetailProdukHukum";

const Stack = createNativeStackNavigator();

function AuthenticatedStack({ route }) {
  const [isLoading, setIsLoading] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const deviceNIK = profile?.nik;
  const [deviceName, setDeviceName] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [deviceUUID, set_deviceUUID] = useState(null);
  const [deviceOS, setDeviceOS] = useState(null);
  const app_name = Config.app_name;
  const app_version = Config.app_version;
  const [modal, setModal] = useState(false);
  const appState = useRef(AppState.currentState);
  let data;
  const dispatch = useDispatch();

  useEffect(() => {
    // isEmulator();
    getMenuType().then((val) => {
      try {
        const parsedVal = JSON.parse(val);
        if (parsedVal === null) {
          setMenuType(JSON.stringify(false));
          dispatch(setTypeMenu(false));
        } else {
          dispatch(setTypeMenu(parsedVal));
        }
      } catch (e) {
        console.error("JSON Parse error:", e);
      }
    });
    // deviceRoot();
    //cek version di sini
    // const subscription = AppState.addEventListener("change", (nextAppState) => {
    //   if (
    //     appState.current.match(/inactive||background/) &&
    //     nextAppState === "active"
    //   ) {
    //     // checkversion
    //     if (Platform.OS === "android") {
    //       checkVersionAndroid();
    //     } else if (Platform.OS === "ios") {
    //       checkVersionIos();
    //     }
    //     appState.current = nextAppState;
    //   }
    // });
    // checkversion
    if (Platform.OS === "android") {
      checkVersionAndroid();
    } else if (Platform.OS === "ios") {
      checkVersionIos();
    }
    // return () => {
    //   subscription.remove();
    // };
  }, []);

  const isEmulator = () => {
    if (Device.isDevice === true) {
      console.log("device asli");
    } else {
      Alert.alert(
        "Peringatan!",
        "Anda menggunakan emulator, Harap menggunakan device asli",
        [
          {
            text: "Tutup",
            onPress: () => {
              BackHandler.exitApp();
            },
            style: "cancel",
          },
        ],
        {
          cancelable: false,
        }
      );
    }
  };

  const deviceRoot = async () => {
    const isRooted = await Device.isRootedExperimentalAsync();
    if (isRooted) {
      // console.log("Perangkat telah di-root.");
    } else {
      // console.log("Perangkat belum di-root.");
    }
  };

  async function checkVersionAndroid() {
    // setIsLoading(true);
    try {
      const response = await getHTTP(nde_api.getVersionAndroid);
      // cekValidVersion(response?.data?.results?.android);
      // setIsLoading(false);
      if (response?.data?.results?.android > app_version) {
        setTimeout(() => {
          setModal(true);
        }, 3000);
      }
    } catch (error) {
      if (error.status == null) {
        Alert.alert("Peringatan!", "Mohon periksa koneksi internet anda");
      } else {
        handlerError(error, "Peringatan!", "Cek versi tidak berfungsi!");
      }
    }
    // setIsLoading(false);
  }
  async function checkVersionIos() {
    try {
      const response = await getHTTP(nde_api.getVersionAndroid);
      // cekValidVersion(response?.data?.results?.android);
      // setIsLoading(false);
      if (response?.data?.results?.android > app_version) {
        setTimeout(() => {
          setModal(true);
        }, 3000);
      }
    } catch (error) {
      if (error.status == null) {
        Alert.alert("Peringatan!", "Mohon periksa koneksi internet anda");
      } else {
        handlerError(error, "Peringatan!", "Cek versi tidak berfungsi!");
      }
    }
  }
  function cekValidVersion(server_version) {
    if (server_version > app_version) {
      // Alert.alert(
      //   "Peringatan!",
      //   "Anda menggunakan versi lama " +
      //     app_name +
      //     ". Segera lakukan pembaharuan untuk dapat mengakses aplikasi",
      //   [
      //     {
      //       text: "Perbaharui",
      //       onPress: () => {
      //         // getToken();
      //         // getProfile();
      //         // getTokenValue().then((val) => {
      //         //   if (val !== "") {
      //         //     removeTokenValue();
      //         //     dispatch(setLogout());
      //         //     dispatch(setProfile({}));
      //         //     navigation.reset({
      //         //       index: 0,
      //         //       routes: [{ name: "LoginToken" }],
      //         //     });
      //         //   }
      //         // });
      //         handleUpgradeLink();
      //         // console.log("test");
      //       },
      //       style: "cancel",
      //     },
      //   ],
      //   {
      //     cancelable: false,
      //     onDismiss: () => {
      //       // getToken();
      //       // getProfile();
      //     },
      //   }
      // );
      setModal(true);
      // AsyncStorage.removeItem("token");
      // dispatch(setValidVersion(false));
    } else {
      // dispatch(setValidVersion(true));
      // getToken();
      // getProfile();
      setModal(false);
    }
  }
  const getDeviceUUIDiOS = async () => {
    set_deviceUUID(await Application.getIosIdForVendorAsync());
    if (deviceUUID != undefined && deviceUUID != null) {
      dispatch(setDeviceUUID(deviceUUID));
    }
  };

  const getDeviceId = async () => {
    // const deviceState = await OneSignal.getDeviceState();
    // if (deviceState != undefined && deviceState != null) {
    //   setDeviceId(deviceState?.userId);
    // }
  };

  async function checkDevice() {
    try {
      if (
        deviceNIK != undefined &&
        deviceNIK != null &&
        deviceUUID != undefined &&
        deviceUUID != null &&
        deviceId != undefined &&
        deviceId != null &&
        deviceName != null &&
        deviceName != undefined &&
        deviceOS != null &&
        deviceOS != undefined
      ) {
        data = {
          fullname: deviceNIK,
          device_id: deviceId,
          device_uuid: deviceUUID,
          device_name: deviceName,
          os: deviceOS,
        };
        //send data
        const response = await postHTTP(nde_api.checkdevice, data);
        // Alert.alert(
        //   "Info check device",
        //   JSON.stringify(response?.data?.message)
        // );
      } else {
        // Alert.alert("Warning!", "Push notification may not work"+deviceNIK+"-"+deviceId+"-"+deviceUUID+"-"+deviceName+"-"+deviceOS);
      }
    } catch (error) {
      // Alert.alert("Warning!", "Push notification may not work" + error);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getDeviceId(); //get player id device id
    setDeviceName(Device.modelName);
    setDeviceOS(Device.osName + " " + Device.osVersion);
    if (Platform.OS == "android") {
      set_deviceUUID(androidId);
      dispatch(setDeviceUUID(androidId));
    } else {
      getDeviceUUIDiOS();
    }
    checkDevice();
  }, [profile, deviceUUID, deviceId, deviceName, deviceOS]);
  const { device } = useSelector((state) => state.apps);

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.rootScreen}>
        <StatusBar
          barStyle={Config.statusbarAuthenticated}
          backgroundColor={GlobalStyles.colors.secondary}
        />

        <Dialog
          title={"Peringatan !"}
          content={
            "Anda menggunakan versi lama " +
            app_name +
            ". Segera lakukan pembaharuan untuk dapat mengakses aplikasi"
          }
          buttonTitle={"Perbaharui"}
          modal={modal}
        />

        <Stack.Navigator
          initialRouteName={route}
          screenOptions={{
            orientation: device === "tablet" ? "default" : "portrait",
          }}
        >
          <Stack.Screen
            name="LoginToken"
            component={LoginToken}
            options={{
              headerShown: false,
              // gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="FirstRenderIos"
            component={FirstRenderIos}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="LoginIos"
            component={LoginIos}
            options={{
              headerShown: false,
              // gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="RegisterIOs"
            component={RegisterIos}
            options={{
              headerShown: false,
              // gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="PortalIos"
            component={PortalIos}
            options={{
              headerShown: false,
              // gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Main"
            component={Main}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="MainRepo"
            component={MainRepo}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="MainKeb"
            component={MainKeb}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="MainDetailRepo"
            component={MainDetailRepo}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="KalenderPersonal"
            component={KalenderPersonal}
            options={{
              headerShown: false,
              // gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="DetailKalenderPersonal"
            component={DetailKalenderPersonal}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailKalenderSatker"
            component={DetailKalenderSatker}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainKalender"
            component={MainKalender}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="MainGrupKalender"
            component={MainGrupKalender}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="MainKalenderSatker"
            component={MainKalenderSatker}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Drawer"
            component={DrawerNavigator}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="ListBerita"
            component={ListBerita}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ListBanner"
            component={ListBanner}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ListBeritaSatker"
            component={ListBeritaSatker}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Tp"
            component={Tp}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailBerita"
            component={DetailBerita}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahGrup"
            component={TambahGrup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahAgenda"
            component={TambahAgenda}
            options={{
              headerShown: false,
            }}
          />
          {/* TAB DETAIL LETTER */}
          <Stack.Screen
            name="AgendaDetail"
            component={AgendaDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailAttachment"
            component={DetailAttachment}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DetailComment"
            component={DetailComment}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DetailLog"
            component={DetailLog}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DetailDispo"
            component={DetailDispo}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="LetterDetail"
            component={LetterDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DetailPreview"
            component={DetailPreview}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="ViewAttachment"
            component={ViewAttachment}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="ReferenceDetail"
            component={ReferenceDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="TrackingLogDetail"
            component={TrackingLogDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="ScanLogDetail"
            component={ScanLogDetail}
            options={{ header: toolbarBack }}
          />
          {/* FORM */}
          <Stack.Screen
            name="DelegationForm"
            component={DelegationForm}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="SecretaryForm"
            component={SecretaryForm}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DispositionForm"
            component={DispositionForm}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DispositionLembar"
            component={DispositionLembar}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="ForwardForm"
            component={ForwardForm}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="AddressbookEmployee"
            component={AddressbookEmployee}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="AddressbookTitle"
            component={AddressbookTitle}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="Addressbook"
            component={Addressbook}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="AddressbookKM"
            component={AddressbookKM}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DigisignSearchEmail"
            component={DigisignSearchEmail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="Dokumen"
            component={Dokumen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailActivity"
            component={DetailActivity}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="FileViewerRepo"
            component={FileViewerRepo}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ViewerAnnotation"
            component={ViewerAnnotation}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailTinjauan"
            component={DetailTinjauan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MyTask"
            component={MyTask}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Laporan"
            component={Laporan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="HDLaporanSaya"
            component={HDLaporanSaya}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="HDFormLaporan"
            component={HDFormLaporan}
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
                name="MainKalender"
                component={MainKalender}
                options={{
                  headerShown: false,
                  gestureEnabled: false
                }}
              /> */}
          <Stack.Screen
            name="GrupKalender"
            component={GrupKalender}
            options={{
              headerShown: false,
              // gestureEnabled: false
            }}
          />
          <Stack.Screen
            name="DetailBeritaSatker"
            component={DetailBeritaSatker}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ListGaleri"
            component={ListGaleri}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditGrup"
            component={EditGrup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditAgendaGrup"
            component={EditAgendaGrup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailGrup"
            component={DetailGrup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailAcara"
            component={DetailAcara}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailAcaraAgenda"
            component={DetailAcaraAgenda}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ListSuka"
            component={ListSuka}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddTask"
            component={AddTask}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditTask"
            component={EditTask}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddCategory"
            component={AddCategory}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditCategory"
            component={EditCategory}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainDetailTask"
            component={MainDetailTask}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainDetailKorespondensiTM"
            component={MainDetailKorespondensiTM}
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
            name="Bankom"
            component={Bankom}
            options={{
              headerShown: false,
            }}
          /> */}
          <Stack.Screen
            name="DokumenLain"
            component={DokumenLain}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailDokumenLain"
            component={DetailDokumenLain}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Kepegawaian"
            component={Kepegawaian}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailPengumuman"
            component={DetailPengmuman}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ProduksiBudidaya"
            component={ProduksiBudidaya}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailTeknologi"
            component={DetailTeknologi}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainPengetahuan"
            component={MainPengetahuan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailLinimasa"
            component={DetailLinimasa}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ListSukaLinimasa"
            component={ListSukaLinimasa}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="JumlahPostingan"
            component={JumlahPostingan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PostinganBaru"
            component={PostinganBaru}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ListPostinganPegawai"
            component={ListPostinganPegawai}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="FileViewer"
            component={FileViewer}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ListPegawai"
            component={ListPegawai}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SurveyLayanan"
            component={SurveyLayanan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="HasilSurvey"
            component={HasilSurvey}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailSurvey"
            component={DetailSurvey}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailProfile"
            component={DetailProfile}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainDigitalSign"
            component={MainDigitalSign}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainSertifikat"
            component={MainSertifikat}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailSertifikat"
            component={DetailSertifikat}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PdfPerisai"
            component={PdfPerisai}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahSertifikat"
            component={TambahSertifikat}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahDokumenLain"
            component={TambahDokumenLain}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailPenilain"
            component={DetailPenilaian}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="HalamanUtama"
            component={HalamanUtama}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailEvent"
            component={DetailEvent}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainDetailEvent"
            component={MainDetailEvent}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainDetailAgenda"
            component={MainDetailAgenda}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Notulensi"
            component={Notulensi}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailTodo"
            component={DetailTodo}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahEvent"
            component={TambahEvent}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahAgendaEvent"
            component={TambahAgendaEvent}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahTodo"
            component={TambahTodo}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailAbsen"
            component={DetailAbsen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ScannerBarCode"
            component={ScannerBarCode}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TandaTanganNotulensi"
            component={TandaTanganNotulensi}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditEvent"
            component={EditEvent}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahSubAgenda"
            component={TambahSubAgenda}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditSubAgenda"
            component={EditSubAgenda}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditTodo"
            component={EditTodo}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Penangkapan"
            component={Penangkapan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Keuangan"
            component={Keuangan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BantuanPemerintah"
            component={BantuanPemerintah}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainOutgoingDetail"
            component={MainOutgoingDetail}
            options={{
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailSuratDiunggah"
            component={DetailSuratDiunggah}
            options={{
              header: toolbarBack,
              title: "Detail Surat Keluar",
            }}
          />
          <Stack.Screen
            name="DetailDashboard"
            component={DetailDashboard}
            options={{
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PdfViewer"
            component={PdfViewer}
            options={{
              headerTitle: "",
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="TermOfUse"
            component={TermOfUse}
            options={{
              header: toolbarBack,
            }}
          />
          <Stack.Screen
            name="AddressBook"
            component={AddressBook}
            options={{
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainKoresp"
            component={MainKoresp}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="IncomingUnread"
            component={IncomingList}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DispositionUnread"
            component={DispositionList}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="InternalUnread"
            component={InternalSatkerList}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="IncomingList"
            component={IncomingList}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="InternalSatkerList"
            component={InternalSatkerList}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DispositionList"
            component={DispositionList}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="NeedFollowUpList"
            component={NeedFollowUpList}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="NeedSignList"
            component={NeedSignList}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="TrackingList"
            component={TrackingList}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="SubmittedList"
            component={SubmittedList}
            options={{ header: toolbarBack }}
          />
          {/* DETAIL LETTER */}
          <Stack.Screen
            name="IncomingDetail"
            component={IncomingDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DispositionDetail"
            component={DispositionDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="SubmittedDetail"
            component={SubmittedDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="NeedFollowUpDetail"
            component={NeedFollowUpDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="TrackingDetail"
            component={TrackingDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="DelegationDetail"
            component={DelegationDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="SecretaryDetail"
            component={SecretaryDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="TodoDetail"
            component={TodoDetail}
            options={{ header: toolbarBack }}
          />
          <Stack.Screen
            name="MainSPPD"
            component={MainSPPD}
            options={{
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailDokumenSPPD"
            component={DetailDokumenSPPD}
            options={{
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailDokumenPersonal"
            component={DetailDokumenPersonal}
            options={{
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainCuti"
            component={MainCuti}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DokumenSPPD"
            component={DokumenSPPD}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Libur"
            component={Libur}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahCutiBesar"
            component={TambahCutiBesar}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahCutiSakit"
            component={TambahCutiSakit}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahCutiMelahirkan"
            component={TambahCutiMelahirkan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahCutiDiluarTanggungan"
            component={TambahCutiDiluarTanggungan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahCutiTahunan"
            component={TambahCutiTahunan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahCutiAlasanPenting"
            component={TambahCutiAlasanPenting}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailDokumenCuti"
            component={DetailDokumenCuti}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ListArsipCuti"
            component={ListArsipCuti}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="KegiatanBaru"
            component={KegiatanBaru}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Pencarian"
            component={PencarianKorespondensi}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LihatSuratSPPD"
            component={LihatSuratSPPD}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AksiPerubahan"
            component={AksiPerubahan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AksiPerubahanView"
            component={AksiPerubahanView}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LaporanDigitalSign"
            component={LaporanDigitalSign}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailSertifikatEksternal"
            component={DetailSertifikatEksternal}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ListFaq"
            component={ListFaq}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainIPASN"
            component={MainIPASN}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DataPribadi"
            component={DataPribadi}
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
            name="MainPegawaiIPASN"
            component={MainPegawaiIPASN}
            options={{
              headerShown: false,
            }}
          /> */}
          <Stack.Screen
            name="DetailPegawaiIPASN"
            component={DetailPegawaiIPASN}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Nominatif"
            component={Nominatif}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NominatifList"
            component={NominatifList}
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
            name="PerizinanMenteri"
            component={PerizinanMenteri}
            options={{
              headerShown: false,
            }}
          /> */}
          <Stack.Screen
            name="DetailPerizinanMenteri"
            component={DetailPerizinanMenteri}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailPKRL"
            component={DetailPKRL}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailDokumenSK"
            component={DetailDokumenSK}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainPerizinanMenteri"
            component={MainPerizinanMenteri}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahDokumenPerizinan"
            component={TambahDokumenPerizinan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ListAplikasiKepegawaian"
            component={ListAplikasiKepegawaian}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LPMUKP"
            component={LPMUKP}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BerbagiDokumen"
            component={BerbagiDokumen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TambahDokumenTamplate"
            component={TambahDokumenTamplate}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ProdukHukum"
            component={ProdukHukum}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetailProdukHukum"
            component={DetailProdukHukum}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>

        {loadingOverlay}
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

function AppNavigator() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.login);
  const [route, setRoute] = useState("");

  const prefix = Linking.createURL("/");

  const [linking, setLinking] = useState();

  Sentry.init({
    dsn: "https://8d6b71eba2221c3262ecc7d04229bf2b@sentry.armsolusi.com/5",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // //Method for handling notifications received while app in foreground
  // OneSignal.setNotificationWillShowInForegroundHandler(
  //   (notificationReceivedEvent) => {
  //     let notification = notificationReceivedEvent.getNotification();
  //     const data = notification?.additionalData;
  //     //Silence notification by calling complete() with no argument
  //     notificationReceivedEvent.complete(notification);
  //   }
  // );

  // //Method for handling notifications opened
  // OneSignal.setNotificationOpenedHandler((openedEvent) => {
  //   // const { action, notification } = openedEvent;
  //   // dispatch(setDataNotif(notification?.additionalData));
  // })

  OneSignal.Notifications.addEventListener("foregroundWillDisplay", (event) => {
    event.getNotification().display();
    event.notification.display();
  });

  OneSignal.Notifications.addEventListener("click", (event) => {
    setPushNotif(event?.notification?.additionalData);
    dispatch(setNotifIos(true));
    console.log("navigator", event.notification);
    // dispatch(setDataNotif(notification?.additionalData));
  });

  useEffect(() => {
    const deviceTypeMap = {
      [DeviceType.UNKNOWN]: "unknown",
      [DeviceType.PHONE]: "phone",
      [DeviceType.TABLET]: "tablet",
      [DeviceType.TV]: "tv",
      [DeviceType.DESKTOP]: "desktop",
    };
    getDeviceTypeAsync()
      .then((device) => {
        dispatch(setDevice(deviceTypeMap[device]));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getTokenValue().then((val) => {
      if (val === null) {
        setRoute("LoginToken");
        setLinking({
          prefixes: [prefix, "https://portal.kkp.go.id/"],
          config: {
            initialRouteName: "LoginToken",
            screens: {
              DetailLinimasa: "apps/KnowledgeManagement/detail/:id/:id_user",
            },
          },
        });
      } else {
        setRoute("Main");
        setLinking({
          prefixes: [prefix, "https://portal.kkp.go.id/"],
          config: {
            initialRouteName: "Main",
            screens: {
              DetailLinimasa: "apps/KnowledgeManagement/detail/:id/:id_user",
            },
          },
        });
      }
      setIsLoading(false);
    });
  }, [route]);

  async function getToken() {
    setIsLoading(true);
    //get token
    let token;
    getTokenValue.then((data) => {
      token = data;
    });
    if (token != null) {
      // setIsAuthenticated(true);
      let data = { token: token };
      dispatch(setToken(data));
    }
    setIsLoading(false);
  }
  async function getProfile() {
    setIsLoading(true);
    let profile;
    await AsyncStorage.getItem("profileLogin").then((data) => {
      profile = JSON.parse(data);
    });
    if (profile != null) {
      dispatch(setProfile(profile));
    }
    setIsLoading(false);
  }

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <>
      <Host>
        {/* awas lupa */}
        <NavigationContainer linking={!token ? null : linking}>
          {/* {!isLoading && isToken == null && <AuthStack />} */}
          {!isLoading && route !== "" && <AuthenticatedStack route={route} />}
        </NavigationContainer>
        {loadingOverlay}
      </Host>
    </>
  );
}

export default Sentry.wrap(AppNavigator);
// export default AppNavigator;

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 350,
  },
  backgroundImage: {
    resizeMode: "cover",
    alignSelf: "flex-start",
  },
});
