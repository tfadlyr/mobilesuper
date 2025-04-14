import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Host } from "react-native-portalize";
import MyTabBar from "../Apps/SuperApps/BottomTabs";
import { Home } from "../Apps/SuperApps/Home";
import { Satker } from "../Apps/SuperApps/Satker";
import { HelpDesk } from "../Apps/SuperApps/HelpDesk";
import { Profile } from "../Apps/SuperApps/Profile";
import MyTabBarRepo from "../Apps/Repository/BottomTabsRepo";
import { Dokumen } from "../Apps/Repository/Dokumen";
import { Dibagikan } from "../Apps/Repository/Dibagikan";
import { DokumenTamplate } from "../Apps/Repository/DokumenTamplate";
import MyTabBarKeb from "../Apps/Kebijakan/BottomtabsKeb";
import Dashboard from "../Apps/Kebijakan/Dashboard";
import { Tematik } from "../Apps/Kebijakan/Tematik";
import MyTabBarDetailRepo from "../Apps/Repository/BottomTabsDetailRepo";
import { DetailActivity } from "../Apps/Repository/DetailActivity";
import { Lampiran } from "../Apps/Repository/Lampiran";
import { Komentar } from "../Apps/Repository/Komentar";
import MyTabBarKal from "../Apps/Kalender/BottomTabsKal";
import { GrupKalender } from "../Apps/Kalender/GrupKalender";
import { Agenda } from "../Apps/Kalender/Agenda";
import MyTabBarDetailTask from "../Apps/Task Management/DetailTask/BottmTabsDetailTask";
import { DetailTask } from "../Apps/Task Management/DetailTask/DetailTask";
import { LampiranTask } from "../Apps/Task Management/DetailTask/LampiranTask";
import MyTabDigitalSign from "../Apps/DigitalSignature/BottomTabsDigitalSign";
import { Bankom } from "../Apps/DigitalSignature/Bankom";
import { DokumenLain } from "../Apps/DigitalSignature/DokumenLain";
import { DokumenMonitoring } from "../Apps/DigitalSignature/DokumenMonitoring";
import { LaporanDigitalSign } from "../Apps/DigitalSignature/LaporanDigitalSign";
import MyTabBarPengetahuan from "../Apps/Pengetahuan/BottomTabsPengetahuan";
import { LiniMasa } from "../Apps/Pengetahuan/LiniMasa";
import { PostinganSaya } from "../Apps/Pengetahuan/PostinganSaya";
import { RangkumanIKU } from "../Apps/Pengetahuan/RangkumanIKU";
import { PenilaianPenggetahaun } from "../Apps/Pengetahuan/PenilaianPengetahuan";
import { LaporanPengetahuan } from "../Apps/Pengetahuan/LaporanPengetahuan";
import MyTabDetailEvent from "../Apps/Event Management/BottomTabsDetailEvent";
import { DetailEvent } from "../Apps/Event Management/DetailEvent";
import { AgendaEvent } from "../Apps/Event Management/AgendaEvent";
import MyTabDetailAgenda from "../Apps/Event Management/BottomTabsDetailAgenda";
import { DetailAgenda } from "../Apps/Event Management/DetailAgenda";
import { Todo } from "../Apps/Event Management/Todo";
import { Absen } from "../Apps/Event Management/Absen";
import MyTabBarSPPD from "../Apps/SPPD/BottomTabsSPPD";
import { Personal } from "../Apps/SPPD/Personal";
import { DokumenSPPD } from "../Apps/SPPD/DokumenSPPD";
import MyTabBarOutgoingKorespondensi from "../Apps/Korespondensi/Detail/Outgoing/BottomTabsOutgoingKorespondensi";
import { InfoOutgoindDetail } from "../Apps/Korespondensi/Detail/Outgoing/InfoOutgoindDetail";
import { FileOutgoingDetail } from "../Apps/Korespondensi/Detail/Outgoing/FileOutgoingDetail";
import { AttachmentOutgoingDetail } from "../Apps/Korespondensi/Detail/Outgoing/AttachmentOutgoingDetail";
import { KomentarOutgoingDetail } from "../Apps/Korespondensi/Detail/Outgoing/KomentarOutgoingDetail";
import MyTabCuti from "../Apps/Cuti/BottomTabsCuti";
import { PersonalCuti } from "../Apps/Cuti/PersonalCuti";
import { PersetujanCuti } from "../Apps/Cuti/PersetujanCuti";
import { DokumenCuti } from "../Apps/Cuti/DokumenCuti";
import { KRT } from "../Apps/SuperApps/KRT";
import { Pengawasan } from "../Apps/SuperApps/Pengawasan";
import { KPP } from "../Apps/SuperApps/KPP";
import { BackLog } from "../Apps/Task Management/Task/BackLog";
import { InProgres } from "../Apps/Task Management/Task/InProgres";
import { Pending } from "../Apps/Task Management/Task/Pending";
import { Complete } from "../Apps/Task Management/Task/Complete";
import { HariIni } from "../Apps/Task Management/Dashboard/HariIni";
import { MingguIni } from "../Apps/Task Management/Dashboard/MingguIni";
import { Terlewat } from "../Apps/Task Management/Dashboard/Terlewat";
import { Demografi } from "../Apps/Dashboard/Demografi";
import { Penilaian } from "../Apps/Dashboard/Penilaian";
import { Pelatihan } from "../Apps/Dashboard/Pelatihan";
import { Absensi } from "../Apps/Dashboard/Absensi";
import { Kesejahteraan } from "../Apps/Dashboard/Kesejahteraan";
import { Perencanaan } from "../Apps/Dashboard/Perencanaan";
import { Produksi } from "../Apps/Dashboard/Produksi";
import { TeknologiTerbaru } from "../Apps/Dashboard/TeknologiTerbaru";
import { APBN } from "../Apps/Dashboard/APBN";
import { PNBP } from "../Apps/Dashboard/PNPB";
import { IKU } from "../Apps/Dashboard/IKU";
import { AddressBookJabatan } from "../Apps/AddressBookJabatan";
import { AddressBookPegawai } from "../Apps/AddressBookPegawai";
import { COLORS, FONTWEIGHT, fontSizeResponsive } from "../config/SuperAppps";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PAll } from "../Apps/Korespondensi/Pencarian/PAll";
import { PIncoming } from "../Apps/Korespondensi/Pencarian/PIncoming";
import { PDisposition } from "../Apps/Korespondensi/Pencarian/PDisposition";
import { PSubmitted } from "../Apps/Korespondensi/Pencarian/PSubmitted";
import { Pencarian } from "../Apps/Kebijakan/Pencarian";
import { PencarianKorespondensi } from "../Apps/Korespondensi/Pencarian/PencarianKorespondensi";
import MyTabKoresp from "../Apps/Korespondensi/BottomTabsKoresp";
import DCounter from "../Apps/Korespondensi/Dashboard/DCounter";
import DLetter from "../Apps/Korespondensi/Dashboard/DLetter";
import { Arsip } from "../Apps/Task Management/Korespondensi/Arsip";
import { TerlewatKorespondensi } from "../Apps/Task Management/Korespondensi/TerlewatKorespondensi";
import { HariIniKorespondensi } from "../Apps/Task Management/Korespondensi/HariIniKorespondensi";
import { MingguDepanKorespondensi } from "../Apps/Task Management/Korespondensi/MingguDepanKorespondensi";
import { useSelector } from "react-redux";
import MyTabBarDetailKorespondensi from "../Apps/Task Management/DetailKorespondensiTM/BottmTabsDetailKorespondensi";
import { DetailKorespondensiTM } from "../Apps/Task Management/DetailKorespondensiTM/DetailKorespondensiTM";
import { Dimensions, Platform, View, useWindowDimensions } from "react-native";
import { AddressbookPara } from "../Apps/AddressbookPara";
import { Kusuka } from "../Apps/Dashboard/Kusuka";
import { P3KENonKusuka } from "../Apps/Dashboard/P3KENonKusuka";
import { BBMSubsidiKusuka } from "../Apps/Dashboard/BBMSubsidiKusuka";
import { BBMNonSubsidiKusuka } from "../Apps/Dashboard/BBMNonSubsidiKusuka";
import { P3KEKusuka } from "../Apps/Dashboard/P3KEKusuka";
import { Deviasi } from "../Apps/Dashboard/Deviasi";
import { KalenderPersonal } from "../Apps/KalenderPersonal/KalenderPersonal";
import { Verifikasi } from "../Apps/DigitalSignature/Verifikasi";
import { MyTabSertifikat } from "../Apps/DigitalSignature/BottomTabsSertifikat";
import { SertifikatLms } from "../Apps/DigitalSignature/SertifikatLms";
import { SertifikatEksternal } from "../Apps/DigitalSignature/SertifikatEksternal";
import { ROPEGIPASN } from "../Apps/Dashboard/ROPEGIPASN";
import MyTabPegawiIPASN from "../Apps/Kepegawaian/BottomTabsPegawaiIPASN";
import { PegawaiIPASN } from "../Apps/Kepegawaian/PegawaiIPASN";
import { DataPribadi } from "../Apps/Kepegawaian/DataPribadi";
// Faq
import { DashboardDanReport } from "../Apps/Faq/DashboardDanReport";
import { Regulasi } from "../Apps/Faq/Regulasi";
import { AplikasiPortalKKP } from "../Apps/Faq/AplikasiPortalKKP";
import { PengembanganKompetensi } from "../Apps/Faq/PengembanganKompetensi";
import { SuperApps } from "../Apps/Faq/SuperApps";
import { LPMUKP } from "../Apps/Dashboard/LPMUKP";
import { MenuDashboard } from "../Apps/SuperApps/MenuDashboard";
import { DetailAPBN } from "../Apps/Dashboard/DetailAPBN";
import { IPASN } from "../Apps/Kepegawaian/IPASN";
import MyTabIPASN from "../Apps/Kepegawaian/BottomTabsIPASN";
import { AddressbookFavorit } from "../Apps/AddressbookFavorit";
import { RekapKepegawaian } from "../Apps/Dashboard/RekapKepegawaian";
import { KalenderSatker } from "../Apps/KalenderSatker/KalenderSatker";
import MyTabBarKalSatker from "../Apps/KalenderSatker/BottomTabsKalSatker";
import MyTabBarGrupKal from "../Apps/Kalender/BottomTabsKalGrupPersonal";
import { Tinjauan } from "../Apps/Repository/Tinjauan";
import { PerizinanMenteri } from "../Apps/DigitalSignature/PerizinanMenteri";
import { MyTabPerizinanMenteri } from "../Apps/DigitalSignature/BottomTabsPerizinanMenteri";
import { PKRL } from "../Apps/DigitalSignature/PKRL";
import { DokumenSK } from "../Apps/DigitalSignature/DokumenSK";
import { DashboardPKRL } from "../Apps/DigitalSignature/DashboardPKRL";

