import React, { useCallback, useRef } from "react";
import { FlatList, Platform, View } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { Divider } from "react-native-paper";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import {} from "react-native-safe-area-context";
import { Portal } from "react-native-portalize";
import moment from "moment/min/moment-with-locales";
import { Loading } from "../../components/Loading";
import {
  deleteBerbagiDokumen,
  getDetailDocument,
  postRating,
  putUpdateState,
} from "../../service/api";
import { Rating } from "react-native-ratings";
import { getTokenValue } from "../../service/session";
import { setStatus } from "../../store/Repository";
import { ModalSubmit } from "../../components/ModalSubmit";

const DataList = ({ item, device }) => {
  let tipe = item.name.split(".");

  const size = (item.file_size / (1024 * 1024)).toFixed(2);

  const navigation = useNavigation();

  if (item.name.toLowerCase().includes("copy")) {
    return (
      <TouchableOpacity
        style={{
          shadowColor: "black",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
          padding: 10,
          backgroundColor: COLORS.white,
          borderRadius: 8,
          marginTop: 10,
          marginHorizontal: 3,
        }}
        onPress={() => {
          navigation.navigate("ViewerAnnotation", {
            data: item.files,
            type: "preshare",
            id: item.id,
          });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            width: device === "tablet" ? 400 : 200,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: FONTWEIGHT.normal,
              color: COLORS.lighter,
              width: device === "tablet" ? 160 : 80,
            }}
          >
            Nama File
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>:</Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
            {tipe[0]}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 5,
            width: device === "tablet" ? 400 : 200,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: FONTWEIGHT.normal,
              color: COLORS.lighter,
              width: device === "tablet" ? 160 : 80,
            }}
          >
            Size
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>:</Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
            {size} MB
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 5,
            width: device === "tablet" ? 400 : 200,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: FONTWEIGHT.normal,
              color: COLORS.lighter,
              width: device === "tablet" ? 160 : 80,
            }}
          >
            Ekstensi
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>:</Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
            {tipe[1]}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 5,
            width: device === "tablet" ? 400 : 200,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: FONTWEIGHT.normal,
              color: COLORS.lighter,
              width: device === "tablet" ? 160 : 80,
            }}
          >
            Dilihat
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>:</Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
            {item.views_count}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 5,
            width: device === "tablet" ? 400 : 200,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: FONTWEIGHT.normal,
              color: COLORS.lighter,
              width: device === "tablet" ? 160 : 80,
            }}
          >
            Diunduh
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>:</Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
            {item.download_count}
          </Text>
        </View>
      </TouchableOpacity>
    ); // Do not render anything if "copy" is found in the name
  }
  return null;
};

