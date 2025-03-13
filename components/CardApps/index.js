import React, { Fragment, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  FontAwesome,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome6,
  Octicons,
} from "@expo/vector-icons";
import {
  COLORS,
  FONTSIZE,
  fontSizeResponsive,
  getOrientation,
  imageApps,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Device from "expo-device";
import {
  getMenu,
  getMenuLite,
  getMenuType,
  getTokenValue,
  setMenu,
} from "../../service/session";
import { setTypeMenu } from "../../store/SuperApps";
import { setSelectedAttr } from "../../store/profile";
import { getCheckProdHuk } from "../../service/api";

export const CardApps = ({
  handlePressModal,
  setModalBankom,
  setModalKepegawaian,
  closeBottomSheet,
}) => {
  const navigation = useNavigation();
  const [listMenu, setListMenu] = useState([]);
  const isFocused = useIsFocused();
  const { profile, typeMenu } = useSelector((state) => state.superApps);
  const { profile: profileKores = {} } = useSelector((state) => state.profile);
  const { checkProdukHukum } = useSelector((state) => state.produkHukum);
  const { device } = useSelector((state) => state.apps);
  const [limitCard, setLimitCard] = useState(0);
  const { width, height } = useWindowDimensions();
  const [token, setToken] = useState("");
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const roleEvent = ["EVENT.USER"];
  const roleKalender = ["CALENDAR.USER"];
  const roleKalenderSatker = ["CALENDAR_SATKER"];
  const rolePreShare = ["PRESHARE.USER"];
  const roleTaskManagement = ["TASK.USER"];
  const roleLaporan = ["LAPORAN_BSRE"];
  const rolePerizinanMenteri = ["PERIZINAN_MENTERI"];
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

  const isRoleKalenderSatker = profile.roles_access?.some((item) =>
    roleKalenderSatker.includes(item)
  );

  const isRolePreShare = profile.roles_access?.some((item) =>
    rolePreShare.includes(item)
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
  const isRoleProdukHukum = profile.roles_access?.some((item) =>
    dataRoleDashboardProdukHukum.includes(item)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let orientation = getOrientation(width, height);
    let tempLimit = 0;
    if (device === "tablet") {
      if (orientation === "landscape") {
        tempLimit = 7;
      } else if (orientation === "potrait") {
        tempLimit = width >= 834 ? 7 : 5;
      }
    } else {
      tempLimit = 7;
    }
    setLimitCard(tempLimit);
  }, [width]);
  useEffect(() => {
    if (isRoleProdukHukum == false) {
      dispatch(getCheckProdHuk({ token: token }));
    }
  }, [profile]);
  useEffect(() => {
    let tmpMenu = [];
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
            tablet: 60,
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
            tablet: 70,
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
        navigation: "ListAplikasiKepegawaian",
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
        title: "Pengembangan Kompetensi",
        navigation: "ListAplikasiKepegawaian",
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
      tmpMenu.splice(7, 0, {
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
    if (isRoleKalender && isRoleKalenderSatker) {
      tmpMenu.splice(4, 0, {
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
    } else if (isRoleKalender) {
      tmpMenu.splice(4, 0, {
        title: "Kalender",
        navigation: "MainGrupKalender",
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
    } else if (isRoleKalenderSatker) {
      tmpMenu.splice(4, 0, {
        title: "Kalender",
        navigation: "MainKalenderSatker",
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
    } else {
      tmpMenu.splice(4, 0, {
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
      tmpMenu.splice(5, 0, {
        title: "Perizinan Menteri",
        navigation: "MainPerizinanMenteri",
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
    if (checkProdukHukum || isRoleProdukHukum || profile?.nip == "88888") {
      tmpMenu.splice(6, 0, {
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
    setMenu(JSON.stringify(tmpMenu));
    getMenuType().then((val) => {
      try {
        const parsedVal = JSON.parse(val);
        dispatch(setTypeMenu(parsedVal));
      } catch (e) {
        console.error("JSON Parse error:", e);
      }
    });
  }, [profile, checkProdukHukum]);

  useEffect(() => {
    if (typeMenu !== null) {
      if (typeMenu === false) {
        getMenu().then((val) => {
          try {
            const parsedVal = JSON.parse(val);
            if (parsedVal === null) {
              setListMenu(JSON.stringify(tmpMenu));
            } else {
              setListMenu(parsedVal);
            }
          } catch (e) {
            console.error("JSON Parse error:", e);
          }
        });
      } else {
        getMenuLite(profile.nip).then((val) => {
          try {
            const parsedVal = JSON.parse(val);
            if (parsedVal !== null) {
              setListMenu(parsedVal);
            } else {
              setListMenu([]);
            }
          } catch (e) {
            console.error("JSON Parse error:", e);
          }
        });
      }
    }
  }, [typeMenu, isFocused, profile.nip, checkProdukHukum]);

  return (
    <>
      {listMenu.length === 0 ? null : (
        <View
          style={[
            styles.card,
            {
              minHeight: "auto",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              gap: device === "tablet" ? 24 : width <= 384 ? 0 : 2,
              justifyContent: listMenu.length > 8 ? "center" : null,
              alignItems: "flex-start",
              justifyContent: "center",
              flex: 1,
              flexWrap: "wrap",
              marginVertical: 5,
            }}
          >
            {listMenu &&
              listMenu.length > 0 &&
              listMenu.map((item, index) => {
                if (index < limitCard) {
                  return (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        width:
                          device === "tablet" ? 100 : width <= 375 ? "25%" : 73,
                        marginTop: 5,
                      }}
                      key={index}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (item.title === "Pengembangan Kompetensi") {
                            navigation.navigate(item.navigation, item.title);
                          } else if (item.title === "Kepegawaian") {
                            navigation.navigate(item.navigation, item.title);
                          } else {
                            if (item.title == "Korespondensi") {
                              dispatch(
                                setSelectedAttr({
                                  code: "",
                                  name: profileKores?.fullname?.split("/")[0],
                                })
                              );
                            }
                            navigation.navigate(item.navigation);
                          }
                        }}
                      >
                        <View
                          style={[
                            device == "tablet"
                              ? styles.cardAppsTablet
                              : styles.cardApps,
                            {
                              backgroundColor: COLORS.secondary,
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                              width:
                                device === "tablet"
                                  ? 100
                                  : width <= 375
                                  ? 53
                                  : 60,
                              height:
                                device === "tablet"
                                  ? 100
                                  : width <= 375
                                  ? 53
                                  : 60,
                            },
                          ]}
                        >
                          {item.title === "Task Management" ? (
                            <MaterialIcons
                              name="task-alt"
                              size={device === "tablet" ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Kalender" ? (
                            <FontAwesome
                              name="calendar"
                              size={device === "tablet" ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "KKP Drive" ? (
                            <Entypo
                              name="folder"
                              size={device === "tablet" ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Regulasi" ? (
                            <Entypo
                              name="shield"
                              size={device === "tablet" ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Survei Layanan" ? (
                            <MaterialCommunityIcons
                              name="email-newsletter"
                              size={device === "tablet" ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Event Management" ? (
                            <MaterialCommunityIcons
                              name="folder-star-multiple"
                              size={device === "tablet" ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "SPPD" ? (
                            <MaterialIcons
                              name="travel-explore"
                              size={device === "tablet" ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Kepegawaian" ? (
                            <FontAwesome6
                              name="people-line"
                              size={device === "tablet" ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Produk Hukum" ? (
                            <Octicons
                              name="file-badge"
                              size={device === "tablet" ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : (
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
                          )}
                        </View>
                      </TouchableOpacity>
                      <Text
                        style={{
                          marginTop: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H6", device),
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                  );
                }
              })}

            {listMenu && listMenu.length > limitCard && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  width: device === "tablet" ? 100 : width <= 375 ? "25%" : 73,
                  marginTop: 5,
                }}
              >
                <TouchableOpacity onPress={handlePressModal}>
                  <View
                    style={[
                      device == "tablet"
                        ? styles.cardAppsTablet
                        : styles.cardApps,
                      {
                        backgroundColor: COLORS.secondary,
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        width:
                          device === "tablet" ? 100 : width <= 375 ? 53 : 60,
                        height:
                          device === "tablet" ? 100 : width <= 375 ? 53 : 60,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="dashboard"
                      size={device === "tablet" ? 60 : 30}
                      color={COLORS.iconMenu}
                    />
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: fontSizeResponsive("H6", device),
                  }}
                >
                  More
                </Text>
              </View>
            )}
          </View>
          {/* {listMenu &&
              listMenu.length > 4 &&
              listMenu.map((item, index) => {
                if (index > 3 && index < 7)
                  return (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                      key={index}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (item.title === "Pengembangan Kompetensi") {
                            navigation.navigate(item.navigation, item.title);
                          } else if (item.title === "Kepegawaian") {
                            navigation.navigate(item.navigation, item.title);
                          } else {
                            navigation.navigate(item.navigation);
                          }
                        }}
                      >
                        <View
                          style={[
                            device == "tablet"
                              ? styles.cardAppsTablet
                              : styles.cardApps,
                            {
                              backgroundColor: COLORS.secondary,
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                            },
                          ]}
                        >
                          {item.title === "Task" ? (
                            <MaterialIcons
                              name="task-alt"
                              size={device === 'tablet' ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Kalender" ? (
                            <FontAwesome
                              name="calendar"
                              size={device === 'tablet' ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Preparing dan Sharing" ? (
                            <Entypo
                              name="folder"
                              size={device === 'tablet' ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Regulasi" ? (
                            <Entypo
                              name="shield"
                              size={device === 'tablet' ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Survei Layanan" ? (
                            <MaterialCommunityIcons
                              name="email-newsletter"
                              size={device === 'tablet' ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Event Management" ? (
                            <MaterialCommunityIcons
                              name="folder-star-multiple"
                              size={device === 'tablet' ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "SPPD" ? (
                            <MaterialIcons
                              name="travel-explore"
                              size={device === 'tablet' ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : item.title === "Kepegawaian" ? (
                            <FontAwesome6
                              name="people-line"
                              size={device === 'tablet' ? 60 : 30}
                              color={COLORS.iconMenu}
                            />
                          ) : (
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
                          )}
                        </View>
                      </TouchableOpacity>
                      <Text
                        style={{
                          marginTop: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: fontSizeResponsive("H4", device),
                          width: item.titleStyle.width,
                        }}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                    </View>
                  );
              })} */}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    width: "100%",
    // height: hp(30),
    borderRadius: 12,
    padding: 10,
    //shadow ios
    shadowOffset: { width: -2, height: 4 },
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    // shadow android
    elevation: 1,
  },
  profile: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    left: 16,
  },
  cardApps: {
    borderRadius: 8,
  },
  cardAppsTablet: {
    borderRadius: 8,
  },
});
