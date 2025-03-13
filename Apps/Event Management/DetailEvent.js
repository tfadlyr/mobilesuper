import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { FlatList } from "react-native";
import { Modal } from "react-native";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Platform } from "react-native";
import moment from "moment/min/moment-with-locales";
import { Dropdown } from "../../components/DropDown";
import { deleteEvent, getEventDetail, updateStatus } from "../../service/api";
import { getTokenValue } from "../../service/session";
import { CardLampiran } from "../../components/CardLampiran";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CardItemMember } from "../../components/CardItemMember";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Portal } from "react-native-portalize";

export const DetailEvent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [kategori, setKategori] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [lampiranById, setLampiranById] = useState(null);
  const [token, setToken] = useState("");
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

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
  const bottomSheetClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const [visibleModalPeserta, setVisibleModalPeserta] = useState(false);

  const statusEvent = [
    { key: "siap", value: "persiapan" },
    { key: "pel", value: "pelaksanaan" },
    { key: "pas", value: "pasca" },
  ];

  const [document, setDocument] = useState([]);

  const getFileExtension = (type) => {
    let jenis = type.split(".");
    jenis = jenis[jenis.length - 1];
    return jenis;
  };

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    const params = { token: token, id: data.id };
    dispatch(getEventDetail(params));
  }, [kategori]);

  const video = useRef(null);
  const [status, setStatus] = useState({});

  const { event, loading } = useSelector((state) => state.event);
  const { profile } = useSelector((state) => state.superApps);

  const data = event.detailEvent;

  const { device } = useSelector((state) => state.apps);

  return (
    <GestureHandlerRootView>
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
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: FONTWEIGHT.bold,
                color: COLORS.white,
              }}
            >
              Detail Agenda Rapat
            </Text>
          </View>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: COLORS.white,
              padding: 16,
              borderRadius: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                // gap: wp(6),
                alignItems: "center",
              }}
            >
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={200}
                  height={20}
                />
              ) : (
                <Text
                  style={{
                    fontSize: fontSizeResponsive("Judul", device),
                    fontWeight: FONTWEIGHT.bold,
                    width: "45%",
                  }}
                >
                  {data.title}
                </Text>
              )}

              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <View
                  style={{
                    paddingHorizontal: device === "tablet" ? 20 : 10,
                    paddingVertical: device === "tablet" ? 10 : 5,
                    borderRadius: device === "tablet" ? 40 : 30,
                    backgroundColor: COLORS.infoLight,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.info,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {data.status}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                {data?.note !== "" && data?.note !== null ? data.note : "-"}
              </Text>
            </View>

            {/* custom divider */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginVertical: 20,
              }}
            />

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: "45%",
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Tanggal
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <View style={{ width: "55%" }}>
                  {data?.start_date !== "" && data?.start_date !== null ? (
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      {moment(data.start_date).locale("id").format("d MMM yyy")}{" "}
                      -{" "}
                    </Text>
                  ) : (
                    "-"
                  )}
                  {data?.end_date !== "" && data?.end_date !== null ? (
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      {moment(data.end_date).locale("id").format("d MMM yyy")}
                    </Text>
                  ) : (
                    ""
                  )}
                </View>
              )}
            </View>

            {/* custom divider */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginVertical: 20,
              }}
            />

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: "45%",
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Tempat
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <Text
                  style={{
                    width: "55%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {data?.location !== "" && data?.location !== null
                    ? data.location
                    : "-"}
                </Text>
              )}
            </View>

            {/* custom divider */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginVertical: 20,
              }}
            />

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: "45%",
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Pimpinan Agenda Rapat
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <Text
                  style={{
                    width: "55%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {data?.extra_attrs?.pic?.title?.name !== "" &&
                  data?.extra_attrs?.pic?.title?.name !== null
                    ? data.extra_attrs?.pic.title.name
                    : "-"}
                </Text>
              )}
            </View>

            {/* custom divider */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginVertical: 20,
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: "45%",
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Peserta Agenda Rapat
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : data.extra_attrs?.members?.length !== 0 ? (
                data.extra_attrs?.members?.length >= 3 ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      {data.extra_attrs?.members
                        ?.slice(0, 3)
                        .map((data, index) => (
                          <View key={data.id} style={{ position: "relative" }}>
                            <Image
                              source={{ uri: data.avatar_url }}
                              style={{
                                width: device === "tablet" ? 60 : 26,
                                height: device === "tablet" ? 60 : 26,
                                marginLeft: index !== 0 ? -7 : 0,
                                borderRadius: 50,
                              }}
                            />
                          </View>
                        ))}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        bottomSheetAttach();
                      }}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={device === "tablet" ? 40 : 24}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  data.extra_attrs?.members?.slice(0, 3).map((data, index) => (
                    <View key={data.id} style={{ position: "relative" }}>
                      <Image
                        source={{ uri: data.avatar_url }}
                        style={{
                          width: device === "tablet" ? 60 : 26,
                          height: device === "tablet" ? 60 : 26,
                          marginLeft: index !== 0 ? -7 : 0,
                          borderRadius: 50,
                        }}
                      />
                    </View>
                  ))
                )
              ) : (
                "-"
              )}
              {/* <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                                <Ionicons name='chevron-forward-outline' size={24} color={COLORS.lighter} />
                            </TouchableOpacity> */}
            </View>
            <Portal>
              <BottomSheetModalProvider>
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
                  <BottomSheetView onLayout={handleContentLayout}>
                    <View style={{ marginTop: 20, marginBottom: 40 }}>
                      <View
                        style={{
                          margin: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H2", device),
                            fontWeight: FONTWEIGHT.bold,
                            color: COLORS.normal,
                          }}
                        >
                          Peserta Agenda Rapat
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            bottomSheetClose();
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
                        <FlatList
                          data={data.extra_attrs?.members}
                          renderItem={({ item }) => (
                            <View key={item.nip}>
                              <CardItemMember item={item} device={device} />
                            </View>
                          )}
                          keyExtractor={(item) => item.id}
                        />
                      </View>
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>
              </BottomSheetModalProvider>
            </Portal>
            {/* custom divider */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginVertical: 20,
              }}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  width: "45%",
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Peserta Agenda Rapat Eksternal
              </Text>
              <View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : data.extra_attrs?.guest_external?.length !== 0 ? (
                  data.extra_attrs?.guest_external?.map((data, index) => (
                    <View
                      key={data.id}
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {"-"}
                      </Text>
                      {/* <Image source={{ uri: data.avatar_url }} style={{ width: 26, height: 26, marginLeft: index !== 0 ? -7 : 0, borderRadius: 50 }} /> */}
                      <Text
                        style={{
                          width: 150,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {data.name}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    {"-"}
                  </Text>
                )}
              </View>
              {/* <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                                <Ionicons name='chevron-forward-outline' size={24} color={COLORS.lighter} />
                            </TouchableOpacity> */}
            </View>

            {/* custom divider */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginVertical: 20,
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: "45%",
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Notulen
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : data.extra_attrs?.notulen?.length !== 0 ? (
                data.extra_attrs?.notulen?.map((data, index) => (
                  <View key={data.id} style={{ position: "relative" }}>
                    {/* <Image source={{ uri: data.avatar_url }} style={{ width: 26, height: 26, marginLeft: index !== 0 ? -7 : 0, borderRadius: 50 }} /> */}
                    <Text
                      style={{
                        width: "100%",
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {data.nama}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {"-"}
                </Text>
              )}
              {/* <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                                <Ionicons name='chevron-forward-outline' size={24} color={COLORS.lighter} />
                            </TouchableOpacity> */}
            </View>

            {/* custom divider */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginVertical: 20,
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: "45%",
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Petugas Absen
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : data.extra_attrs?.presensi?.length !== 0 ? (
                data.extra_attrs?.presensi?.map((item) => (
                  <View>
                    <Text
                      style={{
                        width: "100%",
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {item.nama}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {"-"}
                </Text>
              )}
              {/* <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                                <Ionicons name='chevron-forward-outline' size={24} color={COLORS.lighter} />
                            </TouchableOpacity> */}
            </View>

            {/* custom divider */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginVertical: 20,
              }}
            />

            <Text
              style={{
                width: 150,
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Lampiran
            </Text>
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4, marginTop: 20 }}
                width={100}
                height={100}
              />
            ) : data?.attachments?.length !== 0 ? (
              <FlatList
                key={"*"}
                data={data.attachments}
                renderItem={({ item }) => (
                  <View key={item.id}>
                    <CardLampiran
                      lampiran={item.file}
                      type={getFileExtension(item.name)}
                      onClick={() => {
                        setVisibleModal(true);
                        setLampiranById(item);
                      }}
                    />
                  </View>
                )}
                scrollEnabled={false}
                style={{ marginTop: 10 }}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginHorizontal: 15,
                  gap: 5,
                }}
                numColumns={3}
                keyExtractor={(item) => "*" + item.id}
              />
            ) : (
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                {"-"}
              </Text>
            )}

            {lampiranById !== null ? (
              <Modal
                animationType="fade"
                transparent={true}
                visible={visibleModal}
                onRequestClose={() => {
                  setVisibleModal(false);
                  setLampiranById(null);
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
                      setVisibleModal(false);
                      setLampiranById(null);
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
                  {getFileExtension(lampiranById.name) === "png" ||
                  getFileExtension(lampiranById.name) === "jpg" ||
                  getFileExtension(lampiranById.name) === "jpeg" ? (
                    <View>
                      <Image
                        source={{ uri: lampiranById.file }}
                        style={{ width: 390, height: 283 }}
                      />
                    </View>
                  ) : getFileExtension(lampiranById.name) === "mp4" ? (
                    <Video
                      ref={video}
                      style={{ width: 390, height: 283 }}
                      source={lampiranById.gambar}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                      isLooping
                      onPlaybackStatusUpdate={(status) =>
                        setStatus(() => status)
                      }
                    />
                  ) : (
                    <></>
                  )}
                </View>
              </Modal>
            ) : null}
          </View>
        </View>

        {data.user_role?.is_pic === true ||
        data.creator?.nip === profile.nip ? (
          <View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                marginHorizontal: "5%",
              }}
            >
              {/* <TouchableOpacity style={{
                                    backgroundColor: COLORS.info,
                                    width: 134,
                                    height: 50,
                                    borderRadius: 8
                                }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flex: 1, gap: 20 }}>
                                        <Text style={{ color: COLORS.white }}>Persiapan</Text>
                                        <Ionicons name='chevron-forward-outline' size={20} color={COLORS.white} />
                                    </View>
                                </TouchableOpacity> */}
              <View style={{ width: "100%" }}>
                <Dropdown
                  data={statusEvent}
                  setSelected={setKategori}
                  handleClick={(item) => {
                    dispatch(
                      updateStatus({
                        token: token,
                        id: data.id,
                        status: item.value,
                      })
                    );
                  }}
                  borderWidth={1}
                  borderColor={COLORS.ExtraDivinder}
                  borderwidthDrop={1}
                  borderColorDrop={COLORS.ExtraDivinder}
                  borderWidthValue={1}
                  borderColorValue={COLORS.ExtraDivinder}
                  placeHolder={data.status}
                  backgroundColor={COLORS.info}
                  textColor={COLORS.white}
                />
              </View>

              <View
                style={{
                  flexDirection: "column",
                  marginTop: 10,
                  marginBottom: 20,
                  rowGap: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.lightBrown,
                      width: "49%",
                      paddingVertical: 15,
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      navigation.navigate("EditEvent");
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        flex: 1,
                        gap: 20,
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H3", device),
                        }}
                      >
                        Ubah Agenda Rapat
                      </Text>
                      {/* <Ionicons
                      name="pencil-outline"
                      size={device === "tablet" ? 30 : 20}
                      color={COLORS.white}
                    /> */}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.infoDanger,
                      width: "49%",
                      paddingVertical: 15,
                      borderRadius: 8,
                    }}
                    onPress={() => setVisibleModal(true)}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        flex: 1,
                        gap: 20,
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Hapus Agenda Rapat
                      </Text>
                      {/* <Ionicons
                        name="trash-outline"
                        size={device === "tablet" ? 30 : 20}
                        color={COLORS.white}
                      /> */}
                    </View>
                  </TouchableOpacity>
                </View>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={visibleModal}
                  onRequestClose={() => {
                    setVisibleModal(!visibleModal);
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
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.white,
                        width: "90%",
                        borderRadius: 10,
                        alignContent: "center",
                      }}
                    >
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginHorizontal: 20,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("Judul", device),
                              fontWeight: FONTWEIGHT.bold,
                            }}
                          >
                            Apa anda yakin?
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={{}}
                          onPress={() => {
                            setVisibleModal(false);
                          }}
                        >
                          <Ionicons
                            name="close-outline"
                            size={24}
                            color={COLORS.lighter}
                          />
                        </TouchableOpacity>
                      </View>
                      {/* custom divider */}
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            height: 1,
                            width: "90%",
                            backgroundColor: "#DBDADE",
                            marginVertical: 10,
                          }}
                        />
                      </View>

                      <ScrollView style={{ marginBottom: 40 }}>
                        <TouchableOpacity
                          style={{
                            width: "90%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 8,
                            marginHorizontal: 20,
                            marginTop: 10,
                            backgroundColor: COLORS.danger,
                          }}
                          onPress={() => {
                            const datas = {
                              token: token,
                              id: data.id,
                            };
                            dispatch(deleteEvent(datas));
                            setTimeout(() => {
                              navigation.navigate("HalamanUtama");
                            }, 3000);
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.white,
                              fontSize: fontSizeResponsive("H3", device),
                            }}
                          >
                            Hapus Event
                          </Text>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              {/* <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.foundation,
                    width: Platform.OS === "ios" ? "90%" : "91%",
                    height: 50,
                    borderRadius: 8,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      flex: 1,
                      gap: 20,
                    }}
                  >
                    <Text style={{ color: COLORS.white }}>Kirim Notifikasi</Text>
                    <Ionicons
                      name="notifications-outline"
                      size={20}
                      color={COLORS.white}
                    />
                  </View>
                </TouchableOpacity> */}
            </View>
          </View>
        ) : (
          <></>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "white",
    height: 28,
    width: 28,
    borderRadius: 50,
  },
  imageIos: {
    width: 390,
    height: 260,
    resizeMode: "cover",
  },
  imageAndroid: {
    width: 420,
    height: 260,
    resizeMode: "cover",
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.7,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.7,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
