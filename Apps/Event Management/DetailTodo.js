import React, { useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Text } from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {} from "react-native-safe-area-context";
import { Image } from "react-native";
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
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Modal } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/min/moment-with-locales";
import { TextInput } from "react-native";
import { getTokenValue } from "../../service/session";
import { getDetailTodo, postKomenTodo } from "../../service/api";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { setRefresh } from "../../store/Event";

const CardLampiran = ({ lampiran, onClick, type }) => {
  const navigation = useNavigation();
  return type === "png" || type === "jpg" || type === "jpeg" ? (
    <TouchableOpacity onPress={onClick}>
      <Image
        source={lampiran}
        style={{ width: 97, height: 97, borderRadius: 6, marginTop: 10 }}
      />
    </TouchableOpacity>
  ) : type === "mp4" ? (
    <TouchableOpacity
      onPress={onClick}
      style={{
        width: 97,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/mp4.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "doc" || type === "docx" ? (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 97,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/word.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "xls" || type === "xlsx" ? (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 97,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/excel.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "pdf" ? (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 97,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/pdf.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "ppt" || type === "pptx" ? (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 97,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/ppt.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : null;
};

// const CardApproval = ({ item }) => {
//     return (
//         <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
//             <View>
//                 <Text>{item.nama}</Text>
//                 <View style={{ flexDirection: 'row', gap: 5 }}>
//                     <Text>Waktu:</Text>
//                     <Text>{item.waktu}</Text>
//                 </View>
//             </View>
//             <View style={{
//                 width: 100,
//                 height: 24,
//                 borderRadius: 30,
//                 backgroundColor: item.status === 'Sepakat' ? COLORS.successLight : item.status === 'Menunggu' ? COLORS.infoLight : COLORS.infoDangerLight,
//                 justifyContent: 'center',
//                 alignItems: 'center'
//             }}>
//                 <Text style={{
//                     color: item.status === 'Sepakat' ? COLORS.success : item.status === 'Menunggu' ? COLORS.info : COLORS.infoDanger
//                 }}>{item.status}</Text>
//             </View>
//         </View>
//     )
// }

export const DetailTodo = () => {
  const navigation = useNavigation();
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalCommetRef = useRef(null);
  const [parentId, setParentId] = useState({ id: "", creator: "" });
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

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const bottomSheetAttachComment = () => {
    bottomSheetModalCommetRef.current?.present();
  };
  const bottomSheetAttachCommentClose = () => {
    if (bottomSheetModalCommetRef.current)
      bottomSheetModalCommetRef.current?.close();
  };

  const [komen, setKomen] = useState("");

  const [toggleComment, setToggleComment] = useState({
    toggle: false,
    id: "",
  });
  const clickBalas = (id, temp) => {
    setToggleComment({
      toggle: temp,
      id: id,
    });
  };
  const handleClickBalas = (id, creator) => {
    setParentId({ id: id, creator: creator });
  };

  const handleLike = () => {
    if (like === 0) {
      setLike(1);
    } else {
      setLike(0);
    }
  };

  const [visibleModal, setVisibleModal] = useState(false);
  const [lampiranById, setLampiranById] = useState(null);

  const getFileExtension = (type) => {
    let jenis = type.split(".");
    jenis = jenis[jenis.length - 1];
    return jenis;
  };

  const video = useRef(null);

  const [token, setToken] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const { todo, agenda, loading, refresh } = useSelector(
    (state) => state.event
  );
  const detail = todo.detail;
  const agendaDetail = agenda.detail;

  const [message, setMessage] = useState("");

  const submitComment = (parent) => {
    if (message === "") {
      alert("masuk boy");
    } else {
      const payload = {
        task_id: detail.id,
        parent_id: parent,
        message: message,
        token: token,
        detailTodo: detail,
      };
      dispatch(postKomenTodo(payload));
      dispatch(setRefresh(true));
    }
  };

  useEffect(() => {
    if (refresh === true) {
      const params = { token: token, id: detail.id };
      dispatch(getDetailTodo(params));
      dispatch(setRefresh(false));
    }
  }, [refresh]);

  const { device } = useSelector((state) => state.apps);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        enabled
        // keyboardVerticalOffset={Platform.select({ ios: 80, android: 500 })}
      >
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
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
                <View
                  style={{ flex: 1, alignItems: "center", marginRight: 50 }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.white,
                    }}
                  >
                    Detail ToDo
                  </Text>
                </View>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 20,
                  flex: 2,
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
                        {detail.project?.name}
                      </Text>
                    )}
                  </View>

                  <View style={{ marginTop: 10 }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : agendaDetail.note === "" ? (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {agendaDetail.note}
                      </Text>
                    )}
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
                      Todo
                    </Text>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : detail.name === null ? (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    ) : (
                      <Text
                        style={{
                          width: "55%",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {detail.name}
                      </Text>
                    )}
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
                      Tenggat Waktu
                    </Text>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : detail.due_date === null ? (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    ) : (
                      <Text
                        style={{
                          width: "55%",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {detail.due_date}
                      </Text>
                    )}
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
                      Tanggal
                    </Text>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : agendaDetail.date === null ? (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    ) : (
                      <Text
                        style={{
                          width: "55%",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {agendaDetail.date}
                      </Text>
                    )}
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
                      Waktu
                    </Text>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ flexDirection: "row", width: "55%" }}>
                        {agendaDetail.start_time === null ? (
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            /
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 5,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {moment(agendaDetail.start_time, "HH:mm:ss")
                              .locale("id")
                              .format("HH:mm")}{" "}
                            -{" "}
                          </Text>
                        )}

                        {agendaDetail.end_time === null ? (
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            /
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 5,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {moment(agendaDetail.end_time, "HH:mm:ss")
                              .locale("id")
                              .format("HH:mm")}
                          </Text>
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
                      Tempat
                    </Text>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : agendaDetail.location === null ? (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    ) : (
                      <Text
                        style={{
                          width: "55%",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {agendaDetail.location}
                      </Text>
                    )}
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
                  ) : agendaDetail?.attachments?.length === 0 ? (
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      -
                    </Text>
                  ) : (
                    <FlatList
                      key={"*"}
                      data={agendaDetail.attachments}
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
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                  flex: 1,
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
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Komentar
                  </Text>
                  {parentId.id !== "" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        Membalas {parentId.creator}
                      </Text>
                      <TouchableOpacity>
                        <Ionicons
                          name="close"
                          size={20}
                          color={COLORS.primary}
                          onPress={() => setParentId({ id: "", creator: "" })}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      placeholder="Ketik Komentar"
                      style={{
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: COLORS.ExtraDivinder,
                        width: "90%",
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                      onChangeText={(e) => {
                        setMessage(e);
                      }}
                      allowFontScaling={false}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        submitComment(parentId.id);
                      }}
                    >
                      <Ionicons
                        name="send-outline"
                        size={24}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <ScrollView style={{ flex: 1 }}>
                <View
                  style={{
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center",
                    //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                  }}
                >
                  {detail.comments?.map((listData) => (
                    <View
                      key={listData.id}
                      style={{
                        backgroundColor: COLORS.white,
                        borderRadius: 10,
                        width: "90%",
                        marginVertical: 5,
                        elevation: 5,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          marginVertical: 10,
                          marginHorizontal: 20,
                        }}
                      >
                        <View>
                          <Image
                            source={{ uri: listData.creator?.avatar_url }}
                            style={{ width: 30, height: 30, borderRadius: 100 }}
                          />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H2", device),
                              fontWeight: FONTWEIGHT.bold,
                            }}
                          >
                            {listData.creator.nama}
                          </Text>
                          <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text
                              style={{
                                color: COLORS.lighter,
                                fontSize: fontSizeResponsive("H5", device),
                                fontWeight: FONTWEIGHT.normal,
                                marginBottom: 10,
                              }}
                            >
                              {listData.created_at}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: COLORS.lighter,
                              fontWeight: FONTWEIGHT.normal,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {listData.message}
                          </Text>
                          <View>
                            <TouchableOpacity
                              style={{
                                color: COLORS.lighter,
                                fontSize: FONTSIZE.H3,
                                fontWeight: FONTWEIGHT.normal,
                                wordWrap: "break-word",
                                marginTop: 10,
                              }}
                              onPress={() => {
                                handleClickBalas(
                                  listData.id,
                                  listData.creator.nama
                                );
                              }}
                            >
                              <Text
                                style={{
                                  color: COLORS.primary,
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                Balas
                              </Text>
                            </TouchableOpacity>
                            {listData.children.length === 0 ? null : (
                              <View>
                                {(!toggleComment.toggle &&
                                  toggleComment.id === listData.id) ||
                                toggleComment.id !== listData.id ? (
                                  <TouchableOpacity
                                    onPress={() =>
                                      clickBalas(listData.id, true)
                                    }
                                  >
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 5,
                                        marginTop: 10,
                                      }}
                                    >
                                      <View
                                        style={{
                                          height: 1,
                                          width: 20,
                                          backgroundColor: "#DBDADE",
                                        }}
                                      />
                                      <Text
                                        style={{
                                          color: COLORS.lighter,
                                          fontSize: fontSizeResponsive(
                                            "H5",
                                            device
                                          ),
                                          fontWeight: FONTWEIGHT.normal,
                                        }}
                                      >
                                        Tampilkan {listData.children.length}{" "}
                                        Balasan
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ) : null}

                                {listData.id === toggleComment.id &&
                                toggleComment.toggle ? (
                                  <View>
                                    {listData.children?.map(
                                      (listKomen, index) => (
                                        <View
                                          key={index}
                                          style={{
                                            flexDirection: "row",
                                            marginVertical: 20,
                                          }}
                                        >
                                          <View>
                                            <Image
                                              source={{
                                                uri: listKomen.creator
                                                  .avatar_url,
                                              }}
                                              style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 100,
                                              }}
                                            />
                                          </View>
                                          <View style={{ marginLeft: 10 }}>
                                            <Text
                                              style={{
                                                fontSize: fontSizeResponsive(
                                                  "H2",
                                                  device
                                                ),
                                                fontWeight: FONTWEIGHT.bold,
                                              }}
                                            >
                                              {listKomen.creator.nama}
                                            </Text>
                                            <View
                                              style={{
                                                flexDirection: "row",
                                                gap: 5,
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  color: COLORS.lighter,
                                                  fontSize: fontSizeResponsive(
                                                    "H5",
                                                    device
                                                  ),
                                                  fontWeight: FONTWEIGHT.normal,
                                                  marginBottom: 10,
                                                }}
                                              >
                                                {listKomen.created_at}
                                              </Text>
                                            </View>
                                            <Text
                                              style={{
                                                color: COLORS.lighter,
                                                fontWeight: FONTWEIGHT.normal,
                                                fontSize: fontSizeResponsive(
                                                  "H4",
                                                  device
                                                ),
                                              }}
                                            >
                                              {listKomen.message}
                                            </Text>
                                            {listData.children.length - 1 ===
                                            index ? (
                                              <TouchableOpacity
                                                key={listKomen.id}
                                                onPress={() =>
                                                  clickBalas(listData.id, false)
                                                }
                                              >
                                                <View
                                                  style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 5,
                                                    marginTop: 10,
                                                  }}
                                                >
                                                  <View
                                                    style={{
                                                      height: 1,
                                                      width: 20,
                                                      backgroundColor:
                                                        "#DBDADE",
                                                    }}
                                                  />
                                                  <Text
                                                    style={{
                                                      color: COLORS.lighter,
                                                      fontSize:
                                                        fontSizeResponsive(
                                                          "H5",
                                                          device
                                                        ),
                                                      fontWeight:
                                                        FONTWEIGHT.normal,
                                                    }}
                                                  >
                                                    Tutup{" "}
                                                    {listData.children.length}{" "}
                                                    Balasan
                                                  </Text>
                                                </View>
                                              </TouchableOpacity>
                                            ) : null}
                                          </View>
                                        </View>
                                      )
                                    )}
                                  </View>
                                ) : null}
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </ScrollView>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </>
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
