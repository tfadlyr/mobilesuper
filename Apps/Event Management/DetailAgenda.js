import React, { useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Text } from "react-native";
import {} from "react-native-safe-area-context";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import { Image } from "react-native";
import { Modal } from "react-native";
import { StyleSheet } from "react-native";
import { CardItemMember } from "../../components/CardItemMember";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { Search } from "../../components/Search";
import { Portal } from "react-native-portalize";
import moment from "moment/min/moment-with-locales";
import { getTokenValue } from "../../service/session";
import {
  deleteNotulensi,
  getDetailNotulensi,
  getEventAgendaDetail,
  getlistAbsen,
  getlistApprover,
  getlistNotulensi,
  postNotulensi,
  putAbsen,
  readyToApprove,
} from "../../service/api";
import QRCode from "react-native-qrcode-svg";
import { BarCodeScanner } from "expo-barcode-scanner";
import ListEmpty from "../../components/ListEmpty";
import * as DocumentPicker from "expo-document-picker";
import { Pressable } from "react-native";
import { CardLampiran } from "../../components/CardLampiran";
import { CardApprovalEvent } from "../../components/CardApprovalEvent";
import { CardListAbsenEvent } from "../../components/CardListAbsenEvent";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { setRefresh } from "../../store/Event";
import { ResizeMode, Video } from "expo-av";