const Tab = createBottomTabNavigator();
const Top = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get("window");
export const BottomTabs = () => {
  return (
    <Host>
      <BottomSheetModalProvider>
        <Tab.Navigator
          tabBar={(props) => <MyTabBar {...props} />}
          initialRouteName="Home"
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Satker"
            component={Satker}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="HelpDesk"
            component={HelpDesk}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="MenuDashboard"
            component={MenuDashboard}
            options={{ headerShown: false }}
          />
          {/* <Tab.Screen name='Tp' component={Tp} options={{ headerShown: false }} /> */}
          {/* <Tab.Screen name='Kebijakan' component={DrawerNavigation}
          options={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
            tabBarItemStyle: { display: 'none' }
      
        /> */}
        </Tab.Navigator>
      </BottomSheetModalProvider>
    </Host>
  );
};

export const BottomTabsKoresp = () => {
  return (
    <Host>
      <BottomSheetModalProvider>
        <Tab.Navigator
          tabBar={(props) => <MyTabKoresp {...props} />}
          initialRouteName="DCounter"
        >
          <Tab.Screen
            name="DCounter"
            component={DCounter}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="DLetter"
            component={DLetter}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="DPencarian"
            component={PencarianKorespondensi}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </BottomSheetModalProvider>
    </Host>
  );
};
export const BottomTabsRepo = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
          width: "100%",
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabBarRepo {...props} />}
          initialRouteName="Dokumen"
        >
          <Tab.Screen
            name="Dokumen"
            component={Dokumen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Dibagikan"
            component={Dibagikan}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Tinjauan"
            component={Tinjauan}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="DokumenTamplate"
            component={DokumenTamplate}
            options={{ headerShown: false }}
          />
          {/* <Tab.Screen name='Kebijakan' component={DrawerNavigation}
          options={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
            tabBarItemStyle: { display: 'none' }
          }}
        /> */}
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsKeb = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabBarKeb {...props} />}
          initialRouteName="Pencarian"
        >
          <Tab.Screen
            name="Pencarian"
            component={Pencarian}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Tematik"
            component={Tematik}
            options={{ headerShown: false }}
          />
          {/* <Tab.Screen name='Pencarian' component={Pencarian}
          options={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
            tabBarItemStyle: { display: 'none' }
          }}
        /> */}
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsDetailRepo = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabBarDetailRepo {...props} />}
          initialRouteName="DetailActivity"
        >
          <Stack.Screen
            name="DetailActivity"
            component={DetailActivity}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Lampiran"
            component={Lampiran}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Komentar"
            component={Komentar}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsKalender = () => {
  return (
    <BottomSheetModalProvider>
      <Tab.Navigator
        tabBar={(props) => <MyTabBarKal {...props} />}
        initialRouteName="GrupKalender"
      >
        <Tab.Screen
          name="GrupKalender"
          component={GrupKalender}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="KalenderPersonal"
          component={KalenderPersonal}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="KalenderSatker"
          component={KalenderSatker}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsGrupKalender = () => {
  return (
    <BottomSheetModalProvider>
      <Tab.Navigator
        tabBar={(props) => <MyTabBarGrupKal {...props} />}
        initialRouteName="GrupKalender"
      >
        <Tab.Screen
          name="GrupKalender"
          component={GrupKalender}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="KalenderPersonal"
          component={KalenderPersonal}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsKalenderSatker = () => {
  return (
    <BottomSheetModalProvider>
      <Tab.Navigator
        tabBar={(props) => <MyTabBarKalSatker {...props} />}
        initialRouteName="KalenderPersonal"
      >
        <Tab.Screen
          name="KalenderPersonal"
          component={KalenderPersonal}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="KalenderSatker"
          component={KalenderSatker}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsDetailTask = () => {
  return (
    <BottomSheetModalProvider>
      <Tab.Navigator
        tabBar={(props) => <MyTabBarDetailTask {...props} />}
        initialRouteName="DetailTask"
      >
        <Tab.Screen
          name="DetailTask"
          component={DetailTask}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="LampiranTask"
          component={LampiranTask}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsDetailKorespondensi = () => {
  return (
    <BottomSheetModalProvider>
      <Tab.Navigator
        tabBar={(props) => <MyTabBarDetailKorespondensi {...props} />}
        initialRouteName="DetailKorespondensiTM"
      >
        <Tab.Screen
          name="DetailKorespondensiTM"
          component={DetailKorespondensiTM}
          options={{ headerShown: false }}
        />
        {/* <Tab.Screen
          name="LampiranTask"
          component={LampiranTask}
          options={{ headerShown: false }}
        /> */}
      </Tab.Navigator>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsDigitalSign = ({ route }) => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabDigitalSign {...props} route={route} />}
          initialRouteName={route?.params?.screen || "DokumenLain"}
        >
          <Tab.Screen
            name="DokumenLain"
            component={DokumenLain}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Verifikasi"
            component={Verifikasi}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="DokumenSK"
            component={DokumenSK}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="DokumenMonitoring"
            component={DokumenMonitoring}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsSertifikat = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabSertifikat {...props} />}
          initialRouteName="Bankom"
        >
          <Tab.Screen
            name="Bankom"
            component={Bankom}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="SertifikatLms"
            component={SertifikatLms}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="SertifikatEksternal"
            component={SertifikatEksternal}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsPerizinanMenteri = ({ route }) => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabPerizinanMenteri {...props} route={route} />}
          initialRouteName={route?.params?.screen || "PKRL"}
        >
          <Tab.Screen
            name="PerizinanMenteri"
            component={PerizinanMenteri}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="PKRL"
            component={PKRL}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="DashboardPKRL"
            component={DashboardPKRL}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsPengetahuan = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabBarPengetahuan {...props} />}
          initialRouteName="LiniMasa"
        >
          <Tab.Screen
            name="LiniMasa"
            component={LiniMasa}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="PostinganSaya"
            component={PostinganSaya}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="RangkumanIKU"
            component={RangkumanIKU}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="PenilaianPenggetahaun"
            component={PenilaianPenggetahaun}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="LaporanPengetahuan"
            component={LaporanPengetahuan}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsDetailEvent = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabDetailEvent {...props} />}
          initialRouteName="DetailEvent"
        >
          <Tab.Screen
            name="DetailEvent"
            component={DetailEvent}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="AgendaEvent"
            component={AgendaEvent}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsDetailAgenda = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabDetailAgenda {...props} />}
          initialRouteName="DetailAgenda"
        >
          <Tab.Screen
            name="DetailAgenda"
            component={DetailAgenda}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Todo"
            component={Todo}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Absen"
            component={Absen}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsSPPD = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabBarSPPD {...props} />}
          initialRouteName="Personal"
        >
          <Tab.Screen
            name="Personal"
            component={Personal}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="DokumenSPPD"
            component={DokumenSPPD}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsOutgoingKorespondensi = () => {
  return (
    <BottomSheetModalProvider>
      <Tab.Navigator
        tabBar={(props) => <MyTabBarOutgoingKorespondensi {...props} />}
        initialRouteName="InfoOutgoindDetail"
      >
        <Tab.Screen
          name="InfoOutgoindDetail"
          component={InfoOutgoindDetail}
          options={{ header: toolbarBack, title: "Detail Surat Keluar" }}
        />
        <Tab.Screen
          name="FileOutgoingDetail"
          component={FileOutgoingDetail}
          options={{ header: toolbarBack, title: "Detail Surat Keluar" }}
        />
        <Tab.Screen
          name="AttachmentOutgoingDetail"
          component={AttachmentOutgoingDetail}
          options={{ header: toolbarBack, title: "Detail Surat Keluar" }}
        />
        <Tab.Screen
          name="KomentarOutgoingDetail"
          component={KomentarOutgoingDetail}
          options={{ header: toolbarBack, title: "Detail Surat Keluar" }}
        />
      </Tab.Navigator>
    </BottomSheetModalProvider>
  );
};
export const BottomTabsCuti = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabCuti {...props} />}
          initialRouteName="PersetujuanCuti"
        >
          <Tab.Screen
            name="PersonalCuti"
            component={PersonalCuti}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="PersetujuanCuti"
            component={PersetujanCuti}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="DokumenCuti"
            component={DokumenCuti}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsPegawaiIPASN = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabPegawiIPASN {...props} />}
          initialRouteName="PegawaiIPASN"
        >
          <Tab.Screen
            name="PegawaiIPASN"
            component={PegawaiIPASN}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="DataPribadi"
            component={DataPribadi}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const BottomTabsIPASN = () => {
  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height:
            Platform.OS === "ios" ? "100%" : useWindowDimensions().height - 10,
        }}
      >
        <Tab.Navigator
          tabBar={(props) => <MyTabIPASN {...props} />}
          initialRouteName="IPASN"
        >
          <Tab.Screen
            name="IPASN"
            component={IPASN}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="PegawaiIPASN"
            component={PegawaiIPASN}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

