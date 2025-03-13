import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  Platform,
  Switch,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {} from "react-native-safe-area-context";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
  spacing,
  shadow,
  textStyle,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Collapse } from "accordion-collapse-react-native";
import { CollapseCardBiodata } from "../../components/CollapseCardBiodata";
import { ScrollView } from "react-native";
import { CollapseCardLinimasa } from "../../components/CollapseCardLinimasa";
import {
  getMenuLite,
  getMenuType,
  getTokenValue,
  removeMenuLite,
  removePushNotif,
  removeTokenValue,
  setMenuLite,
  setMenuType,
} from "../../service/session";
import { setLogout } from "../../store/LoginAuth";
import { Loading } from "../../components/Loading";
import { Alert } from "react-native";
import {
  setNotifIos,
  setProfile,
  setResponReset,
  setTypeMenu,
} from "../../store/SuperApps";
import { setProfile as setProfileKores } from "../../store/profile";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Config } from "../../constants/config";
import { OneSignal } from "react-native-onesignal";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { Portal } from "react-native-portalize";
import { CardListAplikasi } from "../../components/CardListAplikasi";
import { GlobalStyles } from "../../constants/styles";
import { Divider } from "react-native-paper";
import moment from "moment";
import CollapseEpegIPASN from "../../components/CollapseEpegIPASN";
import CollapseSIASNIPASN from "../../components/CollapseSIASNIPASN";
import { CollapseCardSIASNDataUtama } from "../../components/CollapseCardSIASNDataUtama";
import { CollapseCardSIASNJabatan } from "../../components/CollapseCardSIASNJabatan";
import { CollapseCardSIASNRwSkp } from "../../components/CollapseCardSIASNRwSkp";
import { CollapseCardSIASNRwSkp22 } from "../../components/CollapseCardSIASNRwSkp22";
import { CollapseCardSIASNRwPnsUnor } from "../../components/CollapseCardSIASNRwPnsUnor";
import { CollapseCardSIASNAngkaKredit } from "../../components/CollapseCardSIASNAngkaKredit";
import { CollapseCardSIASNRwPenghargaan } from "../../components/CollapseCardSIASNRwPenghargaan";
import { CollapseCardSIASNRwPendidikan } from "../../components/CollapseCardSIASNRwPendidikan";
import { CollapseCardPasangan } from "../../components/CollapseCardPasangan";
import { CollapseCardAnak } from "../../components/CollapseCardAnak";
import { CollapseCardOrangTua } from "../../components/CollapseCardOrangTua";
import { CollapseCardMasaKerja } from "../../components/CollapseCardMasaKerja";
import { CollapseCardHukumanDisiplin } from "../../components/CollapseCardHukumanDisiplin";
import { CollapseCardSIASNRwKursusDiklat } from "../../components/CollapseCardSIASNRwKursusDiklat";
import { getCheckProdHuk, putResetPassword } from "../../service/api";
import { setCheckProdukHukum } from "../../store/ProdukHukum";

