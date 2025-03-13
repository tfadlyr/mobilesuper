import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  AVATAR,
  COLORS,
  DATETIME,
  FONTSIZE,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import Carousel, {
  Pagination,
  ParallaxImage,
} from "react-native-snap-carousel";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { useEffect } from "react";
import { Image } from "react-native";
import { useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setAgendaDetail } from "../../store/GrupKalender";
import {} from "react-native-safe-area-context";
import moment from "moment/min/moment-with-locales";
import { deleteAgendaGrup, getDetailGrup } from "../../service/api";
import { getTokenValue } from "../../service/session";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

export const DetailAcara = ({ route }) => {
  const { idKategori } = route.params;
  const [tabItemIndex, setTabItemIndex] = useState();
  const [slide, setSlide] = useState(0);
  const [komen, setKomen] = useState("");
  const carouselRef = useRef(null);
  const navigation = useNavigation();
  const [token, setToken] = useState("");

  const bottomSheetModalRef = useRef(null);
  const initialSnapPoints = useMemo(() => ["95%"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  });

  const dispatch = useDispatch();

  const { agenda, acara, loading, detailGrup } = useSelector(
    (state) => state.grupKalender
  );
  const { profile } = useSelector((state) => state.superApps);
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

  const isRoleMember = detailGrup?.extra_attributes?.members_list.includes(
    profile?.nip
  );
  const detail = acara.detail;
  const gambar = agenda.detail.gambar;

  const [toggleComment, setToggleComment] = useState({
    toggle: false,
    // id: data[0].Komentar[0].id
  });
  const clickBalas = (id, temp) => {
    setToggleComment({
      toggle: temp,
      id: id,
    });
  };

  const convertDate = (tanggal) => {
    const parts = tanggal?.split(" ");

    const months = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    const time = parts[3].split(":");
    const hour = parseInt(time[0]);
    const minute = parseInt(time[1]);
    const second = parseInt(time[2]);

    const date = new Date(year, month, day, hour, minute, second);
    const formatedDate = moment(date).format(DATETIME.LONG_DATE);

    return formatedDate;
  };

  const { device } = useSelector((state) => state.apps);

  return (
    <>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.primary,
                height: 80,
              }}
            >
              <View
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
              </View>
              <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("Judul", device),
                    fontWeight: 600,
                    color: COLORS.white,
                  }}
                >
                  Detail Kalender
                </Text>
              </View>
            </View>

            <View style={styles.container}>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "90%",
                  borderRadius: 8,
                }}
              >
                {loading ? (
                  <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                    <ShimmerPlaceHolder
                      style={{ borderRadius: 4 }}
                      width={100}
                      height={20}
                    />
                  </View>
                ) : (
                  <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("Judul", device),
                      }}
                    >
                      {detail.name}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: 10,
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Dibuat Pada :
                  </Text>
                  {loading ? (
                    <ShimmerPlaceHolder
                      style={{ borderRadius: 4 }}
                      width={100}
                      height={20}
                    />
                  ) : (
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      {detail?.created_at === undefined
                        ? ""
                        : convertDate(detail?.created_at)}
                    </Text>
                  )}
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Lokasi
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          {detail.location}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Waktu Mulai
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          {moment(detail?.start_date)
                            .locale("id")
                            .format(DATETIME.LONG_DATETIME)}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Waktu Selesai
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          {moment(detail?.end_date)
                            .locale("id")
                            .format(DATETIME.LONG_DATETIME)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        PIC
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        {detail && Array.isArray(detail.pic)
                          ? detail?.pic?.map((item, index) => {
                              return (
                                <View
                                  key={index}
                                  style={{
                                    flexDirection: "row",
                                    gap: 10,
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    source={{ uri: item.avatar_url }}
                                    style={{
                                      marginLeft: -8,
                                      borderWidth: 2,
                                      borderRadius: 50,
                                      borderColor: COLORS.white,
                                      width: device === "tablet" ? 50 : 30,
                                      height: device === "tablet" ? 50 : 30,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                    }}
                                  >
                                    {item.nama}
                                  </Text>
                                </View>
                              );
                            })
                          : null}
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Anggota
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        {detail && Array.isArray(detail.members)
                          ? detail?.members?.map((item, index) => {
                              return (
                                <View key={index}>
                                  <Image
                                    source={{ uri: item.avatar_url }}
                                    style={{
                                      marginLeft: -8,
                                      borderWidth: 2,
                                      borderRadius: 50,
                                      borderColor: COLORS.white,
                                      width: device === "tablet" ? 50 : 30,
                                      height: device === "tablet" ? 50 : 30,
                                    }}
                                  />
                                </View>
                              );
                            })
                          : null}
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Ketentuan Busana
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          {detail.dresscode == null ? "-" : detail.dresscode}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Pengingat
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          {detail.reminder}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginVertical: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Catatan
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          {detail.extra_attributes?.catatan == null
                            ? "-"
                            : detail.extra_attributes.catatan}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
            {/* {isRoleMember === false ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    let data = {
                      token: token,
                      id: detail.id,
                    };
                    dispatch(deleteAgendaGrup(data));
                    navigation.navigate("GrupKalender");
                  }}
                  style={{
                    backgroundColor: COLORS.primary,
                    width: "90%",
                    marginHorizontal: 20,
                    marginVertical: 20,
                    padding: 15,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: COLORS.white }}>Hapus</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    dispatch(getDetailGrup({ token: token, id: detail.id }));
                    navigation.navigate("EditAgendaGrup", {
                      idKategori: idKategori,
                    });
                  }}
                  style={{
                    borderColor: COLORS.primary,
                    width: "90%",
                    marginHorizontal: 20,
                    padding: 15,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                  }}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
              </>
            ) : null} */}
          </ScrollView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1, // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 40,
    marginTop: 20,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
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
  container: {
    marginTop: 20,
    flex: 1,
    alignItems: "center",
  },
});