export const TopsTP = () => {
  return (
    <BottomSheetModalProvider>
      <Top.Navigator
        initialRouteName="KRT"
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tertiary,
          tabBarLabelStyle: {
            fontSize: fontSizeResponsive("H4", device),
            textTransform: "none",
            fontWeight: FONTWEIGHT.bold,
          },
        }}
      >
        <Top.Screen
          name="KRT"
          component={KRT}
          options={{
            title: "Kerumahtanggaan",
          }}
        />
        <Top.Screen
          name="Pengawasan"
          component={Pengawasan}
          options={{
            title: "Pengawasan",
          }}
        />
        <Top.Screen
          name="KPP"
          component={KPP}
          options={{
            title: "Kinerja dan Pengembangan Pegawai",
          }}
        />
      </Top.Navigator>
    </BottomSheetModalProvider>
  );
};

export const TopsTask = ({ device }) => {
  return (
    <BottomSheetModalProvider>
      <Top.Navigator
        initialRouteName={"InProgres"}
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tertiary,
          tabBarLabelStyle: {
            fontSize: fontSizeResponsive("H4", device),
            textTransform: "none",
            fontWeight: FONTWEIGHT.bold,
          },
        }}
      >
        <Top.Screen
          name="BackLog"
          component={BackLog}
          options={{
            title: "Back Log",
          }}
        />
        <Top.Screen
          name="Inprogres"
          component={InProgres}
          options={{
            title: "In Progress",
          }}
        />
        <Top.Screen
          name="Pending"
          component={Pending}
          options={{
            title: "Pending",
          }}
        />
        <Top.Screen
          name="Complete"
          component={Complete}
          options={{
            title: "Complete",
          }}
        />
      </Top.Navigator>
    </BottomSheetModalProvider>
  );
};

