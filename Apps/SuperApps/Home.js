import React from "react";
import {
  View,
  Text,
  StyleSheet,
  // ScrollView,
  Image,
  Dimensions,
  Linking,
  BackHandler,
  Alert,
  RefreshControl,
  Platform,
  FlatList,
  AppState,
  useWindowDimensions,
} from "react-native";
import { CardMenu } from "../../components/CardMenu";
// import { Carousel } from '../../components/Carousel/Carousel'
import { Search } from "../../components/Search";
import { Ionicons } from "@expo/vector-icons";
import { CardApps } from "../../components/CardApps";
import Carousel, {
  Pagination,
  ParallaxImage,
} from "react-native-snap-carousel";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { CardAppsB } from "../../components/CardAppsB";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  AVATAR,
  COLORS,
  DATETIME,
  DateFormat,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
  imageApps,
} from "../../config/SuperAppps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { CardTautan } from "../../components/CardTautan";
import { Modal } from "react-native";
import {} from "react-native-safe-area-context";
import { CardVisiMisi } from "../../components/CardVisiMisi";
import { CardVideo } from "../../components/CardVideo";
import YoutubePlayer from "react-native-youtube-iframe";
import { Button } from "react-native";
import { useCallback } from "react";
import { Portal } from "react-native-portalize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getMenu,
  getMenuLite,
  getPushNotif,
  getTokenValue,
  removeMenuLite,
  removePushNotif,
  removeTokenValue,
} from "../../service/session";
import {
  getBanner,
  getProfileMe,
  getGaleri,
  getBerita,
  getLastLogAttendence,
  postAttendence,
  getDetailArsipCuti,
} from "../../service/api";
import {
  setOrganization,
  setProfile as setProfileKores,
} from "../../store/profile";
import { bannerKegiatan as BannerKegiatan } from "../../components/BannerKegiatan";
import { BeritaHome } from "../../components/BeritaHome";
import { GaleriHome } from "../../components/GaleriHome";
import { Loading } from "../../components/Loading";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Config } from "../../constants/config";
import { setLogout } from "../../store/LoginAuth";
import {
  setBerita,
  setGaleri,
  setHandleError,
  setPost,
  setProfile,
  setStatus,
} from "../../store/SuperApps";
import { openURL } from "expo-linking";
import moment, { duration } from "moment";
import { ModalSubmit } from "../../components/ModalSubmit";
import { MotiView } from "@motify/components";
import { Easing } from "react-native-reanimated";
import LottieView from "lottie-react-native";
import CryptoJS from "react-native-crypto-js";
import { OneSignal } from "react-native-onesignal";
import { ScrollView } from "react-native-gesture-handler";
import { CardCounterApps } from "../../components/CardCounterApps";
import { CardCounterAppsTTDE } from "../../components/CardCounterAppsTTDE";
import { getHTTP } from "../../utils/http";
import { nde_api } from "../../utils/api.config";
const numColumns = 3;

const _color = "#6E01EF";
const _size = 100;