export const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [modalLog, setModalLog] = useState(false);
  const [listMenu, setListMenu] = useState([]);
  const [listLog, setListLog] = useState([]);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(true);
  const [passwordBaru, setPasswordBaru] = useState("");
  const [showBaru, setShowBaru] = useState(true);
  const [passwordKonfirmasi, setPasswordKonfirmasi] = useState("");
  const [showKonfirmasi, setShowKonfirmasi] = useState(true);
  const { profile, linimasa, loading, responReset } = useSelector(
    (state) => state.superApps
  );
  const { checkProdukHukum } = useSelector((state) => state.produkHukum);
  const { device } = useSelector((state) => state.apps);
  const BASE_URL = Config.base_url + "bridge";
  const [isEnabled, setIsEnabled] = useState(false);

  const [token, setToken] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const toggleSwitch = (val) => {
    setIsEnabled(val);
    setMenuType(JSON.stringify(val));
    dispatch(setTypeMenu(val));
  };

  useEffect(() => {
    getMenuType().then((val) => {
      try {
        const parsedVal = JSON.parse(val);
        setIsEnabled(parsedVal === null ? false : parsedVal);
      } catch (e) {
        console.error("JSON Parse error:", e);
      }
    });
  }, []);

  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalResetRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["99%"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  function handlePressModal() {
    bottomSheetModalRef.current?.present();
  }

  const closeBottomSheet = () => {
    bottomSheetModalRef.current.close();
  };

  function handlePressModalReset() {
    bottomSheetModalResetRef.current?.present();
  }

  const closeBottomSheetReset = () => {
    bottomSheetModalResetRef.current.close();
  };

  const roleEvent = ["EVENT.USER"];
  const roleKalender = ["CALENDAR.USER"];
  const rolePreShare = ["PRESHARE.USER"];
  const roleTaskManagement = ["TASK.USER"];
  const roleLaporan = ["LAPORAN_BSRE"];
  const pejabatTinggi = ["CUSTOM_MENU"];
  const rolePerizinanMenteri = ["PERIZINAN_MENTERI"];
  const roleSIASN = ["BUKA_SIASN_DATA"];
  const dataRoleDashboardProdukHukum = [
    "UPLOAD.PRODUK.HUKUM",
    "OPERATOR.NOMOR.PRODUK.HUKUM",
  ];

  const isRoleLaporan = profile.roles_access?.some((item) =>
    roleLaporan.includes(item)
  );

  const isRoleKalender = profile.roles_access?.some((item) =>
    roleKalender.includes(item)
  );
  const isRolePreShare = profile.roles_access?.some((item) =>
    rolePreShare.includes(item)
  );

  const isPejabatTinggi = profile.roles_access?.some((item) =>
    pejabatTinggi.includes(item)
  );
  // const isRoleTaskManagement = profile.roles_access?.some((item) =>
  //     roleTaskManagement.includes(item)
  // );

  const isRoleEvent = profile.roles_access?.some((item) =>
    roleEvent.includes(item)
  );

  const isRoleMenteri = profile.roles_access?.some((item) =>
    rolePerizinanMenteri.includes(item)
  );
  const isRoleSIASN = profile.roles_access?.some((item) =>
    roleSIASN.includes(item)
  );
  const [isRoleProdukHukum, setIsRoleProdukHukum] = useState(false);
  const tempRoleProdukHukum = profile.roles_access?.some((item) =>
    dataRoleDashboardProdukHukum.includes(item)
  );
  useEffect(() => {
    if (tempRoleProdukHukum || profile?.nip == "88888") {
      setIsRoleProdukHukum(true);
    } else {
      if (Object.keys(profile).length > 0) {
        dispatch(getCheckProdHuk({ token: token }));
      }
    }
  }, [profile]);
  useEffect(() => {
    let tmpMenu = [];
    let tmpLog = [];
    // Pilihan Menu
    tmpMenu.push(
      {
        title: "Korespondensi",
        navigation: "MainKoresp",
        image: require("../../assets/superApp/korespondensi.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 24,
          },
          height: {
            tablet: 50,
            hp: 28,
          },
        },
        titleStyle: {
          width: wp(15),
        },
      },
      {
        title: "Regulasi",
        navigation: "MainKeb",
        image: require("../../assets/superApp/kebijakan.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 30,
          },
          height: {
            tablet: 50,
            hp: 33,
          },
        },
        titleStyle: {
          width: null,
        },
      },
      {
        title: "Digital Sign",
        navigation: "MainDigitalSign",
        image: require("../../assets/superApp/digitalsign.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 28,
          },
          height: {
            tablet: 50,
            hp: 35,
          },
        },
        titleStyle: {
          width: null,
        },
        // subMenu: [
        //   {
        //     title: "Dokumen Lain",
        //   },
        //   {
        //     title: "Verifikasi",
        //   },
        // ],
      },
      {
        title: "Cuti",
        navigation: "MainCuti",
        image: require("../../assets/superApp/cuti.png"),
        imagestyle: {
          width: {
            tablet: 60,
            hp: 40,
          },
          height: {
            tablet: 50,
            hp: 28,
          },
        },
        titleStyle: {
          width: null,
        },
      },
      {
        title: "SPPD",
        navigation: "MainSPPD",
        image: require("../../assets/superApp/sppd.png"),
        imagestyle: {
          width: {
            tablet: 60,
            hp: 32,
          },
          height: {
            tablet: 60,
            hp: 32,
          },
        },
        titleStyle: {
          width: null,
        },
      },
      {
        title: "Kepegawaian",
        navigation: "KepegawaianApps",
        image: require("../../assets/superApp/pegawai.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 30,
          },
          height: {
            tablet: 40,
            hp: 24,
          },
        },
        titleStyle: {
          width: wp(15),
        },
      },
      {
        title: "Task Management",
        navigation: "MyTask",
        image: require("../../assets/superApp/taskmanagement.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 30,
          },
          height: {
            tablet: 50,
            hp: 28,
          },
        },
        titleStyle: {
          width: null,
        },
        // subMenu: [
        //   {
        //     title: "Main",
        //   },
        //   {
        //     title: "Laporan",
        //   },
        // ],
      },
      {
        title: "Pengembangan Kompetensi",
        navigation: "bankom",
        image: require("../../assets/superApp/Bankomicon.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 30,
          },
          height: {
            tablet: 40,
            hp: 24,
          },
        },
        titleStyle: {
          width: wp(15),
        },
      },
      // {
      //   title: "Pegawai",
      //   navigation: "ListPegawai",
      //   image: require("../../assets/superApp/pegawai.png"),
      //   imagestyle: {
      //     width: {
      //       tablet: 50,
      //       hp: 28,
      //     },
      //     height: {
      //       tablet: 50,
      //       hp: 30,
      //     },
      //   },
      //   titleStyle: {
      //     width: null,
      //   },
      // },

      {
        title: "Survei Layanan",
        navigation: "SurveyLayanan",
        image: require("../../assets/superApp/surveylayanan.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 28,
          },
          height: {
            tablet: 50,
            hp: 28,
          },
        },
        titleStyle: {
          width: null,
        },
      }
    );
    if (isRolePreShare) {
      tmpMenu.splice(2, 0, {
        title: "KKP Drive",
        navigation: "MainRepo",
        image: require("../../assets/superApp/repositori.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 30,
          },
          height: {
            tablet: 40,
            hp: 24,
          },
        },
        titleStyle: {
          width: wp(15),
        },
      });
    }
    if (isRoleKalender) {
      tmpMenu.splice(6, 0, {
        title: "Kalender",
        navigation: "MainKalender",
        image: require("../../assets/superApp/kalender.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 28,
          },
          height: {
            tablet: 50,
            hp: 28,
          },
        },
        titleStyle: {
          width: null,
        },
        // subMenu: [
        //   {
        //     title: "Grup Kalender",
        //   },
        //   {
        //     title: "Kalender Personal",
        //   },
        // ],
      });
    } else {
      tmpMenu.splice(7, 0, {
        title: "Kalender",
        navigation: "KalenderPersonal",
        image: require("../../assets/superApp/kalender.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 28,
          },
          height: {
            tablet: 50,
            hp: 28,
          },
        },
        titleStyle: {
          width: null,
        },
      });
    }
    if (isRoleEvent) {
      tmpMenu.splice(8, 0, {
        title: "Event Management",
        navigation: "HalamanUtama",
        image: require("../../assets/superApp/event.png"),
        imagestyle: {
          width: {
            tablet: 40,
            hp: 20,
          },
          height: {
            tablet: 60,
            hp: 35,
          },
        },
        titleStyle: {
          width: null,
        },
      });
    }
    if (isRoleMenteri) {
      tmpMenu.splice(11, 0, {
        title: "Perizinan Menteri",
        navigation: "PerizinanMenteri",
        image: require("../../assets/superApp/Bankomicon.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 30,
          },
          height: {
            tablet: 50,
            hp: 30,
          },
        },
        titleStyle: {
          width: wp(15),
        },
      });
    }
    if (isRoleProdukHukum) {
      tmpMenu.splice(12, 0, {
        title: "Produk Hukum",
        navigation: "ProdukHukum",
        image: require("../../assets/superApp/Bankomicon.png"),
        imagestyle: {
          width: {
            tablet: 50,
            hp: 28,
          },
          height: {
            tablet: 50,
            hp: 28,
          },
        },
        titleStyle: {
          width: null,
        },
      });
    } else {
      if (checkProdukHukum || profile.nip == "88888") {
        tmpMenu.splice(12, 0, {
          title: "Produk Hukum",
          navigation: "ProdukHukum",
          image: require("../../assets/superApp/Bankomicon.png"),
          imagestyle: {
            width: {
              tablet: 50,
              hp: 28,
            },
            height: {
              tablet: 50,
              hp: 28,
            },
          },
          titleStyle: {
            width: null,
          },
        });
      }
    }

    // Log Perbaikan
    tmpLog.push(
      {
        description: "Perbaikan Deskripsi PKRL",
      },
      {
        description: "Perbaikan URL Verifikasi",
      }
    );
    // setMenu(JSON.stringify(tmpMenu));
    setListMenu(tmpMenu);
    setListLog(tmpLog);
  }, [profile, checkProdukHukum]);

  const [appsIsChecked, setAppsIsChecked] = useState([]);

  useEffect(() => {
    getMenuLite(profile.nip).then((val) => {
      try {
        const parsedVal = JSON.parse(val);
        setAppsIsChecked(parsedVal === null ? [] : parsedVal);
      } catch (e) {
        console.error("JSON Parse error:", e);
      }
    });
  }, [profile]);

  const handleChangeChecked = (checked, item, parent) => {
    if (parent === undefined) {
      if (checked) {
        setAppsIsChecked((prev) => [...prev, item]);
      } else {
        const index = appsIsChecked.map((e) => e.title).indexOf(item.title);
        let arr = [...appsIsChecked];
        arr.splice(index, 1);
        setAppsIsChecked(arr);
      }
    } else {
      if (checked) {
        const index = appsIsChecked.map((e) => e.title).indexOf(parent.title);
        let arr = [...appsIsChecked];

        //jika parent ada
        if (index > -1) {
          arr[index].subMenu.push(item);
        } else {
          arr.push({
            ...parent,
            subMenu: [item],
          });
        }
        setAppsIsChecked(arr);
      } else {
        const index = appsIsChecked.map((e) => e.title).indexOf(parent.title);
        let arr = [...appsIsChecked];
        const indexSubMenu = arr[index].subMenu
          .map((e) => e.title)
          .indexOf(item.title);

        arr[index].subMenu.splice(indexSubMenu, 1);

        if (arr[index].subMenu.length === 0) {
          arr.splice(index, 1);
        }
        setAppsIsChecked(arr);
      }
    }
  };

  const checkedMenu = (title) => {
    let checked = false;

    const loopData = (arr) => {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].title === title) {
          checked = true;
        } else if (arr[i].subMenu) {
          loopData(arr[i].subMenu);
        }
      }
    };

    const tempArr = [...appsIsChecked];
    loopData(tempArr);
    return checked;
  };

  const handleSaveMenuLite = () => {
    setMenuLite(JSON.stringify(appsIsChecked), profile.nip);
  };

  const handleResetPassword = () => {
    const payload = {
      confirm_password: passwordKonfirmasi,
      new_password: passwordBaru,
      old_password: password,
    };
    dispatch(putResetPassword({ token: token, payload: payload }));
  };

  useEffect(() => {
    if (responReset?.status === "200") {
      Alert.alert("Password berhasil diubah", "Harap login kembali", [
        {
          text: "OK",
          onPress: () => {
            removePushNotif();
            setNotifIos(false);
            removeTokenValue();
            dispatch(setLogout());
            dispatch(setProfile({}));
            dispatch(setProfileKores({}));
            OneSignal.User.addTag("user_type", "");
            dispatch(setResponReset(""));
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginToken" }],
            });
          },
        },
      ]);
    }
    console.log(responReset);
  }, [responReset]);

  return (
    <>
      {loading ? <Loading /> : null}
      <ScrollView>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.primary,
            height: 80,
          }}
        >
          {/* Icon Topbar */}
          {/* <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 20,
              width: device === "tablet" ? 40 : 28,
              height: device === "tablet" ? 40 : 28,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 20,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="chevron-back-outline"
                  size={device === "tablet" ? 40 : 24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
          </View> */}
          <View style={{ flex: 1, alignItems: "center", marginLeft: 40 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: FONTWEIGHT.bold,
                color: COLORS.white,
              }}
            >
              Profile Saya
            </Text>
          </View>
          <View
            style={{
              marginRight: spacing.default,
            }}
          >
            <TouchableOpacity onPress={() => setModalLog(true)}>
              <Ionicons
                name="information-circle-outline"
                size={device === "tablet" ? 30 : 30}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile */}
        <View
          style={{
            paddingHorizontal: spacing.default,
            paddingTop: spacing.default,
          }}
        >
          <View
            style={[
              {
                backgroundColor: COLORS.white,
                width: "100%",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                padding: spacing.default,
              },
              shadow.cardShadow,
            ]}
          >
            <Image
              source={{ uri: BASE_URL + profile.avatar_signed }}
              style={{
                width: device === "tablet" ? 100 : 61,
                height: device === "tablet" ? 100 : 61,
                borderRadius: device === "tablet" ? 50 : 30,
              }}
            />
            <Text
              style={[
                {
                  marginTop: spacing.default,
                  color: COLORS.info,
                  fontSize: fontSizeResponsive("H4", device),
                },
              ]}
            >
              {profile.nama}
            </Text>
            <Text
              style={[
                {
                  color: COLORS.lighter,
                  textAlign: "center",
                  fontSize: fontSizeResponsive("H5", device),
                },
              ]}
            >
              {profile.unit_kerja}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              {
                padding: spacing.default,
                rowGap: spacing.medium,
                backgroundColor: COLORS.white,
                marginTop: 10,
                borderRadius: 8,
              },
              shadow.cardShadow,
            ]}
            onPress={() => {
              handlePressModalReset();
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <MaterialIcons
                  name="key"
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Update Password
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={device === "tablet" ? 40 : 24}
              />
            </View>
          </TouchableOpacity>

          <View
            style={[
              {
                padding: spacing.default,
                rowGap: spacing.medium,
                backgroundColor: COLORS.white,
                marginTop: 10,
                borderRadius: 8,
              },
              shadow.cardShadow,
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Jumlah hari kerja
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile.working_day}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Jumlah hadir
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile.present_day}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Terlambat
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile.late_day}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Dinas
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile.outstation_day}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Cuti
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile.big_leave_day === undefined ||
                profile.big_leave_day === null
                  ? 0
                  : parseInt(profile.big_leave_day) +
                      profile.labor_leave_day ===
                      undefined || profile.labor_leave_day === null
                  ? 0
                  : parseInt(profile.labor_leave_day) +
                      profile.sick_leave_day ===
                      undefined || profile.sick_leave_day === null
                  ? 0
                  : parseInt(profile.sick_leave_day) +
                      profile.urgent_leave_day ===
                      undefined || profile.urgent_leave_day === null
                  ? 0
                  : parseInt(profile.urgent_leave_day) +
                      profile.year_leave_day ===
                      undefined || profile.year_leave_day === null
                  ? 0
                  : parseInt(profile.year_leave_day)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 1,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Update Terakhir:
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile?.request_updated_get_from_siasn === null ||
                profile?.request_updated_get_from_siasn === undefined
                  ? "-"
                  : moment(
                      profile?.request_updated_get_from_siasn,
                      "YYYY-MM-DD HH:mm:ss"
                    )
                      .locale("id")
                      .format("DD MMMM YYYY HH:mm:ss")}
              </Text>
            </View>
          </View>
        </View>

        {/* <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            paddingHorizontal: spacing.default,
            columnGap: spacing.default,
          }}
        >
  
          <View
            style={[
              {
                backgroundColor: COLORS.white,
                borderRadius: 8,
                flex: 1,
              },
              shadow.cardShadow,
            ]}
          >
            <View
              style={{ padding: spacing.default, rowGap: spacing.medium }}
            >
              <Text
                style={[
                  {
                    marginVertical: -10,
                    fontSize: fontSizeResponsive("H4", device),
                  },
                ]}
              >
                IP ASN
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H5", device),
                  marginTop: 10,
                }}
              >
                Sumber Data EPEG 2024
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: device === "tablet" ? 60 : 30,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  {profile?.epeg_ipasn_data?.nilai}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    width: device === "tablet" ? "88%" : "78%",
                  }}
                >
                  Kualifikasi
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: "#FF9900",
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile?.epeg_ipasn_data?.kualifikasi}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    width: device === "tablet" ? "88%" : "78%",
                  }}
                >
                  Kompetensi
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: COLORS.success,
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile?.epeg_ipasn_data?.kompetensi}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    width: device === "tablet" ? "88%" : "78%",
                  }}
                >
                  Kinerja
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: "#CED06C",
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile?.epeg_ipasn_data?.kinerja}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: device === "tablet" ? "88%" : "78%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Disiplin
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: COLORS.orange,
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile?.epeg_ipasn_data?.disiplin}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: device === "tablet" ? "88%" : "78%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Diklat
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: COLORS.success,
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile?.epeg_ipasn_data?.diklat20jp}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: device === "tablet" ? "88%" : "78%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Fungsional
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: "#CED06C",
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile?.epeg_ipasn_data?.fungsional}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: device === "tablet" ? "88%" : "78%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Hukdis
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: COLORS.orange,
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile?.epeg_ipasn_data?.hukdis}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: device === "tablet" ? "88%" : "78%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  PPKP
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: COLORS.success,
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile?.epeg_ipasn_data?.ppkp}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: device === "tablet" ? "88%" : "78%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Seminar
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: "#CED06C",
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile?.epeg_ipasn_data?.seminar}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: device === "tablet" ? "88%" : "78%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Struktural
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: '#FF9900',
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile?.epeg_ipasn_data?.struktural}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={[
              {
                backgroundColor: COLORS.white,
                borderRadius: 8,
                flex: 1,
              },
              shadow.cardShadow,
            ]}
          >
            <View style={{ padding: spacing.default, rowGap: spacing.medium }}>
              <Text
                style={[
                  {
                    marginVertical: -10,
                    fontSize: fontSizeResponsive("H4", device),
                  },
                ]}
              >
                IP ASN
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H5", device),
                  marginTop: 10,
                }}
              >
                Sumber Data SIASN
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: device === "tablet" ? 60 : 30,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  {profile.ipasn_nilai}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    width: device === "tablet" ? "88%" : "78%",
                  }}
                >
                  Kualifikasi
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: "#FF9900",
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile.ipasn_kualifikasi}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    width: device === "tablet" ? "88%" : "78%",
                  }}
                >
                  Kompetensi
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: COLORS.success,
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile.ipasn_kompetensi}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    width: device === "tablet" ? "88%" : "78%",
                  }}
                >
                  Kinerja
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: "#CED06C",
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile.ipasn_kinerja}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: device === "tablet" ? "88%" : "78%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Disiplin
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: device === "tablet" ? 30 : 20,
                      height: device === "tablet" ? 30 : 20,
                      backgroundColor: COLORS.success,
                      borderRadius: 50,
                      marginRight: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile.ipasn_disiplin}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View> */}

        {/* Collapse Content IPASN EPEG */}
        <View style={{ paddingTop: spacing.default }}>
          <CollapseEpegIPASN profile={profile} device={device} />
        </View>

        {/* Collapse Content IPASN SIASN */}
        <View style={{ paddingTop: spacing.default }}>
          <CollapseSIASNIPASN profile={profile} device={device} />
        </View>

        {/* Biodata */}
        <View style={{ paddingVertical: spacing.default }}>
          <CollapseCardBiodata profile={profile} device={device} />
          {/* <CollapseCardLinimasa linimasa={linimasa} /> */}
        </View>

        {isRoleSIASN && profile?.nip !== "100040" ? (
          <>
            {/* SIASN Data Utama */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardSIASNDataUtama
                profile={profile?.siasn_data?.siasn_data_utama}
                device={device}
              />
            </View>
            {/* SIASN Jabatan */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardSIASNJabatan
                profile={profile?.siasn_data?.siasn_jabatan}
                device={device}
              />
            </View>
            {/* SIASN RW SKP */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardSIASNRwSkp
                profile={profile?.siasn_data?.siasn_rw_skp}
                device={device}
              />
            </View>
            {/* SIASN RW SKP 22 */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardSIASNRwSkp22
                profile={profile?.siasn_data?.siasn_rw_skp22}
                device={device}
              />
            </View>
            {/* SIASN RW PNS Unor */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardSIASNRwPnsUnor
                profile={profile?.siasn_data?.siasn_rw_pnsunor}
                device={device}
              />
            </View>
            {/* SIASN Angka Kredit */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardSIASNAngkaKredit
                profile={profile?.siasn_data?.siasn_rw_angkakredit}
                device={device}
              />
            </View>
            {/* SIASN RW Pendidikan */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardSIASNRwPendidikan
                profile={profile?.siasn_data?.siasn_rw_pendidikan}
                device={device}
              />
            </View>
            {/* SIASN Penghargaan */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardSIASNRwPenghargaan
                profile={profile?.siasn_data?.siasn_rw_penghargaan}
                device={device}
              />
            </View>
            {/* Pasangan */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardPasangan
                profile={profile?.siasn_data?.siasn_data_pasangan?.listPasangan}
                device={device}
              />
            </View>
            {/* Anak */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardAnak
                profile={profile?.siasn_data?.siasn_data_anak}
                device={device}
              />
            </View>
            {/* Ortang tua */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardOrangTua
                profile={profile?.siasn_data?.siasn_data_ortu}
                device={device}
              />
            </View>
            {/* Masa Kerja */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardMasaKerja
                profile={profile?.siasn_data?.siasn_rw_masakerja}
                device={device}
              />
            </View>
            {/* Hukuman Disiplin */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardHukumanDisiplin
                profile={profile?.siasn_data?.siasn_rw_hukdis}
                device={device}
              />
            </View>
            {/* Kursus Diklat */}
            <View style={{ paddingBottom: spacing.default }}>
              <CollapseCardSIASNRwKursusDiklat
                profile={profile?.siasn_data}
                device={device}
              />
            </View>
          </>
        ) : null}

        {/* Faq */}
        <View
          style={{
            paddingHorizontal: spacing.default,
            marginBottom: isPejabatTinggi === true ? null : spacing.default,
          }}
        >
          <TouchableOpacity
            style={[
              {
                backgroundColor: COLORS.white,
                borderRadius: 8,
                padding: spacing.default,
              },
              shadow.cardShadow,
            ]}
            onPress={() => {
              navigation.navigate("ListFaq");
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={device === "tablet" ? 40 : 24}
              />
              <Text
                style={[
                  {
                    fontWeight: "700",
                    fontSize: fontSizeResponsive("H4", device),
                  },
                ]}
              >
                FAQ
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {isPejabatTinggi && (
          <View
            style={{
              margin: spacing.default,
            }}
          >
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.white,
                  padding: spacing.default,
                  borderRadius: 8,
                  width: "100%",
                  justifyContent: "space-between",
                },
                shadow.cardShadow,
              ]}
            >
              <View>
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Pengaturan Menu
                </Text>
                {isEnabled ? (
                  <TouchableOpacity
                    onPress={() => {
                      handlePressModal();
                    }}
                  >
                    <Text
                      style={{
                        marginVertical: spacing.medium,
                        color: COLORS.info,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Pilih menu yang ingin ditampilkan
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <Switch
                trackColor={{ false: "#767577", true: COLORS.info }}
                thumbColor={isEnabled ? COLORS.white : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(val) => toggleSwitch(val)}
                value={isEnabled}
              />
            </View>
          </View>
        )}

        <Portal>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={animatedSnapPoints}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}
            index={0}
            style={{ borderRadius: 50 }}
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjust"
            backdropComponent={({ style }) => (
              <View
                style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
              />
            )}
          >
            <View
              onLayout={handleContentLayout}
              style={{
                paddingHorizontal: spacing.default,
                marginHorizontal: spacing.medium,
              }}
            >
              <View style={{ marginBottom: spacing.default }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Aplikasi
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      closeBottomSheet();
                    }}
                    style={{ justifyContent: "center" }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={device === "tablet" ? 40 : 24}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
                <Divider />
                <View style={{ marginTop: spacing.medium }}>
                  <FlatList
                    data={listMenu}
                    renderItem={({ item, index }) => (
                      <CardListAplikasi
                        item={item}
                        index={index}
                        appsIsChecked={appsIsChecked}
                        handleChangeChecked={handleChangeChecked}
                        checked={checkedMenu}
                        device={device}
                      />
                    )}
                    keyExtractor={(item) => item.title}
                  />

                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.primary,
                      height: 50,
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: spacing.default,
                    }}
                    onPress={() => {
                      handleSaveMenuLite();
                      closeBottomSheet();
                    }}
                  >
                    <Text
                      style={[
                        {
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H4", device),
                        },
                      ]}
                    >
                      Simpan
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BottomSheetModal>
        </Portal>

        <Portal>
          <BottomSheetModal
            ref={bottomSheetModalResetRef}
            snapPoints={animatedSnapPoints}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}
            index={0}
            style={{ borderRadius: 50 }}
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjust"
            backdropComponent={({ style }) => (
              <View
                style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
              />
            )}
          >
            <KeyboardAvoidingView behavior={"height"}>
              <View
                onLayout={handleContentLayout}
                style={{
                  paddingHorizontal: spacing.default,
                  marginHorizontal: spacing.medium,
                }}
              >
                <View style={{ marginBottom: spacing.default }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Update Password
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        closeBottomSheetReset();
                        setPassword("");
                        setPasswordBaru("");
                        setPasswordKonfirmasi("");
                      }}
                      style={{ justifyContent: "center" }}
                    >
                      <Ionicons
                        name="close-outline"
                        size={device === "tablet" ? 40 : 24}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                  <Divider />
                  <View style={{ marginTop: spacing.medium }}>
                    {/* Other TextInput and UI elements */}
                    <View style={{ marginTop: 5 }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Password Lama
                      </Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderRadius: 4,
                          borderColor: COLORS.ExtraDivinder,
                          flexDirection: "row",
                          height: 40,
                          marginTop: 5,
                        }}
                      >
                        <TextInput
                          style={{ padding: 10, width: "70%" }}
                          onChangeText={(e) => {
                            setPassword(e);
                          }}
                          value={password}
                          secureTextEntry={show}
                          allowFontScaling={false}
                        />
                        <View
                          style={{
                            alignItems: "flex-end",
                            flex: 1,
                            marginRight: 10,
                            justifyContent: "center",
                          }}
                        >
                          {show == false ? (
                            <TouchableOpacity
                              onPress={() => {
                                setShow(true);
                              }}
                            >
                              <Ionicons
                                name="eye-off-sharp"
                                size={device === "tablet" ? 30 : 24}
                                color={COLORS.grey}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                setShow(false);
                              }}
                            >
                              <Ionicons
                                name="eye-sharp"
                                size={device === "tablet" ? 30 : 24}
                                color={COLORS.grey}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>

                    <View style={{ marginTop: 5 }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Password Baru
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          color: COLORS.grey,
                          marginVertical: 5,
                        }}
                      >
                        Password harus mengandung minimal 8 karakter, 1 huruf
                        besar, dan spesial karakter
                      </Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderRadius: 4,
                          borderColor: COLORS.ExtraDivinder,
                          flexDirection: "row",
                          height: 40,
                          marginTop: 5,
                        }}
                      >
                        <TextInput
                          style={{ padding: 10, width: "70%" }}
                          onChangeText={(e) => {
                            setPasswordBaru(e);
                          }}
                          value={passwordBaru}
                          secureTextEntry={showBaru}
                          allowFontScaling={false}
                        />
                        <View
                          style={{
                            alignItems: "flex-end",
                            flex: 1,
                            marginRight: 10,
                            justifyContent: "center",
                          }}
                        >
                          {showBaru == false ? (
                            <TouchableOpacity
                              onPress={() => {
                                setShowBaru(true);
                              }}
                            >
                              <Ionicons
                                name="eye-off-sharp"
                                size={device === "tablet" ? 30 : 24}
                                color={COLORS.grey}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                setShowBaru(false);
                              }}
                            >
                              <Ionicons
                                name="eye-sharp"
                                size={device === "tablet" ? 30 : 24}
                                color={COLORS.grey}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      {responReset?.status === "400" ? (
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.infoDanger,
                            marginVertical: 5,
                          }}
                        >
                          {`Update password gagal. Pastikan beberapa poin berikut :
- This password is too short. It must contain at least 8 characters.
- This password is too common.
- Password must contain at least 1 number.
- Password must contain at least 1 uppercase character.
- Password must contain at least 1 special character ( !"#$%&'()*+,-./:;<=>?@[\]^_{|}~)`}
                        </Text>
                      ) : null}
                    </View>

                    <View style={{ marginTop: 5 }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Konfirmasi Password Baru
                      </Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderRadius: 4,
                          borderColor: COLORS.ExtraDivinder,
                          flexDirection: "row",
                          height: 40,
                          marginTop: 5,
                        }}
                      >
                        <TextInput
                          style={{ padding: 10, width: "70%" }}
                          onChangeText={(e) => {
                            setPasswordKonfirmasi(e);
                          }}
                          value={passwordKonfirmasi}
                          secureTextEntry={showKonfirmasi}
                          allowFontScaling={false}
                        />
                        <View
                          style={{
                            alignItems: "flex-end",
                            flex: 1,
                            marginRight: 10,
                            justifyContent: "center",
                          }}
                        >
                          {showKonfirmasi == false ? (
                            <TouchableOpacity
                              onPress={() => {
                                setShowKonfirmasi(true);
                              }}
                            >
                              <Ionicons
                                name="eye-off-sharp"
                                size={device === "tablet" ? 30 : 24}
                                color={COLORS.grey}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                setShowKonfirmasi(false);
                              }}
                            >
                              <Ionicons
                                name="eye-sharp"
                                size={device === "tablet" ? 30 : 24}
                                color={COLORS.grey}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      {passwordBaru !== passwordKonfirmasi ? (
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.infoDanger,
                            marginVertical: 5,
                          }}
                        >
                          Password Baru dan Password Konfirmasi Tidak Sama!
                        </Text>
                      ) : null}
                    </View>

                    <TouchableOpacity
                      style={{
                        backgroundColor:
                          password === "" ||
                          passwordBaru === "" ||
                          passwordKonfirmasi === "" ||
                          passwordBaru !== passwordKonfirmasi
                            ? COLORS.grey
                            : COLORS.primary,
                        height: 50,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: spacing.default,
                      }}
                      onPress={() => {
                        // closeBottomSheetReset();
                        // setPassword("");
                        // setPasswordBaru("");
                        // setPasswordKonfirmasi("");
                        handleResetPassword();
                      }}
                      disabled={
                        password === "" ||
                        passwordBaru === "" ||
                        passwordKonfirmasi === "" ||
                        passwordBaru !== passwordKonfirmasi
                      }
                    >
                      <Text
                        style={[
                          {
                            color: COLORS.white,
                            fontSize: fontSizeResponsive("H4", device),
                          },
                        ]}
                      >
                        Simpan
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </BottomSheetModal>
        </Portal>

        {/* Logout Button */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: spacing.default,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              width: "100%",
              height: 50,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              Alert.alert(
                "Peringatan!",
                "Apakah anda yakin akan logout dari aplikasi?",
                [
                  {
                    text: "Tidak",
                    onPress: () => null,
                    style: "cancel",
                  },
                  {
                    text: "YA",
                    onPress: () => {
                      removePushNotif();
                      setNotifIos(false);
                      removeTokenValue();
                      dispatch(setLogout());
                      dispatch(setProfile({}));
                      dispatch(setProfileKores({}));
                      dispatch(setCheckProdukHukum(false));
                      OneSignal.User.addTag("user_type", "");
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "LoginToken" }],
                      });
                    },
                  },
                ]
              );
            }}
          >
            <Text
              style={[
                {
                  color: COLORS.white,
                  fontSize: fontSizeResponsive("H4", device),
                },
              ]}
            >
              Logout
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              { marginVertical: spacing.default, color: COLORS.grey },
              fontSizeResponsive("textM", device),
            ]}
          >
            Version {Config.app_version}
          </Text>
        </View>

        {/* Pop up informasi */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalLog}
          onRequestClose={() => {
            setModalLog(false);
          }}
        >
          <TouchableOpacity
            style={[
              Platform.OS === "ios"
                ? styles.iOSBackdrop
                : styles.androidBackdrop,
              styles.backdrop,
            ]}
          />
          <View
            style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                width: "90%",
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: spacing.default,
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    {
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    },
                  ]}
                >
                  Log Perbaikan Aplikasi Version {Config.app_version}
                </Text>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    setModalLog(false);
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={device === "tablet" ? 40 : 24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <Divider />
              <View
                style={{
                  flexDirection: "column",
                  rowGap: spacing.medium,
                  padding: spacing.default,
                }}
              >
                {listLog?.map((item) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          width: device === "tablet" ? 10 : 5,
                          height: device === "tablet" ? 10 : 5,
                          borderRadius: 10,
                          backgroundColor: COLORS.primary,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                  );
                })}

                {/* 
              <Text
                style={{
                  width: "70%",
                  marginHorizontal: 60,
                  marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {detail?.title !== "" && detail?.title !== null
                  ? detail.title
                  : "-"}
              </Text> */}
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  Card: {
    backgroundColor: COLORS.white,
    width: "90%",
    marginVertical: 20,
    marginLeft: 20,
    borderRadius: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },

  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.32,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