export const TopsTaskDashboard = ({ device }) => {
  return (
    <BottomSheetModalProvider>
      <Top.Navigator
        initialRouteName={"HariIni"}
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tertiary,
          tabBarLabelStyle: {
            fontSize: fontSizeResponsive("H4", device),
            textTransform: "none",
            fontWeight: FONTWEIGHT.bold,
          },
        }}
      >
        <Top.Screen
          name="HariIni"
          component={HariIni}
          options={{
            title: "Hari Ini",
          }}
        />
        <Top.Screen
          name="MingguIni"
          component={MingguIni}
          options={{
            title: "Minggu Ini",
          }}
        />
        <Top.Screen
          name="Terlewat"
          component={Terlewat}
          options={{
            title: "Terlewat",
          }}
        />
      </Top.Navigator>
    </BottomSheetModalProvider>
  );
};

export const TopsTaskKorespondensi = ({ device }) => {
  return (
    <BottomSheetModalProvider>
      <Top.Navigator
        initialRouteName={"Arsip"}
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tertiary,
          tabBarLabelStyle: {
            fontSize: fontSizeResponsive("H4", device),
            textTransform: "none",
            fontWeight: FONTWEIGHT.bold,
          },
        }}
      >
        <Top.Screen
          name="Arsip"
          component={Arsip}
          options={{
            title: "Arsip",
          }}
        />
        <Top.Screen
          name="TerlewatKorespondensi"
          component={TerlewatKorespondensi}
          options={{
            title: "Terlewat",
          }}
        />
        <Top.Screen
          name="HariIniKorespondensi"
          component={HariIniKorespondensi}
          options={{
            title: "Hari Ini",
          }}
        />
        <Top.Screen
          name="MingguDepanKorespondensi"
          component={MingguDepanKorespondensi}
          options={{
            title: "Minggu Depan",
          }}
        />
      </Top.Navigator>
    </BottomSheetModalProvider>
  );
};