export const Home = () => {
  const carouselRefHome = useRef(null);
  const carouselRefBerita = useRef(null);
  const carouselRefGaleri = useRef(null);
  const carouselRefCombine = useRef(null);

  const [slide2, setSlide2] = useState(0);
  const [slide3, setSlide3] = useState(0);
  const [slide4, setSlide4] = useState(0);
  const [slide5, setSlide5] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleVideo, setModalVisibleVideo] = useState(false);
  const [modalPresensi, setModalPresensi] = useState(false);
  const [token, setToken] = useState("");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [modalBankom, setModalBankom] = useState(false);
  const [modalKepegawaian, setModalKepegawaian] = useState(false);
  const [dataNotif, setDataNotif] = useState();
  const [menuBankom, setMenuBankom] = useState([]);
  const [menuKepegawaian, setMenuKepegawaian] = useState([]);
  const [menuLiteLength, setMenuliteLength] = useState();
  const [combineBanner, setCombineBanner] = useState([]);
  const animation = useRef(null);
  const [radius, setRadius] = useState(false);
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const route = useRoute();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const refreshPage = () => {
    setRefresh(true);
    dispatch(getProfileMe(token));
    dispatch(getBanner(token));
    dispatch(getGaleri({ token, page }));
    dispatch(getBerita({ token, page }));
    dispatch(getLastLogAttendence(token));
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  };

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const getProfile = async () => {
    // setIsLoading(true);
    try {
      //get isCounter
      const response = await getHTTP(nde_api.profile);
      dispatch(setProfileKores(response.data));
      dispatch(setOrganization(response.data));
      // setIsLoading(false);
    } catch (error) {
      // console.log(error.response);
    }
  };

  useEffect(() => {
    if (token !== "") {
      dispatch(getProfileMe(token));
      dispatch(getBanner(token));
      dispatch(getGaleri({ token, page }));
      dispatch(getBerita({ token, page }));
      dispatch(getLastLogAttendence(token));
      getProfile();
    }
  }, [token, profile, banner, galeri, berita, dataNotif]);

  const {
    berita,
    agenda,
    program,
    galeri,
    profile,
    visimisi,
    banner,
    loading,
    handleError,
    lastLog,
    status,
    post,
    iosNotif,
    typeMenu,
  } = useSelector((state) => state.superApps);

  useEffect(() => {
    OneSignal.User.addTag("user_type", profile?.nip?.toString());
  }, [profile?.nip]);

  useEffect(() => {
    getPushNotif().then((val) => {
      if (val?.path === "cuti" && profile.nip !== undefined) {
        const params = { nip: profile.nip, id: val.id };
        console.log("params", params);
        dispatch(getDetailArsipCuti(params));
        navigation.navigate(val?.action, { approval: val?.approval });
      } else if (val?.path === "korespondensi" && profile.nip !== undefined) {
        console.log("ip val", val);
        if (val.id != undefined) {
          if (val.action == "IncomingDetail") {
            navigation.navigate("IncomingDetail", {
              id: val.id,
              title: "Detail Surat Masuk",
            });
          } else if (val.action == "DispositionDetail") {
            navigation.navigate("DispositionDetail", {
              id: val.id,
              title: "Detail Disposisi",
            });
          } else if (val.action == "NeedFollowUpDetail") {
            navigation.navigate("NeedFollowUpDetail", {
              id: val.id,
              title: "Detail Surat Perlu Diproses",
            });
          }
        }
      }
    });
  }, [token, profile.nip, iosNotif]);

  useEffect(() => {
    if (post) {
      dispatch(getLastLogAttendence(token));
      setTimeout(() => {
        dispatch(setPost(false));
      }, 1500);
    }
  }, [post]);

  // useEffect(() => {
  //   if (post === true) {
  //     axios
  //       .get(`https://apigw.kubekkp.coofis.com/attendence/lastlog/`, {
  //         headers: { Authorization: token },
  //       })
  //       .then((respon) => {
  //         console.log(respon?.data);
  //         if (respon?.data?.results?.next_action !== undefined) {
  //           console.log("masuk1");
  //           if (respon?.data?.results?.next_action === "O") {
  //             console.log("masuk2");
  //             saveData("checkIn", respon?.data.results?.created_date);
  //           } else if (respon?.data.results?.next_action === false) {
  //             console.log("masuk3");
  //             saveData("checkOut", respon?.data.results?.created_date);
  //           }
  //         }
  //         dispatch(setPost(false));
  //         retrieveData();
  //       });
  //   }
  // }, [post]);

  const bottomSheetModalRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["100%"], []);
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
  const navigation = useNavigation();

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (handleError) {
      Alert.alert("Peringatan!", "Terjadi kesalahan harap login kembali?", [
        {
          text: "YA",
          onPress: () => {
            removeTokenValue();
            dispatch(setLogout());
            dispatch(setProfile({}));
            dispatch(setHandleError(false));
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginToken" }],
            });
          },
        },
      ]);
    }
  }, [handleError]);

  const roleLaporan = ["LAPORAN_BSRE"];

  useEffect(() => {
    const isRoleLaporan = profile?.roles_access?.some((item) =>
      roleLaporan.includes(item)
    );
    let tmpMenu = [];
    let tmpMenuKepegawaian = [];
    tmpMenu.push(
      {
        title: "Pengetahuan",
        navigation: "MainPengetahuan",
        image: require("../../assets/superApp/pengetahuan.png"),
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
        title: "Aksi Perubahan",
        navigation: "AksiPerubahan",
        image: require("../../assets/superApp/aksiperubahanicon.png"),
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
        title: "Sertifikat",
        navigation: "MainSertifikat",
        image: require("../../assets/superApp/sertifikat.png"),
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
        title: "e-Learning",
        navigation: "e-Learning",
        image: require("../../assets/superApp/e-learningicon.png"),
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
        title: "Info",
        navigation: "Info",
        image: require("../../assets/superApp/info.png"),
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
      }
    );
    if (isRoleLaporan) {
      tmpMenu.splice(3, 0, {
        title: "Laporan",
        navigation: "LaporanDigitalSign",
        image: require("../../assets/superApp/Laporanicon.png"),
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
      });
    } else {
      // console.log("masuk role else", isRoleLaporan);
      null;
    }

    tmpMenuKepegawaian.push(
      {
        title: "IPASN",
        navigation: "IPASN",
        image: require("../../assets/superApp/IPASN.png"),
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
        title: "Pegawai",
        navigation: "MainPegawaiIPASN",
        image: require("../../assets/superApp/Pegawai2.png"),
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
        title: "Nominatif Pegawai",
        navigation: "Nominatif",
        image: require("../../assets/superApp/NominatifPeg.png"),
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
      }
    );
    setMenuKepegawaian(tmpMenuKepegawaian);
    setMenuBankom(tmpMenu);
  }, [profile]);

  const numRows = Math.ceil(menuBankom.length / 3);

  const renderRow = ({ item }) => {
    if (item.empty === true) {
      return (
        <View
          style={[
            { width: screenWidth - 60, height: screenWidth - 170 },
            styles.itemInvisible,
          ]}
        />
      );
    }
    return (
      <View
        style={[
          { width: screenWidth - 60, height: screenWidth - 170 },
          { height: device === "tablet" ? 200 : 100 },
        ]}
        key={item.title}
      >
        <TouchableOpacity
          onPress={() => {
            if (item.navigation === "Info") {
              setModalInfo(true);
            } else if (item.navigation === "e-Learning") {
              openURL(
                "https://elearning.kkp.go.id/auth/oauth2/login.php?id=1&wantsurl=https%3A%2F%2Felearning.kkp.go.id%2F&sesskey=Jhop9vc9S5"
              );
            } else {
              navigation.navigate(item.navigation);
            }
            setModalBankom(false);
            setModalKepegawaian(false);
          }}
        >
          <View
            style={[
              device == "tablet" ? styles.cardAppsTablet : styles.cardApps,
              {
                backgroundColor: COLORS.secondary,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              },
            ]}
          >
            <Image
              style={{
                width:
                  device === "tablet"
                    ? item.imagestyle.width.tablet
                    : item.imagestyle.width.hp,
                height:
                  device === "tablet"
                    ? item.imagestyle.height.tablet
                    : item.imagestyle.height.hp,
              }}
              source={imageApps(item.title)}
            />
            {/* <Text>{typeof item.image}</Text> */}
          </View>
        </TouchableOpacity>
        <Text
          style={{
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontSize: fontSizeResponsive("H4", device),
            width: item.titleStyle.width,
          }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </View>
    );
  };

  const rows = Array.from({ length: numRows }, (_, rowIndex) =>
    menuBankom.slice(rowIndex * 3, rowIndex * 3 + 3)
  );

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return data;
  };

  const { device } = useSelector((state) => state.apps);

  const [time, setTime] = useState(new Date());

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [checkApps, setCheckApps] = useState();
  const [permissionStatus, setPermissionStatus] = useState(false);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     Location.requestForegroundPermissionsAsync().then((status) => {
  //       if (status.status !== "granted") {
  //         setErrorMsg("Izin akses lokasi tidak diberikan");
  //         setLocation(null);
  //         setPermissionStatus(false);
  //         return;
  //       } else {
  //         setPermissionStatus(true);
  //       }
  //     });

  //     Location.getCurrentPositionAsync({}).then((location) => {
  //       // console.log(location);
  //       setLocation({
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //         latitudeDelta: 0.1,
  //         longitudeDelta: 0.1,
  //       });
  //     });
  //   }, 10000);

  //   return () => clearInterval(intervalId);
  // }, []);

  const handleCheckin = () => {
    let longlat = [location?.longitude, location?.latitude];
    const payload = {
      location: {
        type: "Point",
        coordinates: longlat,
      },
      type: "I",
      description: "Check-In",
    };

    const data = {
      token: token,
      payload: payload,
    };
    let ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(payload),
      "qwertyuiopasdfgh"
    );
    console.log(ciphertext.toString());
    dispatch(postAttendence(data));
  };

  const handleCheckOut = () => {
    let longlat = [location?.longitude, location?.latitude];
    const payload = {
      location: {
        type: "Point",
        coordinates: longlat,
      },
      type: "O",
      description: "Check-Out",
    };

    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postAttendence(data));
  };

  // const saveData = async (type, date) => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem(token);
  //     let datas;
  //     if (jsonValue !== null) {
  //       datas = { ...JSON.parse(jsonValue), [type]: date };
  //     } else {
  //       datas = {
  //         [type]: date,
  //       };
  //     }
  //     // Simpan data ke local storage dengan kunci 'myData'
  //     await AsyncStorage.setItem(token, JSON.stringify(datas));
  //     // Set data ke state untuk merefresh tampilan
  //     console.log("Data berhasil disimpan.");
  //   } catch (error) {
  //     // Tangani error jika terjadi
  //     console.log(error);
  //   }
  // };

  // const retrieveData = async () => {
  //   try {
  //     // Ambil data dari local storage dengan kunci 'myArrayData'
  //     const jsonValue = await AsyncStorage.getItem(token);
  //     if (jsonValue !== null) {
  //       // Jika data ditemukan, konversi dari string ke array dan set data ke state
  //       const resultObject = JSON.parse(jsonValue);
  //       setDisplayTime(resultObject);
  //     }
  //   } catch (error) {
  //     // Tangani error jika terjadi
  //     console.error(error);
  //   }
  // };

  const getWidthCarousel = () => {
    let tempWidth = 0;
    let orientation = getOrientation(screenWidth, screenHeight);

    if (device === "tablet") {
      if (orientation === "landscape") {
        tempWidth = screenWidth - 50;
      } else {
        tempWidth = screenWidth - 50;
      }
    } else {
      tempWidth = screenWidth - 30;
    }

    return tempWidth;
  };

  useEffect(() => {
    if (typeMenu !== null) {
      if (typeMenu === false) {
        getMenu().then((val) => {
          try {
            const parsedVal = JSON.parse(val);
            // console.log(parsedVal, "menu");
            if (parsedVal === null) {
              setMenuliteLength([]);
            } else {
              setMenuliteLength(parsedVal);
            }
          } catch (e) {
            console.error("JSON Parse error:", e);
          }
        });
      } else {
        getMenuLite(profile.nip).then((val) => {
          try {
            const parsedVal = JSON.parse(val);
            console.log(parsedVal, "lite");
            if (parsedVal === null) {
              setMenuliteLength([]);
            } else {
              setMenuliteLength(parsedVal);
            }
          } catch (e) {
            console.error("JSON Parse error:", e);
          }
        });
      }
    }
  }, [typeMenu, isFocused, profile.nip]);

  useEffect(() => {
    const dataVideo = [
      {
        title:
          " Menteri Trenggono Melakukan Panen Parsial Kedua di BUBK Kebumen",
        image: require("../../assets/superApp/hq720.webp"),
        time: "",
        type: "video",
      },
    ];
    const dataBerita = berita.lists.map((item) => ({
      id: item?.id,
      title: item?.title,
      image: item?.image,
      time: item.created_at,
      type: "berita",
    }));

    const uniqueDataCombineBerita = dataBerita.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t?.id === item?.id &&
            t?.title === item?.title &&
            t?.image === item?.image &&
            t?.created_at === item?.created_at
        )
    );

    const dataGaleri = galeri.lists.map((item) => ({
      id: item?.id,
      title: item?.title,
      image: item?.main_images?.image,
      time: item?.created_at,
      type: "galeri",
    }));

    const uniqueDataCombineGaleri = dataGaleri.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t?.id === item?.id &&
            t.title === item.title &&
            t?.main_images?.image === item?.main_images?.image &&
            t?.created_at === item?.created_at
        )
    );

    // console.log(uniqueDataCombineBerita);

    setCombineBanner([
      ...dataVideo,
      ...uniqueDataCombineBerita,
      ...uniqueDataCombineGaleri,
    ]);
  }, [berita.lists, galeri.lists]);

  const { profile: profileKores = {} } = useSelector((state) => state.profile);

  const handleGetHeight = () => {
    let height = 0;
    let top = "30%";
    let orientation = getOrientation(screenWidth, screenHeight);

    if (device === "phone") {
      //IPHONE XS KEBAWAH
      if (screenWidth >= 375 && screenWidth < 390) {
        if (profileKores?.title?.length > 0) {
          top = "30%";
          height = 320;
        } else {
          top = "40%";
          height = 230;
        }
      } else {
        //IPHONE XR KEATAS
        if (profileKores?.title?.length > 0) {
          top = "30%";
          height = 320;
        } else {
          top = "40%";
          height = 230;
        }
      }
    } else if (device === "tablet") {
      if (orientation === "landscape") {
        if (screenWidth >= 1024 && screenWidth < 1210) {
          (height = 320), (top = "45%");
        } else {
          (height = 320), (top = "45%");
        }
      } else if (orientation === "potrait") {
        if (screenWidth >= 744 && screenWidth < 810) {
          (height = 330), (top = "45%");
        } else if (screenWidth >= 744 && screenWidth <= 834) {
          (height = 330), (top = "45%");
        } else {
          (height = 330), (top = "45%");
        }
      }
    } else {
      height = 200;
    }

    return {
      height: height,
      top: top,
    };
  };

  let orientation = getOrientation(screenWidth, screenHeight);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        {loading === true ? <Loading /> : null}
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={refreshPage} />
          }
        >
          <View
            style={{
              minHeight: handleGetHeight().height,
              position: "relative",
            }}
          >
            <View
              style={{
                width: "100%",
                height: device === "tablet" ? 280 : 180,
                position: "absolute",
                top: 0,
                borderBottomLeftRadius: 14,
                borderBottomRightRadius: 14,
              }}
            >
              <Image
                source={require("../../assets/superApp/headerdark.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  borderBottomLeftRadius: 14,
                  borderBottomRightRadius: 14,
                }}
              />
            </View>

            <View
              style={{
                justifyContent: "flex-end",
                flex: 1,
                flexDirection: "row",
                gap: 16,
                padding: 20,
              }}
            >
              <View
                style={{
                  width: "84%",
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    textAlign: "right",
                    fontWeight: FONTWEIGHT.bolder,
                    marginBottom: 10,
                    fontSize: fontSizeResponsive("H2", device),
                    height: profile.nip === "100062" ? 15 : null,
                  }}
                >
                  {profile.nama}
                </Text>
                <Text
                  style={{
                    color: COLORS.white,
                    textAlign: "right",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  {profile.nip}
                </Text>
              </View>
              <View>
                <Image
                  source={{
                    uri: Config.base_url + "bridge/" + profile.avatar_signed,
                  }}
                  style={{
                    width: device === "tablet" ? 100 : 50,
                    height: device === "tablet" ? 100 : 50,
                    borderRadius: 8,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                width: "100%",
                position: "absolute",
                zIndex: 9,
                top: handleGetHeight().top,
                paddingHorizontal: 20,
              }}
            >
              <View style={{ alignItems: "center", display: "flex" }}>
                <CardCounterApps />
              </View>

              {/* {profile.nip === "100062" ? null : (
              )} */}
            </View>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{
                alignItems: "center",
                display: "flex",
                marginBottom: 5,
              }}
            >
              <CardCounterAppsTTDE />
            </View>

            <CardApps
              handlePressModal={handlePressModal}
              setModalBankom={setModalBankom}
              setModalKepegawaian={setModalKepegawaian}
              closeBottomSheet={closeBottomSheet}
            />
          </View>
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
              <View onLayout={handleContentLayout} style={{ flex: 1 }}>
                <ScrollView
                  nestedScrollEnabled={true}
                  style={{
                    height: useWindowDimensions().height - 80,
                  }}
                >
                  <View
                    style={{
                      marginTop: device === "tablet" ? 50 : 30,
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        marginHorizontal: 20,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 14,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: FONTWEIGHT.bold,
                          fontSize: fontSizeResponsive("H1", device),
                        }}
                      >
                        Aplikasi
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          closeBottomSheet();
                        }}
                      >
                        <Ionicons
                          name="close-outline"
                          size={device === "tablet" ? 40 : 24}
                          color={COLORS.lighter}
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <CardAppsB
                        setModalBankom={setModalBankom}
                        setModalKepegawaian={setModalKepegawaian}
                        closeBottomSheet={closeBottomSheet}
                      />
                    </View>
                  </View>
                </ScrollView>
              </View>
            </BottomSheetModal>
          </Portal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalBankom}
            onRequestClose={() => {
              setModalBankom(false);
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
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "90%",
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                    borderBottomWidth: 2,
                    borderBottomColor: COLORS.grey,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Pengembangan Kompetensi
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalBankom(false);
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={24}
                      color={COLORS.lighter}
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={formatData(menuBankom, numColumns)}
                  renderItem={renderRow}
                  keyExtractor={(row, index) => `row_${index}`}
                  columnWrapperStyle={{
                    marginHorizontal: "5%",
                    gap: 5,
                  }}
                  numColumns={numColumns}
                />
              </View>
            </View>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalKepegawaian}
            onRequestClose={() => {
              setModalKepegawaian(false);
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
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "90%",
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                    borderBottomWidth: 2,
                    borderBottomColor: COLORS.grey,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Kepegawaian
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalKepegawaian(false);
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={24}
                      color={COLORS.lighter}
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={formatData(menuKepegawaian, numColumns)}
                  renderItem={renderRow}
                  keyExtractor={(row, index) => `row_${index}`}
                  columnWrapperStyle={{
                    marginHorizontal: "5%",
                    gap: 5,
                  }}
                  numColumns={numColumns}
                />
              </View>
            </View>
          </Modal>

          <ModalSubmit
            status={status}
            setStatus={setStatus}
            messageSuccess={"Data Ditambahkan"}
            message={"Silahkan Coba Kembali"}
            navigate={"Home"}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalPresensi}
            onRequestClose={() => {
              setModalPresensi(false);
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
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "90%",
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    padding: 20,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("Judul", device),
                    }}
                  >
                    Hi, {profile.nama}
                  </Text>

                  {lastLog?.next_action === "I" ? (
                    <Text style={{ marginVertical: 20 }}>
                      Apakah kamu akan melakukan{" "}
                      <Text style={{ fontWeight: "bold" }}>Chek-In</Text> ?
                    </Text>
                  ) : lastLog?.next_action === "O" ? (
                    <Text style={{ marginVertical: 20 }}>
                      Apakah kamu akan melanjutkan{" "}
                      <Text style={{ fontWeight: "bold" }}>Chek-Out</Text> ?
                    </Text>
                  ) : (
                    <>
                      <Text style={{ marginVertical: 20 }}>
                        Kamu telah melakukan{" "}
                        <Text style={{ fontWeight: "bold" }}>Chek-In</Text>{" "}
                        pukul{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {moment(lastLog?.in?.created_date).format(
                            "DD MMMM YYYY HH:mm:ss"
                          )}
                        </Text>
                      </Text>
                      <Text>
                        Kamu telah melakukan{" "}
                        <Text style={{ fontWeight: "bold" }}>Chek-Out</Text>{" "}
                        pukul{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {moment(lastLog?.out?.created_date).format(
                            "DD MMMM YYYY HH:mm:ss"
                          )}
                        </Text>
                      </Text>

                      <Text style={{ marginTop: 20 }}>
                        Durasi{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {lastLog?.total_duration}
                        </Text>
                      </Text>
                    </>
                  )}

                  {lastLog?.next_action !== false ? (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        justifyContent: "flex-end",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          borderWidth: 1,
                          borderColor:
                            lastLog?.next_action === "I"
                              ? COLORS.success
                              : lastLog?.next_action === "O"
                              ? "#B745FF"
                              : null,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          width: "30%",
                        }}
                        onPress={() => {
                          setModalPresensi(false);
                        }}
                      >
                        <Text
                          style={{
                            color:
                              lastLog?.next_action === "I"
                                ? COLORS.success
                                : lastLog?.next_action === "O"
                                ? "#B745FF"
                                : null,
                            fontWeight: FONTWEIGHT.bold,
                          }}
                        >
                          Tidak
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          padding: 10,
                          backgroundColor:
                            lastLog?.next_action === "I"
                              ? COLORS.success
                              : lastLog?.next_action === "O"
                              ? "#B745FF"
                              : null,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          width: "30%",
                        }}
                        onPress={() => {
                          if (lastLog.next_action === "I") {
                            handleCheckin();
                          } else {
                            handleCheckOut();
                          }
                          // setCheckOut(true);
                          setModalPresensi(false);
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.white,
                            fontWeight: FONTWEIGHT.bold,
                          }}
                        >
                          Ya
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        gap: 10,
                        alignItems: "flex-end",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          backgroundColor: COLORS.primary,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          width: "30%",
                          marginTop: 20,
                        }}
                        onPress={() => {
                          setModalPresensi(false);
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.white,
                            fontWeight: FONTWEIGHT.bold,
                          }}
                        >
                          Tutup
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Modal>

          <View style={[styles.containerr, { marginTop: 16 }]}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>

            <Carousel
              ref={carouselRefHome}
              sliderWidth={screenWidth}
              sliderHeight={screenWidth}
              itemWidth={getWidthCarousel()}
              data={banner}
              renderItem={({ item }, parallaxProps) => (
                <BannerKegiatan parallaxProps={parallaxProps} item={item} />
              )}
              hasParallaxImages={true}
            />
          </View>

          <View
            style={{
              marginVertical: 20,
              marginLeft: 25,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H2", device),
              }}
            >
              Tautan Pintas
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{ flex: 1, alignItems: "flex-end", marginRight: 30 }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                  flex: 1,
                  color: "#1868AB",
                }}
              >
                Selengkapnya
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <CardTautan setModalVisible={setModalVisible} />
          </View>

          {/* <View
            style={{
              marginVertical: 20,
              marginLeft: 25,
              flexDirection: "row",
              marginTop: 30,
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H2", device),
              }}
            >
              Video
            </Text>
          </View>

          <CardVideo setModalVisibleVideo={setModalVisibleVideo} /> */}

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisibleVideo}
            onRequestClose={() => {
              setModalVisibleVideo(!modalVisibleVideo);
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
              style={{
                alignItems: "center",
                flex: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalVisibleVideo(false);
                }}
                style={{
                  position: "absolute",
                  top: "15%",
                  left: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.primary,
                    width: 51,
                    height: 51,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 50,
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    color={COLORS.white}
                    size={24}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  width: device === "tablet" ? 700 : 380,
                  height: device === "tablet" ? 500 : 283,
                }}
              >
                <YoutubePlayer
                  height={useWindowDimensions().height}
                  play={playing}
                  videoId={"tV6yMXX2hPs"}
                  onChangeState={onStateChange}
                />
              </View>
            </View>
          </Modal>

          {/* <View
            style={{
              marginVertical: 20,
              marginLeft: 25,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H2", device),
              }}
            >
              Berita Terkini
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ListBerita")}
              style={{ flex: 1, alignItems: "flex-end", marginRight: 30 }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                  flex: 1,
                  color: "#1868AB",
                }}
              >
                Selengkapnya
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <View style={styles.containerr}>
              <Carousel
                ref={carouselRefBerita}
                sliderWidth={screenWidth}
                sliderHeight={screenWidth}
                itemWidth={getWidthCarousel()}
                data={berita.lists.slice(0, 5)}
                renderItem={({ item }, parallaxProps) => (
                  <BeritaHome
                    parallaxProps={parallaxProps}
                    item={item}
                    token={token}
                  />
                )}
                hasParallaxImages={true}
                onSnapToItem={setSlide4}
              />
              <Pagination
                dotsLength={berita?.lists?.slice(0, 5).length}
                dotColor={"black"}
                inactiveDotColor={COLORS.grey}
                dotStyle={styles.paginationDot}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                activeDotIndex={slide4}
                carouselRef={carouselRefBerita}
                tappableDots={!!carouselRefBerita}
              />
            </View>
          </View> */}

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
            style={{}}
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
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 10,
                  padding: 20,
                  width: "90%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: 500,
                    }}
                  >
                    Kerumahtanggaan
                  </Text>
                  <TouchableOpacity
                    style={{ alignItems: "flex-end", flex: 1 }}
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={device === "tablet" ? 40 : 24}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      Linking.openURL("https://halo-bupbj.com/");
                    }}
                  >
                    <Image
                      source={require("../../assets/superApp/BUPBJ.png")}
                      style={{
                        width: device === "tablet" ? 100 : 48,
                        height: device === "tablet" ? 100 : 48,
                      }}
                    />
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      Halo-BUPBJ
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ marginTop: 30 }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: 500,
                    }}
                  >
                    Pengawasan
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      Linking.openURL("https://www.lapor.go.id/");
                    }}
                  >
                    <Image
                      source={require("../../assets/superApp/lapor.png")}
                      style={{
                        width: device === "tablet" ? 100 : 48,
                        height: device === "tablet" ? 100 : 48,
                      }}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Lapor.go.id
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      Linking.openURL("https://wbs.kkp.go.id/registration");
                    }}
                  >
                    <Image
                      source={require("../../assets/superApp/wbs.png")}
                      style={{
                        width: device === "tablet" ? 100 : 48,
                        height: device === "tablet" ? 100 : 48,
                      }}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      WBS KKP
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      Linking.openURL("https://sidak.kkp.go.id/login");
                    }}
                  >
                    <Image
                      source={require("../../assets/superApp/sidak.png")}
                      style={{
                        width: device === "tablet" ? 100 : 48,
                        height: device === "tablet" ? 100 : 48,
                      }}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Sidak
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      Linking.openURL("https://jdih.kkp.go.id/");
                    }}
                  >
                    <Image
                      source={require("../../assets/superApp/JDIH.png")}
                      style={{
                        width: device === "tablet" ? 100 : 48,
                        height: device === "tablet" ? 100 : 48,
                      }}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      JDIH
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ marginTop: 30 }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: 500,
                    }}
                  >
                    Kinerja dan Pengembangan Pegawai
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL("https://e-monev.bappenas.go.id/fe/");
                    }}
                  >
                    <View>
                      <Image
                        source={require("../../assets/superApp/monev.png")}
                        style={{
                          width: device === "tablet" ? 100 : 48,
                          height: device === "tablet" ? 100 : 48,
                        }}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Emonev{"\n"} Bapennas
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL("https://www.kinerjaku.kkp.go.id/");
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../assets/superApp/kinerjaku.png")}
                        style={{
                          width: device === "tablet" ? 100 : 48,
                          height: device === "tablet" ? 100 : 48,
                        }}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Kinerjaku
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL("https://elearning.kkp.go.id/");
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../assets/superApp/milea.png")}
                        style={{
                          width: device === "tablet" ? 100 : 48,
                          height: device === "tablet" ? 100 : 48,
                        }}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        E-Milea
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL("https://kinerja.bkn.go.id/login");
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../assets/superApp/kinerjabkn.png")}
                        style={{
                          width: device === "tablet" ? 100 : 48,
                          height: device === "tablet" ? 100 : 48,
                        }}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        E-Kinerja {"\n"}BKN
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL("https://siasn-instansi.bkn.go.id/");
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../assets/superApp/SIASN.png")}
                        style={{
                          width: device === "tablet" ? 100 : 48,
                          height: device === "tablet" ? 100 : 48,
                        }}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        SIASN{"\n"} BKN
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL("https://myasn.bkn.go.id/");
                    }}
                  >
                    <View>
                      <Image
                        source={require("../../assets/superApp/myasn.png")}
                        style={{
                          width: device === "tablet" ? 100 : 48,
                          height: device === "tablet" ? 100 : 48,
                        }}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: FONTSIZE.H4,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        MyASN
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* <View
            style={{
              marginLeft: 25,
              marginVertical: 20,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H2", device),
              }}
            >
              Galeri
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ListGaleri")}
              style={{ flex: 1, alignItems: "flex-end", marginRight: 30 }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                  flex: 1,
                  color: "#1868AB",
                }}
              >
                Selengkapnya
              </Text>
            </TouchableOpacity>
          </View> */}

          {/* <View style={[styles.containerr, { marginBottom: "5%" }]}>
            <Carousel
              ref={carouselRefGaleri}
              sliderWidth={screenWidth}
              sliderHeight={screenWidth}
              itemWidth={getWidthCarousel()}
              data={galeri.lists.slice(0, 5)}
              renderItem={({ item }, parallaxProps) => (
                <GaleriHome parallaxProps={parallaxProps} item={item} />
              )}
              hasParallaxImages={true}
              onSnapToItem={setSlide3}
            />
            <Pagination
              dotsLength={galeri?.lists?.slice(0, 5).length}
              dotColor={"black"}
              inactiveDotColor={COLORS.grey}
              dotStyle={styles.paginationDot}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              activeDotIndex={slide3}
              carouselRef={carouselRefGaleri}
              tappableDots={!!carouselRefGaleri}
            />
          </View> */}

          <View
            style={{
              marginLeft: 25,
              marginVertical: 20,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H2", device),
              }}
            >
              Berita Terkini
            </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(setBerita([]));
                dispatch(setGaleri([]));
                navigation.navigate("ListBanner");
              }}
              style={{ flex: 1, alignItems: "flex-end", marginRight: 30 }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                  flex: 1,
                  color: "#1868AB",
                }}
              >
                Selengkapnya
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.containerr}>
            <Carousel
              ref={carouselRefCombine}
              sliderWidth={screenWidth}
              sliderHeight={screenWidth}
              itemWidth={getWidthCarousel()}
              data={combineBanner.slice(0, 5)}
              renderItem={({ item }, parallaxProps) => (
                <BeritaHome
                  parallaxProps={parallaxProps}
                  item={item}
                  token={token}
                  setModalVisibleVideo={setModalVisibleVideo}
                  tanggal={item?.time}
                />
              )}
              hasParallaxImages={true}
              onSnapToItem={setSlide5}
            />
          </View>
        </ScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  containerCard: {
    backgroundColor: "#F4F7FE",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 36,
    marginLeft: 20,
  },
  containerr: {
    flex: 1,
  },
  imageContainer: {
    flex: 1, // Prevent a random Android rendering issue
    backgroundColor: "white",
    // borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  images: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  galeri: {
    flex: 1, // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
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
  cardVisiMisi: {
    backgroundColor: COLORS.primary,
    width: 77,
    height: 30,
    marginHorizontal: 15,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  items: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 1, // approximate a square
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  itemText: {
    color: "#fff",
  },
  cardApps: {
    width: wp(15),
    height: hp(7),
    borderRadius: 8,
  },
  cardAppsTablet: {
    width: wp(15),
    height: hp(10),
    borderRadius: 8,
  },
  map: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    width: 310,
    height: 310,
    marginBottom: 20,
  },
  dot: {
    width: _size,
    height: _size,
    borderRadius: _size,
    backgroundColor: _color,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