export const DetailAgenda = () => {
  const navigation = useNavigation();

  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalPeserta, setVisibleModalPeserta] = useState(false);
  const [lampiranById, setLampiranById] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

  const getFileExtension = (type) => {
    let jenis = type.split(".");
    jenis = jenis[jenis.length - 1];
    return jenis;
  };

  const video = useRef(null);

  const { agenda, approver, notulensi, absen, event, loading, refresh } =
    useSelector((state) => state.event);
  const data = agenda.detail;
  const id = agenda.detail?.notulensi?.id;
  const idagenda = agenda.detail?.id;
  const idnotu = notulensi.lists[0]?.id;
  const notu = notulensi.lists;
  // const idabsen = absen.lists[0]?.id
  const absenLists = absen.lists;
  const [token, setToken] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getlistApprover({ token, id }));
      dispatch(getlistNotulensi({ token, idagenda }));
      dispatch(getDetailNotulensi({ token, idnotu }));
      dispatch(getlistAbsen({ token, idagenda }));
    }
  }, [token]);

  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalRefPeserta = useRef(null);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  const bottomSheetAttachPeserta = () => {
    bottomSheetModalRefPeserta.current?.present();
  };

  const bottomSheetAttachPesertaClose = () => {
    if (bottomSheetModalRefPeserta.current)
      bottomSheetModalRefPeserta.current?.close();
  };

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const [hasPermission, setHasPermission] = useState(null);
  const [scanData, setScanData] = useState(true);

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const askForCameraPermission = () => {
    (async () => {
      const { label } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(label === "granted");
    })();
  };

  const [idabsen, setIdAbsen] = useState("");

  const handleBarCodeScanned = ({ type, data }) => {
    setScanData(true);
    if (data !== " ") {
      dispatch(
        putAbsen({
          token: token,
          idabsen: idabsen,
          status: "hadir",
          is_scan: true,
          id_Qr: data,
        })
      );
    }
  };

  const [document, setDocument] = useState(null);
  const [type, setType] = useState(null);

  const pickDocument = async (text) => {
    let result = await DocumentPicker.getDocumentAsync({});
    // const file = convertFileToObject(result)
    let tipe = result.assets[0].uri.split("/");
    tipe = tipe[tipe.length - 1];
    tipe = tipe.split(".");
    tipe = tipe[tipe.length - 1];
    setDocument(result);
    setType(tipe);
    const data = {
      token: token,
      result: result,
    };
  };

  const handleSubmitNotulensi = () => {
    const item = {
      token: token,
      agenda_id: data.id,
      pdf: document,
    };
    dispatch(postNotulensi(item));
  };

  const handleDelete = () => {
    const item = {
      token: token,
      agenda_id: data.id,
      id: notu[0].id,
    };
    dispatch(deleteNotulensi(item));
    dispatch(setRefresh(true));
  };

  useEffect(() => {
    if (refresh === true) {
      dispatch(getlistNotulensi({ token, idagenda }));
      const params = { token: token, id: data.id };
      dispatch(getEventAgendaDetail(params));
      dispatch(setRefresh(false));
    }
  }, [refresh]);

  const { device } = useSelector((state) => state.apps);
  const { profile } = useSelector((state) => state.superApps);

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(absenLists);
  }, [absenLists]);

  useEffect(() => {
    if (search !== "") {
      const data = absenLists?.filter((item) => {
        return item.member?.nama.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(absenLists);
    }
  }, [search]);

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            backgroundColor: COLORS.primary,
            height: 80,
            paddingBottom: 20,
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
              Detail Agenda
            </Text>
          </View>
        </View>

        <View
          key={data.id}
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
            <View style={{ flexDirection: "row", gap: 20 }}>
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
                  }}
                >
                  {data.title}
                </Text>
              )}
              {/* <View
                                style={{
                                    width: 80,
                                    height: 24,
                                    backgroundColor: COLORS.lighter,
                                    borderRadius: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ color: COLORS.white }}>{data.jenis}</Text>
                            </View> */}
            </View>
            {data.note === "" ? (
              <Text
                style={{
                  marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                -
              </Text>
            ) : (
              <Text
                style={{
                  marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {data.note}
              </Text>
            )}

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
                QR Code
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : data.qr_presensi === null ? (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  -
                </Text>
              ) : (
                <QRCode value={data.qr_presensi?.qr_code} />
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
                Tanggal
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : data.date === null ? (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  -
                </Text>
              ) : (
                <Text
                  style={{
                    width: "55%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {moment(data.date).locale("id").format(DATETIME.LONG_DATE)}
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
                Waktu
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : data.start_time === null || data.end_time === null ? (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  -
                </Text>
              ) : (
                <View style={{ flexDirection: "row", width: "55%" }}>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {moment(data.start_time, "HH:mm:ss")
                      .locale("id")
                      .format("HH:mm")}{" "}
                    -{" "}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {moment(data.end_time, "HH:mm:ss")
                      .locale("id")
                      .format("HH:mm")}
                  </Text>
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
              ) : data.location === null ? (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  -
                </Text>
              ) : (
                <Text
                  style={{
                    width: "55%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {data.location}
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
                PIC
              </Text>
              {/* <Image source={{ uri: data.extra_attrs?.pic?.avatar_url }} style={{ width: 26, height: 26, borderRadius: 50 }} /> */}
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : data.extra_attrs === null ? (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  -
                </Text>
              ) : (
                <Text
                  style={{
                    width: "55%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {data.extra_attrs?.pic.title.name}
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

            {/* <View style={{ flexDirection: 'row' }}>
                            <Text style={{ width: 150, fontWeight: FONTWEIGHT.bold }}>Peserta Agenda</Text>
                            {loading ? (
                                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={20} />
                            ) : (
                                data.extra_attrs?.members?.map((data, index) =>
                                    <View key={index} style={{ position: 'relative' }}>
                                        <Image source={{ uri: data.avatar_url }} style={{ width: 26, height: 26, marginLeft: index !== 0 ? -7 : 0, borderRadius: 50 }} />
                                    </View>
                                )
                            )}
                            
                        </View> */}

            {/* <View style={{ flexDirection: 'row' }}>
                            {loading ? (
                                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={20} />
                            ) : (
                                data.extra_attrs?.members?.map((data, index) =>
                                    <View key={index} style={{ position: 'relative' }}>
                                        <Image source={{ uri: data.avatar_url }} style={{ width: 26, height: 26, marginLeft: index !== 0 ? -7 : 0, borderRadius: 50 }} />
                                    </View>
                                )
                            )}
                            
                        </View>  */}

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: "45%",
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Peserta Agenda
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                data.extra_attrs?.members?.map((data, index) => (
                  <View key={index} style={{ position: "relative" }}>
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
              )}
              <TouchableOpacity
                style={{ flex: 1, alignItems: "flex-end", marginRight: 10 }}
                onPress={() => bottomSheetAttachPeserta()}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={device === "tablet" ? 40 : 24}
                  color={COLORS.lighter}
                />
              </TouchableOpacity>
            </View>

            <BottomSheetModal
              ref={bottomSheetModalRefPeserta}
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
                        bottomSheetAttachPesertaClose();
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
                      scrollEnabled={true}
                      keyExtractor={(item) => item.id}
                    />
                  </View>
                </View>
              </BottomSheetView>
            </BottomSheetModal>

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
                Tamu Agenda Internal
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : data.extra_attrs.guests.length === 0 ? (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  -
                </Text>
              ) : (
                data.extra_attrs?.guests?.map((data, index) => (
                  <View key={index} style={{ position: "relative" }}>
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
                marginVertical: 10,
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
                Tamu Agenda Eksternal
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : data.extra_attrs.guest_external.length === 0 ? (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  -
                </Text>
              ) : (
                <View
                  style={{
                    position: "relative",
                    flexDirection: "column",
                    width: "55%",
                  }}
                >
                  {data.extra_attrs?.guest_external?.map((data, index) => (
                    <View key={index} style={{ flexDirection: "row", gap: 10 }}>
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                      <Text
                        style={{
                          width: 150,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {data.name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* <View style={{ flexDirection: 'row', }}>
                            <Text style={{ width: 150, fontWeight: FONTWEIGHT.bold }}>QR Code</Text>
                            {loading ? (
                                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={20} />
                            ) : (

                                data.qr_presensi === null ? (
                                    <Text>-</Text>
                                ) : (
                                    <QRCode
                                        value={data.qr_presensi?.qr_code}
                                    />
                                )
                            )}
                        </View> */}
          </View>

          <View
            style={{
              width: "90%",
              backgroundColor: COLORS.white,
              padding: 16,
              borderRadius: 16,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Status Approval
            </Text>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginVertical: 10 }}>
                            <Ionicons name='people-outline' size={24} />
                            <Text>0/15</Text>
                        </View> */}
            <TouchableOpacity
              style={{
                width: "100%",
                height: 50,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                borderWidth: 1,
                borderColor: COLORS.infoDangerLight,
                marginTop: 10,
              }}
              onPress={() => {
                bottomSheetAttach();
              }}
            >
              <Ionicons
                name="document-outline"
                size={device === "tablet" ? 40 : 24}
              />
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                Info Approval
              </Text>
            </TouchableOpacity>
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
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 20,
                        marginTop: 20,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => bottomSheetAttachClose()}
                      >
                        <Ionicons name="chevron-back-outline" size={24} />
                      </TouchableOpacity>
                      <View
                        style={{
                          alignItems: "center",
                          flex: 1,
                          marginRight: 20,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H1", device),
                            fontWeight: 500,
                          }}
                        >
                          Approval
                        </Text>
                      </View>
                    </View>

                    {/* <View style={{ width: '90%', marginHorizontal: 20, marginTop: 20 }}>
                                            <Search
                                                placeholder={'Cari'}
                                            />
                                        </View> */}

                    <FlatList
                      data={approver.lists}
                      renderItem={({ item }) => (
                        <View key={item.id}>
                          <CardApprovalEvent
                            item={item}
                            id={item.id}
                            device={device}
                          />
                        </View>
                      )}
                      keyExtractor={(item) => item.id}
                      style={{ marginBottom: 40 }}
                    />
                  </View>
                </BottomSheetView>
              </BottomSheetModal>
            </BottomSheetModalProvider>
          </Portal>

          <View
            style={{
              width: "90%",
              backgroundColor: COLORS.white,
              padding: 16,
              borderRadius: 16,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Notulensi
            </Text>

            {data.user_role?.is_pic === true &&
            !notu[0]?.ready_to_approve &&
            notu.length !== 0 &&
            data?.notulensi?.ready_to_approve === false ? (
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: 50,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  backgroundColor: COLORS.primary,
                  marginTop: 10,
                }}
                onPress={() => {
                  const data = {
                    token: token,
                    id: notu[0].id,
                  };
                  dispatch(readyToApprove(data));
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Ready To Approve
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}

            {notu.length === 0 && event.detailEvent.status !== "persiapan" ? (
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: 50,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  backgroundColor: COLORS.lightBrown,
                  marginTop: 10,
                }}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Unggah Notulensi{" "}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                {(event.detailEvent?.user_role?.is_pic === true &&
                  event.detailEvent.status !== "persiapan") ||
                (data.user_role?.is_pic === true &&
                  event.detailEvent.status !== "persiapan") ||
                (data.user_role?.is_notulensi === true &&
                  event.detailEvent.status !== "persiapan") ||
                (data.user_role?.is_member === true &&
                  event.detailEvent.status !== "persiapan") ||
                (data.user_role?.is_presensi === true &&
                  event.detailEvent.status !== "persiapan") ||
                (data.creator?.nip === profile.nip &&
                  event.detailEvent.status !== "persiapan") ? (
                  <View>
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        height: 50,
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        backgroundColor: COLORS.foundation,
                        marginTop: 10,
                      }}
                      onPress={() => {
                        navigation.navigate("Notulensi", { data: data });
                      }}
                    >
                      <Ionicons
                        name="document-outline"
                        size={24}
                        color={COLORS.white}
                      />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Lihat Notulensi
                      </Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={{
                                            width: '100%',
                                            height: 50,
                                            borderRadius: 8,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 10,
                                            backgroundColor: COLORS.infoDanger,
                                            marginTop: 10
                                        }}
                                            onPress={() => {
                                                handleDelete()
                                            }}
                                        >
                                            <Ionicons name='trash-outline' size={24} color={COLORS.white} />
                                            <Text style={{ color: COLORS.white }}>Hapus Notulensi</Text>
                                        </TouchableOpacity> */}
                    {(data.user_role?.is_member === true &&
                      event.detailEvent.status !== "persiapan") ||
                    (data.user_role?.is_presensi === true &&
                      event.detailEvent.status !== "persiapan") ||
                    data?.notulensi?.ready_to_approve === true ? null : (
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          height: 50,
                          borderRadius: 8,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          backgroundColor: COLORS.infoDanger,
                          marginTop: 10,
                        }}
                        onPress={() => setVisibleModal(true)}
                      >
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Hapus Notulensi
                        </Text>
                      </TouchableOpacity>
                    )}

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
                                handleDelete();
                              }}
                            >
                              <Text
                                style={{
                                  color: COLORS.white,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                Hapus Notulensi
                              </Text>
                            </TouchableOpacity>
                          </ScrollView>
                        </View>
                      </View>
                    </Modal>
                  </View>
                ) : (
                  <></>
                )}
              </>
            )}

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
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
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    width: "90%",
                    height: "80%",
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Ionicons name="close-outline" size={24} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Unggah Notulensi
                    </Text>
                  </View>
                  {/* custom divider */}
                  <View
                    style={{
                      height: 1,
                      width: "100%",
                      backgroundColor: "#DBDADE",
                      marginTop: 10,
                    }}
                  />
                  <Text
                    style={{
                      marginVertical: 20,
                      color: COLORS.lighter,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Unggah File Notulensi
                  </Text>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Pressable
                      style={{
                        borderWidth: 1,
                        width: "90%",
                        borderRadius: 4,
                        borderColor: COLORS.ExtraDivinder,
                        height: 250,
                        marginBottom: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 5,
                      }}
                      onPress={() => {
                        pickDocument("aku");
                      }}
                    >
                      <View style={{ marginBottom: 10 }}>
                        <Ionicons
                          name="cloud-upload-outline"
                          size={30}
                          color={"#66656C"}
                        />
                      </View>
                      <Text
                        style={{
                          color: "#66656C",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Klik Untuk Unggah
                      </Text>
                    </Pressable>
                    <View style={{ marginVertical: 10 }}>
                      <Text
                        style={{
                          color: COLORS.lighter,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        *) Hanya file pdf yang akan diterima dan ukuran file
                        maks 10 MB
                      </Text>
                    </View>
                  </View>

                  {document !== null && (
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 20,
                        marginVertical: 10,
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 97,
                          height: 97,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          borderRadius: 8,
                          borderColor: COLORS.ExtraDivinder,
                        }}
                      >
                        <Image
                          source={require("../../assets/superApp/pdf.png")}
                        />
                      </View>
                    </View>
                  )}
                  <View
                    style={{
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        height: 50,
                        width: 100,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        backgroundColor: COLORS.primary,
                        marginTop: 10,
                      }}
                      onPress={() => {
                        handleSubmitNotulensi();
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Unggah
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <View
            style={{
              width: "90%",
              backgroundColor: COLORS.white,
              padding: 16,
              borderRadius: 8,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                width: 150,
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Materi Agenda
            </Text>
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4, marginTop: 20 }}
                width={100}
                height={100}
              />
            ) : data.attachments.length === 0 ? (
              <Text
                style={{
                  marginVertical: 5,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                -
              </Text>
            ) : (
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
                      id={item.id}
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
                  {getFileExtension(lampiranById.nama) === "png" ||
                  getFileExtension(lampiranById.nama) === "jpg" ||
                  getFileExtension(lampiranById.nama) === "jpeg" ? (
                    <View>
                      <Image
                        source={lampiranById.gambar}
                        style={{ width: 390, height: 283 }}
                      />
                    </View>
                  ) : getFileExtension(lampiranById.nama) === "mp4" ? (
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

          {/* <TouchableOpacity style={{
                        width: '90%',
                        height: 50,
                        backgroundColor: COLORS.primary,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 20
                    }}>
                        <Text style={{ color: COLORS.white }}>Approve Agenda</Text>
                    </TouchableOpacity> */}

          {scanData === false ? (
            <Portal>
              <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 99,
                }}
              />
            </Portal>
          ) : null}
        </View>

        <View
          style={{
            backgroundColor: COLORS.white,
            width: "90%",
            flex: 1,
            alignSelf: "center",
            padding: 5,
            borderRadius: 8,
            marginBottom: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginHorizontal: "5%",
              marginTop: 10,
            }}
          >
            <Ionicons
              name="people-outline"
              size={device === "tablet" ? 40 : 24}
            />
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              Presensi
            </Text>
          </View>
          <View style={{ marginHorizontal: "5%", marginVertical: 10 }}>
            <Search
              placeholder={"Cari"}
              iconColor={COLORS.primary}
              onSearch={filter}
            />
          </View>
          <FlatList
            data={filterData}
            renderItem={({ item }) => (
              <CardListAbsenEvent
                item={item}
                role={data.user_role}
                eventpic={event.detailEvent?.user_role?.is_pic}
                status={event.detailEvent.status}
                setScanData={setScanData}
                setIdAbsen={setIdAbsen}
                loading={loading}
                device={device}
                creator={data.creator?.nip}
                profile={profile.nip}
              />
            )}
            scrollEnabled={true}
            nestedScrollEnabled
            style={{ maxHeight: 300 }}
            ListEmptyComponent={() => <ListEmpty />}
          />
          {(data.creator?.nip === profile?.nip &&
            event.detailEvent?.status !== "persiapan") ||
          (data.user_role?.is_pic === true &&
            event.detailEvent?.status !== "persiapan") ||
          (data.user_role?.is_presensi === true &&
            event.detailEvent?.status !== "persiapan") ? (
            <TouchableOpacity
              style={{
                width: "90%",
                borderWidth: 1,
                height: 50,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: "5%",
                marginVertical: "5%",
                borderColor: COLORS.primary,
              }}
              onPress={() => {
                setScanData(false);
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={device === "tablet" ? 40 : 24}
                  color={COLORS.primary}
                />
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  Scan QRCode
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* {event.detailEvent?.user_role?.is_pic === true ||
                    data.user_role?.is_pic === true ||
                    data.user_role?.notulensi === false &&
                    data.user_role?.presensi === false &&
                    data.user_role?.member === false &&
                    data.user_role?.is_pic === false
                    ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <TouchableOpacity style={{
                                backgroundColor: COLORS.foundation,
                                width: Platform.OS === 'ios' ? '93%' : '94%',
                                height: 50,
                                borderRadius: 8
                            }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flex: 1, gap: 20 }}>
                                    <Text style={{ color: COLORS.white }}>Kirim Notifikasi</Text>
                                    <Ionicons name='notifications-outline' size={20} color={COLORS.white} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                backgroundColor: COLORS.lightBrown,
                                width: Platform.OS === 'ios' ? '93%' : '94%',
                                height: 50,
                                borderRadius: 8, marginTop: 10
                            }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flex: 1, gap: 20 }}>
                                    <Text style={{ color: COLORS.white }}>Edit</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <></>
                    )} */}
        {data.user_role?.is_pic === true &&
        event.detailEvent.status !== "persiapan" &&
        data?.notulensi?.ready_to_approve === true ? (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                width: "90%",
                height: 50,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 10,
                marginBottom: 40,
                backgroundColor: COLORS.primary,
              }}
              onPress={() => {
                navigation.navigate("TandaTanganNotulensi", {
                  item: notu[0]?.pdf,
                });
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                  color: COLORS.white,
                }}
              >
                Tanda Tangan Notulensi
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
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