export const TopsPencarianKorespondensi = (data) => {
  return (
    <BottomSheetModalProvider>
      <Top.Navigator
        initialRouteName={"PAll"}
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tertiary,
          tabBarLabelStyle: {
            fontSize: 12,
            textTransform: "none",
            fontWeight: FONTWEIGHT.bold,
          },
        }}
      >
        <Top.Screen
          name="PAll"
          children={() => <PAll data={data?.data} />}
          options={{
            title: "Semua",
          }}
        />
        <Top.Screen
          name="PIncoming"
          children={() => <PIncoming data={data?.data} />}
          options={{
            title: "Surat Masuk",
          }}
        />
        <Top.Screen
          name="PDisposition"
          children={() => <PDisposition data={data?.data} />}
          options={{
            title: "Disposisi",
          }}
        />
        <Top.Screen
          name="PSubmitted"
          children={() => <PSubmitted data={data?.data} />}
          options={{
            title: "Terkirim",
          }}
        />
      </Top.Navigator>
    </BottomSheetModalProvider>
  );
};

export const TopsDash = () => {
  const { device } = useSelector((state) => state.apps);
  const { profile } = useSelector((state) => state.superApps);

  return (
    <BottomSheetModalProvider>
      <Top.Navigator
        initialRouteName="Demografi"
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tertiary,
          tabBarLabelStyle: {
            fontSize: fontSizeResponsive("H2", device),
            textTransform: "none",
          },
          tabBarScrollEnabled: true,
          swipeEnabled: false,
          tabBarItemStyle: { width: "auto" },
        }}
      >
        <Top.Screen
          name="Demografi"
          component={Demografi}
          options={{
            title: "Demografi",
          }}
        />
        <Top.Screen
          name="Penilaian"
          component={Penilaian}
          options={{
            title: "Penilaian",
          }}
        />
        <Top.Screen
          name="Pelatihan"
          component={Pelatihan}
          options={{
            title: "Pelatihan",
          }}
        />
        <Top.Screen
          name="Absensi"
          component={Absensi}
          options={{
            title: "Absensi",
          }}
        />
        <Top.Screen
          name="Kesejahteraan"
          component={Kesejahteraan}
          options={{
            title: "Kesejahteraan",
          }}
        />
        <Top.Screen
          name="Perencanaan"
          component={Perencanaan}
          options={{
            title: "Perencanaan",
          }}
        />
        <Top.Screen
          name="ROPEGIPASN"
          component={ROPEGIPASN}
          options={{
            title: "ROPEG IP ASN",
          }}
        />
        {profile.nip === "197208122001121002" ? (
          <Top.Screen
            name="RekapKepegawaian"
            component={RekapKepegawaian}
            options={{
              title: "Rekap Kepegawaian",
            }}
          />
        ) : null}
      </Top.Navigator>
    </BottomSheetModalProvider>
  );
};