export const DetailTinjauan = () => {
  const navigation = useNavigation();

  const bottomSheetModalRef = useRef(null);

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
  const { dokumen, loading, rating, edit, status } = useSelector(
    (state) => state.repository
  );
  const comment = dokumen.comments;
  const detail = dokumen.detail;
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const isFocused = useIsFocused();

  const id = detail.id;

  useEffect(() => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    if (token !== "") {
      dispatch(getDetailDocument(params));
    }
    // dispatch(setStatus(status));
  }, [isFocused, token]);

  const handleSubmit = (tipe) => {
    const data = {
      token: token,
      id: id,
      payload: {
        action: tipe,
      },
    };
    dispatch(putUpdateState(data));
    // dispatch(postRating(params));
  };

  const { device } = useSelector((state) => state.apps);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? <Loading /> : null}
      <View style={{ flex: 1 }}>
        <View>
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
                backgroundColor: "white",
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
                Detail Tinjauan
              </Text>
            </View>
          </View>
          <ScrollView>
            <View
              style={{
                backgroundColor: COLORS.white,
                marginVertical: 10,
                marginHorizontal: "5%",
                paddingBottom: 20,
                borderRadius: 8,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 10,
                marginBottom: "20%",
              }}
            >
              <View
                style={{
                  marginHorizontal: 20,
                  marginVertical: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("Judul", device),
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  {detail?.title}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  marginHorizontal: 20,
                }}
              >
                <Image
                  style={{
                    width: device === "tablet" ? 52 : 26,
                    height: device === "tablet" ? 52 : 26,
                    borderRadius: device === "tablet" ? 60 : 30,
                  }}
                  source={{ uri: detail.creator_avatar }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H2", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    {detail?.unit_kerja}
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H2", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: "#1868AB",
                    }}
                  >
                    {detail?.creator}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 40,
                  alignItems: "center",
                  marginHorizontal: 20,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: FONTWEIGHT.normal,
                    color: COLORS.lighter,
                  }}
                >
                  Tanggal Acara
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: FONTWEIGHT.normal,
                  }}
                >
                  :{" "}
                  {moment(detail?.attributes?.tanggal)
                    .locale("id")
                    .format("DD MMMM YYYY")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 42,
                  alignItems: "center",
                  marginHorizontal: 20,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: FONTWEIGHT.normal,
                    color: COLORS.lighter,
                  }}
                >
                  Tempat Acara
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: FONTWEIGHT.normal,
                  }}
                >
                  : {detail?.attributes?.tempat}
                </Text>
              </View>
              <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                <Text
                  style={{
                    textAlign: "justify",
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: FONTWEIGHT.normal,
                    color: COLORS.lighter,
                  }}
                >
                  {detail?.attributes?.deskripsi}
                </Text>
              </View>
              <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                <Divider bold />
              </View>

              <View
                style={{
                  marginHorizontal: 20,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    display:
                      detail?.objid_members?.length === 0 ? "none" : "flex",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.lighter,
                    }}
                  >
                    Dibagikan Kepada
                  </Text>
                </View>
              </View>

              {detail?.objid_members?.slice(0, 3).map((data) => (
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 4,
                    display: "flex",
                    marginHorizontal: 20,
                    marginTop: 10,
                    flexDirection: "row",
                    padding: 10,
                    gap: 20,
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  <View
                    key={data.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <View style={{ paddingEnd: 20 }}>
                      <Text
                        style={{
                          fontWeight: FONTWEIGHT.bold,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {data.title}
                      </Text>
                      <Text
                        style={{
                          color: COLORS.lighter,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {data.name}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  display: detail?.objid_members?.length <= 3 ? "none" : "flex",
                }}
              >
                <TouchableOpacity onPress={bottomSheetAttach}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H2", device),
                      fontWeight: FONTWEIGHT.bold,
                      color: "#1868AB",
                    }}
                  >
                    Selengkapnya
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                <Divider bold />
              </View>
              <View
                style={{
                  marginHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H1", device),
                    fontWeight: FONTWEIGHT.bold,
                    color: COLORS.lighter,
                  }}
                >
                  Lampiran
                </Text>

                <FlatList
                  data={detail.attachments}
                  renderItem={({ item }) => (
                    <>
                      <DataList item={item} device={device} />
                    </>
                  )}
                  style={{ height: 150 }}
                  keyExtractor={(item) => item.id}
                />

                <TouchableOpacity
                  style={{
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                    marginTop: 10,
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    handleSubmit("return");
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Revisi
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.primary,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    handleSubmit("approve");
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Setuju
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ModalSubmit
              status={status}
              setStatus={setStatus}
              // messageSuccess={"Data Dihapus"}
              navigate={"MainRepo"}
            />
          </ScrollView>
          <Portal>
            <BottomSheetModalProvider>
              <BottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={animatedSnapPoints}
                handleHeight={animatedHandleHeight}
                contentHeight={animatedContentHeight}
                index={0}
                style={{ borderRadius: 50 }}
                keyboardBehavior={
                  Platform?.OS == "android" ? "fillParent" : "interactive"
                }
                keyboardBlurBehavior="restore"
                android_keyboardInputMode="adjust"
                backdropComponent={({ style }) => (
                  <View
                    style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
                  />
                )}
              >
                <BottomSheetView onLayout={handleContentLayout}>
                  <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                        backgroundColor: COLORS.infoLight,
                        padding: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Image
                        style={{ width: 26, height: 26, borderRadius: 30 }}
                        source={{ uri: detail?.creator_avatar }}
                      />
                      <View style={{}}>
                        <Text
                          style={{
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Penulis
                        </Text>
                        <Text
                          style={{
                            color: COLORS.lighter,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {detail?.creator}
                        </Text>
                      </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H1", device),
                          fontWeight: FONTWEIGHT.bold,
                          color: COLORS.lighter,
                        }}
                      >
                        Dibagikan Kepada
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            marginTop: 10,
                          }}
                        >
                          {detail?.objid_members?.map((data) => (
                            <View
                              key={data?.id}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                shadowColor: "black",
                                backgroundColor: "white",
                                borderRadius: 8,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.2,
                                shadowRadius: 2,
                                elevation: 10,
                                padding: 10,
                              }}
                            >
                              <View>
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.bold,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {data?.title}
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.lighter,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {data?.name}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>
                </BottomSheetView>
              </BottomSheetModal>
            </BottomSheetModalProvider>
          </Portal>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};