export const TopsProduksiBudidaya = () => {
  const { device } = useSelector((state) => state.apps);
  return (
    <BottomSheetModalProvider>
      <Top.Navigator
        initialRouteName="Produksi"
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tertiary,
          tabBarLabelStyle: {
            fontSize: fontSizeResponsive("H2", device),
            textTransform: "none",
          },
          tabBarScrollEnabled: true,
          swipeEnabled: false,
          tabBarItemStyle: { width: "auto" },
        }}
      >
        <Top.Screen
          name="Produksi"
          component={Produksi}
          options={{
            title: "Produksi",
          }}
        />
        <Top.Screen
          name="TeknologiTerbaru"
          component={TeknologiTerbaru}
          options={{
            title: "Teknologi Terbaru",
          }}
        />
      </Top.Navigator>
    </BottomSheetModalProvider>
  );
};

export const TopsKeuanganKinerja = () => {
  const { device } = useSelector((state) => state.apps);

  return (
    <BottomSheetModalProvider>
      <Top.Navigator
        initialRouteName="APBN"
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tertiary,
          tabBarLabelStyle: {
            fontSize: fontSizeResponsive("H2", device),
            textTransform: "none",
          },
          tabBarScrollEnabled: true,
          swipeEnabled: false,
          tabBarItemStyle: { width: "auto" },
        }}
      >
        <Top.Screen
          name="APBN"
          component={APBN}
          options={{
            title: "APBN",
          }}
        />
        <Top.Screen
          name="PNBP"
          component={PNBP}
          options={{
            title: "PNBP",
          }}
        />
        <Top.Screen
          name="IKU"
          component={IKU}
          options={{
            title: "IKU",
          }}
        />
        {/* <Top.Screen
          name="DetailAPBN"
          component={DetailAPBN}
          options={{
            title: "APBN Detail",
          }}
        /> */}
      </Top.Navigator>
    </BottomSheetModalProvider>
  );
};

export const TopsBantuanPemerintah = () => {
  const { device } = useSelector((state) => state.apps);

  return (
    <BottomSheetModalProvider>
      <Top.Navigator
        initialRouteName="Kusuka"
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tertiary,
          tabBarLabelStyle: {
            fontSize: fontSizeResponsive("H2", device),
            textTransform: "none",
          },
          tabBarScrollEnabled: true,
          swipeEnabled: false,
          tabBarItemStyle: { width: "auto" },
        }}
      >
        <Top.Screen
          name="Kusuka"
          component={Kusuka}
          options={{
            title: "KUSUKA",
          }}
        />
        <Top.Screen
          name="P3KEKusuka"
          component={P3KEKusuka}
          options={{
            title: "P3KE KUSUKA",
          }}
        />
        <Top.Screen
          name="P3KENonKusuka"
          component={P3KENonKusuka}
          options={{
            title: "P3KE NON KUSUKA",
          }}
        />
        <Top.Screen
          name="BBMSubsidiKusuka"
          component={BBMSubsidiKusuka}
          options={{
            title: "BBM SUBSIDI KUSUKA",
          }}
        />
        <Top.Screen
          name="BBMNonSubsidiKusuka"
          component={BBMNonSubsidiKusuka}
          options={{
            title: "BBM SUBSIDI NON KUSUKA",
          }}
        />
        <Top.Screen
          name="DeviasiKusuka"
          component={Deviasi}
          options={{
            title: "DEVIASI KUSUKA",
          }}
        />
      </Top.Navigator>
    </BottomSheetModalProvider>
  );
};
export const TopAddressBook = ({ config, device }) => {
  return (
    <Host>
      <BottomSheetModalProvider>
        <Top.Navigator
          initialRouteName={"AddressBookJabatan"}
          screenOptions={{
            tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.tertiary,
            tabBarLabelStyle: {
              fontSize: fontSizeResponsive("H3", device),
              textTransform: "none",
            },
          }}
        >
          {config.tabs.jabatan &&
          config.tabs.pegawai &&
          config.tabs.para &&
          config.tabs.favorit ? (
            <>
              <Top.Screen
                name="AddressBookJabatan"
                component={AddressBookJabatan}
                options={{
                  title: "Jabatan",
                }}
                initialParams={{ config: config }}
              />
              <Top.Screen
                name="AddressBookPegawai"
                component={AddressBookPegawai}
                options={{
                  title: "Pegawai",
                }}
                initialParams={{ config: config }}
              />
              <Top.Screen
                name="AddressBookFavorit"
                component={AddressbookFavorit}
                options={{
                  title: "Favorit",
                }}
                initialParams={{ config: config }}
              />
              <Top.Screen
                name="AddressBookPara"
                component={AddressbookPara}
                options={{
                  title: "Para",
                }}
                initialParams={{ config: config }}
              />
            </>
          ) : config.tabs.jabatan && config.tabs.pegawai && config.tabs.para ? (
            <>
              <Top.Screen
                name="AddressBookJabatan"
                component={AddressBookJabatan}
                options={{
                  title: "Jabatan",
                }}
                initialParams={{ config: config }}
              />
              <Top.Screen
                name="AddressBookPegawai"
                component={AddressBookPegawai}
                options={{
                  title: "Pegawai",
                }}
                initialParams={{ config: config }}
              />
              <Top.Screen
                name="AddressBookPara"
                component={AddressbookPara}
                options={{
                  title: "Para",
                }}
                initialParams={{ config: config }}
              />
            </>
          ) : config.tabs.jabatan && config.tabs.pegawai ? (
            <>
              <Top.Screen
                name="AddressBookJabatan"
                component={AddressBookJabatan}
                options={{
                  title: "Jabatan",
                }}
                initialParams={{ config: config }}
              />
              <Top.Screen
                name="AddressBookPegawai"
                component={AddressBookPegawai}
                options={{
                  title: "Pegawai",
                }}
                initialParams={{ config: config }}
              />
            </>
          ) : config.tabs.jabatan ? (
            <Top.Screen
              name="AddressBookJabatan"
              component={AddressBookJabatan}
              options={{
                title: "Jabatan",
              }}
              initialParams={{ config: config }}
            />
          ) : config.tabs.pegawai ? (
            <Top.Screen
              name="AddressBookPegawai"
              component={AddressBookPegawai}
              options={{
                title: "Pegawai",
              }}
              initialParams={{ config: config }}
            />
          ) : null}
        </Top.Navigator>
      </BottomSheetModalProvider>
    </Host>
  );
};

// FAQ
export const TopsFaq = () => {
  const { device } = useSelector((state) => state.apps);
  return (
    <BottomSheetModalProvider>
      <Top.Navigator
        initialRouteName={"DashboardDanReport"}
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.tertiary,
          tabBarLabelStyle: {
            fontSize: fontSizeResponsive("H5", device),
            textTransform: "none",
            fontWeight: FONTWEIGHT.bold,
          },
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: "auto", minWidth: 100 },
        }}
      >
        <Top.Screen
          name="DashboardDanReport"
          component={DashboardDanReport}
          options={{
            title: "Dashboard dan Report",
          }}
        />
        <Top.Screen
          name="Regulasi"
          component={Regulasi}
          options={{
            title: "Regulasi",
          }}
        />
        <Top.Screen
          name="AplikasiPortalKKP"
          component={AplikasiPortalKKP}
          options={{
            title: "Aplikasi Portal KKP",
          }}
        />
        <Top.Screen
          name="PengembanganKompetensi"
          component={PengembanganKompetensi}
          options={{
            title: "Pengembangan Kompetensi",
          }}
        />
        <Top.Screen
          name="SuperApps"
          component={SuperApps}
          options={{
            title: "SuperApps",
          }}
        />
      </Top.Navigator>
    </BottomSheetModalProvider>
  );
};
