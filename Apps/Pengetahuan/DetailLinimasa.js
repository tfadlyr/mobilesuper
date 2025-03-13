import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Share,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import {
  COLORS,
  DATETIME,
  DateFormat,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getFileSize,
} from "../../config/SuperAppps";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { Modal } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import {
  getDetailLinimasa,
  getListsLike,
  getViewLinimasa,
  patchLike,
  patchUnlike,
  postComment,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import { setRefresh, setResetDetailLinimasa } from "../../store/Pengetahuan";
import ShimmerPlaceHolder, {
  createShimmerPlaceHolder,
} from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { Portal } from "react-native-paper";
import { TextInput } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Config } from "../../constants/config";
const { StorageAccessFramework } = FileSystem;

const CardLampiran = ({ lampiran, onClick, type, id, name, size, device }) => {
  const navigation = useNavigation();

  return type === "png" || type === "jpg" || type === "jpeg" ? (
    <TouchableOpacity key={id} onPress={onClick}>
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={{ uri: lampiran }}
          style={{ width: 90, height: 90, borderRadius: 8 }}
        />
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {getFileSize(size)}
        </Text>
      </View>
    </TouchableOpacity>
  ) : type === "mp4" ? (
    <TouchableOpacity key={id} onPress={onClick}>
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../assets/superApp/mp4.png")}
          style={{ width: 90, height: 90 }}
        />
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {getFileSize(size)}
        </Text>
      </View>
    </TouchableOpacity>
  ) : type === "doc" || type === "docx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
    >
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../assets/superApp/word.png")}
          style={{ width: 90, height: 90 }}
        />
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text style={{ color: COLORS.lighter }}>{getFileSize(size)}</Text>
      </View>
    </TouchableOpacity>
  ) : type === "xls" || type === "xlsx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
    >
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../assets/superApp/excel.png")}
          style={{ width: 90, height: 90 }}
        />
        <Text style={{ fontWeight: FONTWEIGHT.bold }} numberOfLines={1}>
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {getFileSize(size)}
        </Text>
      </View>
    </TouchableOpacity>
  ) : type === "pdf" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
    >
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../assets/superApp/pdf.png")}
          style={{ width: 90, height: 90 }}
        />
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {getFileSize(size)}
        </Text>
      </View>
    </TouchableOpacity>
  ) : type === "ppt" || type === "pptx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
    >
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../assets/superApp/ppt.png")}
          style={{ width: 70, height: 70 }}
        />
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {getFileSize(size)}
        </Text>
      </View>
    </TouchableOpacity>
  ) : null;
};

const CardKomen = ({ listData, inputRef, setParentId, device }) => {
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

  const handleClickBalas = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setParentId({ id: listData.id, creator: listData.creator });
    }
  };
  return (
    <View
      style={{
        justifyContent: "center",
        flex: 1,
        alignItems: "center",
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 10,
          marginVertical: 5,
          paddingVertical: 8,
          width: "100%",
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
              source={{ uri: listData.creator_avatar }}
              style={{
                width: device === "tablet" ? 60 : 30,
                height: device === "tablet" ? 60 : 30,
                borderRadius: device === "tablet" ? 40 : 20,
              }}
            />
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H2", device),
                fontWeight: FONTWEIGHT.bold,
                wordWrap: "break-word",
              }}
            >
              {listData.creator}
            </Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text
                style={{
                  color: COLORS.lighter,
                  fontSize: fontSizeResponsive("H5", device),
                  fontWeight: FONTWEIGHT.normal,
                  wordWrap: "break-word",
                  marginBottom: 10,
                }}
              >
                {/* {listData.created_at} */}
                {DateFormat({
                  date: listData?.created_at,
                  fromDate: DATETIME.LONG_DATETIME,
                  toDate: DATETIME.LONG_DATETIME,
                })}
              </Text>
            </View>
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.normal,
                wordWrap: "break-word",
              }}
            >
              {listData.message}
            </Text>

            <TouchableOpacity
              style={{
                color: COLORS.lighter,
                fontSize: FONTSIZE.H3,
                fontWeight: FONTWEIGHT.normal,
                wordWrap: "break-word",
                marginTop: 10,
              }}
              onPress={() => {
                handleClickBalas();
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

            {listData.child.length === 0 ? null : (
              <View>
                {(!toggleComment.toggle && toggleComment.id === listData.id) ||
                (toggleComment.id !== listData.id &&
                  listData.child.length > 0) ? (
                  <TouchableOpacity
                    key={listData.id}
                    onPress={() => clickBalas(listData.id, true)}
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
                          fontSize: fontSizeResponsive("H5", device),
                          fontWeight: FONTWEIGHT.normal,
                          wordWrap: "break-word",
                        }}
                      >
                        Tampilkan {listData.child?.length} Balasan
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}

                {listData.id === toggleComment.id && toggleComment.toggle ? (
                  <View style={{ marginTop: 16 }}>
                    {listData.child?.map((listKomen, index) => (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            marginVertical: 10,
                            marginHorizontal: 20,
                          }}
                        >
                          <View>
                            <Image
                              source={{ uri: listKomen.creator_avatar }}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 20,
                              }}
                            />
                          </View>
                          <View style={{ marginLeft: 10 }}>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H2", device),
                                fontWeight: FONTWEIGHT.bold,
                                wordWrap: "break-word",
                              }}
                            >
                              {listKomen.creator}
                            </Text>
                            <View style={{ flexDirection: "row", gap: 5 }}>
                              <Text
                                style={{
                                  color: COLORS.lighter,
                                  fontSize: fontSizeResponsive("H5", device),
                                  fontWeight: FONTWEIGHT.normal,
                                  wordWrap: "break-word",
                                  marginBottom: 10,
                                }}
                              >
                                {listKomen.created_at}
                              </Text>
                            </View>
                            <Text
                              style={{
                                color: "#999999",
                                fontSize: fontSizeResponsive("H3", device),
                                fontWeight: FONTWEIGHT.normal,
                                wordWrap: "break-word",
                              }}
                            >
                              {listKomen.message}
                            </Text>
                            {listData.child.length - 1 === index ? (
                              <TouchableOpacity
                                key={listKomen.id}
                                onPress={() => clickBalas(listData.id, false)}
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
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    Tutup {listData.child.length} Balasan
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        </View>
                      </>
                    ))}
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const ShimmerParagraph = (device) => {
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

  return (
    <>
      <ShimmerPlaceHolder
        style={{
          borderRadius: 4,
          marginTop: 20,
          marginHorizontal: 25,
          width: device === "tablet" ? "93%" : "85%",
        }}
        height={20}
      />
      <ShimmerPlaceHolder
        style={{
          borderRadius: 4,
          marginTop: 5,
          marginHorizontal: 25,
          width: device === "tablet" ? "93%" : "85%",
        }}
        height={20}
      />
      <ShimmerPlaceHolder
        style={{
          borderRadius: 4,
          marginTop: 5,
          marginHorizontal: 25,
          width: device === "tablet" ? "93%" : "85%",
        }}
        height={20}
      />
      <ShimmerPlaceHolder
        style={{
          borderRadius: 4,
          marginTop: 5,
          marginHorizontal: 25,
          width: device === "tablet" ? "93%" : "85%",
        }}
        height={20}
      />
      <ShimmerPlaceHolder
        style={{
          borderRadius: 4,
          marginTop: 5,
          marginHorizontal: 25,
          width: device === "tablet" ? "93%" : "85%",
        }}
        height={20}
      />
    </>
  );
};

export const DetailLinimasa = ({ route }) => {
  const item = route.params;
  const navigation = useNavigation();
  const [like, setLike] = useState(0);
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const [visibleModalInfo, setVisibleModalInfo] = useState(false);
  const [visibleModalView, setVisibleModalView] = useState(false);
  const [visibleModalViewDisukai, setVisibleModalViewDisukai] = useState(false);
  const inputRef = useRef(null);
  const [parentId, setParentId] = useState({ id: "", creator: "" });
  const bottomSheetModalRef = useRef(null);
  const windowHeight = Dimensions.get("window").height;
  const initialSnapPoints = useMemo(() => [windowHeight * 0.8], [windowHeight]);
  const initSnapPoints = useMemo(() => ["20%"], []);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const { device } = useSelector((state) => state.apps);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

  const bottomSheetAttachComment = () => {
    bottomSheetModalRef.current?.present();
  };
  const bottomSheetAttachCommentClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const [komen, setKomen] = useState("");

  useEffect(() => {
    // dispatch(setResetDetailLinimasa())
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const [visibleModal, setVisibleModal] = useState(false);
  const [lampiranById, setLampiranById] = useState(null);

  const [document, setDocument] = useState([]);

  const getFileExtension = (lampiran) => {
    let jenis = lampiran.split(".");
    jenis = jenis[jenis.length - 1];
    return jenis;
  };

  const video = useRef(null);
  const [status, setStatus] = useState({});

  const { linimasa, refresh, loading } = useSelector(
    (state) => state.pengetahuan
  );

  const detail = linimasa.detail;
  const resetData = () => {
    linimasa.detail = {};
  };

  const listsView = linimasa.view;
  const listsLike = linimasa.listsLike;
  const source = {
    html: detail.content,
  };
  const { width } = useWindowDimensions();

  const handleLike = () => {
    const data = {
      token: token,
      id: item.id,
    };
    if (detail.liked == false) {
      dispatch(patchLike(data));
    } else {
      dispatch(patchUnlike(data));
    }
  };

  const handleComment = () => {
    const payload = {
      article_id: detail.id,
      parent_id: parentId.id !== "" ? parentId.id : "",
      message: komen,
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postComment(data));
    setKomen("");
    setParentId({ id: "", creator: "" });
  };

  useEffect(() => {
    const data = {
      token: token,
      id: item.id,
    };
    if (token !== "") {
      dispatch(getDetailLinimasa(data));
      dispatch(getViewLinimasa(data));
      dispatch(getListsLike(data));
    }
  }, [token]);

  useEffect(() => {
    const data = {
      token: token,
      id: detail.id,
    };
    if (refresh) {
      dispatch(getDetailLinimasa(data));
      dispatch(setRefresh(false));
    }
  }, [refresh]);

  const urlToShare =
    Config.base_url.replace("api/", "") +
    "apps/KnowledgeManagement/detail/" +
    item.id +
    "/" +
    detail?.creator?.id;
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: urlToShare,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type of : ", result.activityType);
        } else {
          console.log("shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [flatListScrolling, setFlatListScrolling] = useState(false);

  // const { linimasalike } = useSelector(state => state.pengetahuan)
  // const item = linimasalike.listsLike

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <ScrollView>
            <View
              style={{
                minHeight: Dimensions.get("screen").height,
                width: Dimensions.get("screen").width,
                backgroundColor: "white",
                display: "flex",
                position: "relative",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  resetData();
                  // navigation.navigate("MainPengetahuan");
                  navigation.goBack();
                }}
                style={{ position: "absolute", zIndex: 1 }}
              >
                <View
                  style={[
                    styles.backIcon,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 25,
                      marginLeft: 20,
                      width: device === "tablet" ? 40 : 28,
                      height: device === "tablet" ? 40 : 28,
                    },
                  ]}
                >
                  <Ionicons
                    name="chevron-back"
                    size={device === "tablet" ? 40 : 24}
                    color={COLORS.primary}
                  />
                </View>
              </TouchableOpacity>

              <View style={{ position: "relative" }}>
                {loading ? (
                  <View
                    style={{
                      width: "100%",
                      height: device === "tablet" ? 400 : 260,
                      backgroundColor: COLORS.grey,
                    }}
                  ></View>
                ) : (
                  <Image
                    source={{ uri: detail.cover }}
                    style={[
                      Platform.OS === "ios"
                        ? styles.imageIos
                        : styles.imageAndroid,
                      {
                        height: device === "tablet" ? 400 : 260,
                      },
                    ]}
                  />
                )}

                <View
                  style={{
                    backgroundColor: COLORS.white,
                    height: 50,
                    position: "absolute",
                    width: "100%",
                    bottom: 0,
                    borderTopLeftRadius: 100,
                    borderTopRightRadius: 100,
                  }}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.primary,
                    width: 42,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 50,
                    position: "absolute",
                    right: 15,
                    bottom: 30,
                  }}
                  onPress={() => {
                    handleShare();
                  }}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={24}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <View>
                  {loading ? (
                    <ShimmerPlaceHolder
                      style={{
                        borderRadius: 4,
                        marginHorizontal: 25,
                        marginBottom: 20,
                        width: device === "tablet" ? "93%" : "85%",
                      }}
                      height={30}
                    />
                  ) : (
                    <Text
                      style={{
                        paddingBottom: 20,
                        paddingHorizontal: "5%",
                        fontSize: fontSizeResponsive("H1", device),
                        fontWeight: FONTWEIGHT.bold,
                      }}
                    >
                      {detail.title}
                    </Text>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      paddingHorizontal: "5%",
                    }}
                  >
                    <View>
                      {loading ? (
                        <ShimmerPlaceHolder
                          style={{
                            borderRadius: 50,
                          }}
                          width={50}
                          height={50}
                        />
                      ) : (
                        <Image
                          source={{ uri: detail.creator_avatar }}
                          style={{ borderRadius: 50, width: 50, height: 50 }}
                        />
                      )}
                    </View>
                    <View style={{ rowGap: 5 }}>
                      {loading ? (
                        <ShimmerPlaceHolder
                          style={{
                            borderRadius: 4,
                          }}
                          width={device === "tablet" ? 300 : 150}
                          height={20}
                        />
                      ) : (
                        <Text
                          style={{
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {detail.creator?.name}
                        </Text>
                      )}
                      {loading ? (
                        <ShimmerPlaceHolder
                          style={{
                            borderRadius: 4,
                          }}
                          width={device === "tablet" ? 200 : 100}
                          height={20}
                        />
                      ) : (
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {/* {detail.published_date?.slice(0, -9)} */}
                          {detail.published_date !== undefined
                            ? DateFormat({
                                date: detail?.published_date,
                                fromDate: DATETIME.LONG_DATETIME,
                                toDate: DATETIME.LONG_DATE,
                              })
                            : null}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 15,
                      alignItems: "center",
                      paddingHorizontal: "5%",
                      marginTop: 20,
                    }}
                  >
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{
                          borderRadius: 4,
                        }}
                        width={device === "tablet" ? 200 : 100}
                        height={20}
                      />
                    ) : (
                      <View
                        style={{
                          backgroundColor:
                            detail?.category?.toLowerCase() === "video / jurnal"
                              ? COLORS.successLight
                              : detail?.category?.toLowerCase() === "infografis"
                              ? COLORS.warningLight
                              : COLORS.infoLight,
                          borderRadius: 30,
                          paddingHorizontal: 16,
                          paddingVertical: 4,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          gap: 5,
                        }}
                      >
                        {detail?.category?.toLowerCase() === "infografis" ? (
                          <Ionicons
                            name="document-outline"
                            color={"#F6AD1D"}
                            size={device === "tablet" ? 20 : 16}
                            style={{ marginTop: 2 }}
                          />
                        ) : detail?.category?.toLowerCase() === "kegiatan" ? (
                          <Ionicons
                            name="analytics-outline"
                            color={"#1868AB"}
                            size={device === "tablet" ? 20 : 16}
                            style={{ marginTop: 3 }}
                          />
                        ) : (
                          <Ionicons
                            name="videocam-outline"
                            color={"#11C15B"}
                            size={device === "tablet" ? 20 : 16}
                            style={{ marginTop: 2 }}
                          />
                        )}
                        <Text
                          style={{
                            color:
                              detail?.category?.toLowerCase() === "infografis"
                                ? COLORS.warning
                                : detail?.category?.toLowerCase() === "kegiatan"
                                ? COLORS.info
                                : COLORS.success,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {detail.category}
                        </Text>
                      </View>
                    )}
                  </View>

                  {loading ? (
                    <ShimmerPlaceHolder
                      style={{
                        borderRadius: 4,
                        marginTop: 20,
                        marginHorizontal: 25,
                        width: device === "tablet" ? "93%" : "85%",
                      }}
                      height={40}
                    />
                  ) : detail.summary !== null ? (
                    <View
                      style={{
                        marginTop: 20,
                        backgroundColor: COLORS.infoLight,
                        padding: 20,
                        marginHorizontal: "5%",
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {detail.summary}
                      </Text>
                    </View>
                  ) : null}

                  {loading ? (
                    <View style={{ marginBottom: 20 }}>
                      <ShimmerParagraph device={device} />
                      <ShimmerParagraph device={device} />
                      <ShimmerParagraph device={device} />
                    </View>
                  ) : (
                    <View
                      style={{ marginHorizontal: "5%", paddingVertical: -20 }}
                    >
                      <RenderHTML
                        source={source}
                        contentWidth={width}
                        enableExperimentalMarginCollapsing={true}
                        defaultTextProps={{ allowFontScaling: false }}
                      />
                    </View>
                  )}

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginVertical: 10,
                      marginHorizontal: "5%",
                      // paddingHorizontal: 16,
                      // backgroundColor: "grey",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          // bottomSheetAttachCommentClose();
                          // dispatch(
                          //   getListsLike({ token: token, id: detail.id })
                          // );
                          // navigation.navigate("ListSukaLinimasa");
                          setVisibleModalViewDisukai(true);
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.lighter,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {detail.likes_count} Disukai
                        </Text>
                      </TouchableOpacity>

                      <Modal
                        animationType="fade"
                        transparent={true}
                        visible={visibleModalViewDisukai}
                        onRequestClose={() => {
                          setVisibleModalViewDisukai(!visibleModalViewDisukai);
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
                                    fontSize: fontSizeResponsive(
                                      "Judul",
                                      device
                                    ),
                                    fontWeight: FONTWEIGHT.bold,
                                  }}
                                >
                                  Disukai Oleh
                                </Text>
                              </View>

                              <TouchableOpacity
                                style={{}}
                                onPress={() => {
                                  setVisibleModalViewDisukai(false);
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
                              {listsLike?.map((data) => {
                                return (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: 10,
                                      marginHorizontal: 20,
                                      marginTop: 20,
                                    }}
                                  >
                                    <Image
                                      source={{ uri: data.avatar_url }}
                                      style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 30,
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
                                      {data.name}
                                    </Text>
                                  </View>
                                );
                              })}
                            </ScrollView>
                          </View>
                        </View>
                      </Modal>
                    </View>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <Text
                        style={{
                          color: COLORS.lighter,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {detail.comment_count} Komentar
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 3,
                        }}
                        onPress={() => {
                          setVisibleModalView(true);
                        }}
                      >
                        <Ionicons
                          name="eye-outline"
                          size={18}
                          style={{ color: COLORS.lighter }}
                        />
                        <Text
                          style={{
                            color: COLORS.lighter,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {detail.views_count} Dilihat
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* divider custom */}
                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: "#DBDADE",
                      // marginTop: 20,
                      marginHorizontal: 20,
                    }}
                  />

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      marginVertical: 20,
                      marginHorizontal: 20,
                      paddingHorizontal: 16,
                      // backgroundColor: "grey",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        gap: 3,
                        alignItems: "center",
                      }}
                      onPress={handleLike}
                    >
                      <Ionicons
                        name="thumbs-up-outline"
                        size={18}
                        color={detail.liked == true ? COLORS.primary : null}
                      />
                      <Text
                        style={{
                          color: detail.liked == true ? COLORS.primary : null,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Suka
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                      }}
                      onPress={bottomSheetAttachComment}
                    >
                      <Ionicons name="chatbox-outline" size={18} />
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        Komentar
                      </Text>
                    </TouchableOpacity>

                    <BottomSheetModal
                      ref={bottomSheetModalRef}
                      snapPoints={animatedSnapPoints}
                      handleHeight={animatedHandleHeight}
                      contentHeight={animatedContentHeight}
                      index={0}
                      keyboardBlurBehavior="restore"
                      keyboardBehavior="extend"
                      android_keyboardInputMode="adjust"
                      backdropComponent={({ style }) => (
                        <View
                          style={[
                            style,
                            { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                          ]}
                        />
                      )}
                    >
                      <BottomSheetView onLayout={handleContentLayout}>
                        <KeyboardAvoidingView
                          behavior="position"
                          keyboardVerticalOffset={parentId !== "" ? 120 : 80}
                        >
                          <View
                            style={{
                              height: initialSnapPoints[0],
                              display: "flex",
                              flexDirection: "column",
                              paddingBottom: 24,
                            }}
                          >
                            <View
                              style={{ marginLeft: 20, marginVertical: 20 }}
                            >
                              <Text
                                style={{
                                  color: COLORS.ExtraDivinder,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                Komentar({detail.comment_count})
                              </Text>
                            </View>

                            <View style={{ flex: 1 }}>
                              <FlatList
                                data={detail.comments}
                                renderItem={({ item }) => (
                                  <CardKomen
                                    listData={item}
                                    inputRef={inputRef}
                                    setParentId={setParentId}
                                    device={device}
                                  />
                                )}
                              />
                            </View>

                            <View
                              style={{
                                display: "flex",
                                justifyContent: "start",
                                paddingVertical: 16,
                              }}
                            >
                              {parentId.id !== "" ? (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingHorizontal: 20,
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                    }}
                                  >
                                    Membalas {parentId.creator}
                                  </Text>
                                  <TouchableOpacity>
                                    <Ionicons
                                      name="close"
                                      size={20}
                                      color={COLORS.primary}
                                      onPress={() =>
                                        setParentId({ id: "", creator: "" })
                                      }
                                    />
                                  </TouchableOpacity>
                                </View>
                              ) : null}

                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "flex-end",
                                  paddingHorizontal: 20,
                                  alignItems: "center",
                                }}
                              >
                                {showMessage && (
                                  <View
                                    style={{
                                      backgroundColor: COLORS.success,
                                      padding: 5,
                                      borderRadius: 8,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: COLORS.white,
                                        fontSize: fontSizeResponsive(
                                          "H4",
                                          device
                                        ),
                                      }}
                                    >
                                      {message}
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

                              <View
                                style={{
                                  borderWidth: 1,
                                  width: "90%",
                                  marginLeft: 17,
                                  borderRadius: 16,
                                  borderColor: COLORS.ExtraDivinder,
                                  flexDirection: "row",
                                  backgroundColor: COLORS.ExtraDivinder,
                                  marginTop: 10,
                                }}
                              >
                                <TextInput
                                  numberOfLines={1}
                                  maxLength={30}
                                  placeholder="Ketik Komentar Disini"
                                  ref={inputRef}
                                  style={{
                                    padding: 10,
                                    width: "90%",
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                  onChangeText={setKomen}
                                  defaultValue={komen}
                                  placeholderTextColor={COLORS.grey}
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
                                  <TouchableOpacity
                                    onPress={() => {
                                      setMessage("Pesan Telah Terkirim");
                                      setShowMessage(true);
                                      setTimeout(() => {
                                        setShowMessage(false);
                                      }, 5000);
                                      handleComment();
                                    }}
                                  >
                                    <Ionicons
                                      name="send-sharp"
                                      size={20}
                                      color={COLORS.primary}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>
                        </KeyboardAvoidingView>
                      </BottomSheetView>
                    </BottomSheetModal>

                    {/* <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                    onPress={() => {
                      setVisibleModalView(true);
                    }}
                  >
                    <Ionicons name="eye-outline" size={18} />
                    <Text>{detail.views_count}</Text>
                  </TouchableOpacity> */}

                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                      }}
                      onPress={() => setVisibleModalInfo(true)}
                    >
                      <Ionicons name="information-circle-outline" size={18} />
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        Info
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {detail?.attachments?.length !== 0 ? (
                    <View
                      style={{
                        marginHorizontal: 20,
                        marginBottom: 30,
                        borderRadius: 16,
                        backgroundColor: "white",
                        paddingVertical: 16,
                        //shadow ios
                        shadowOffset: { width: -2, height: 4 },
                        shadowColor: "#171717",
                        shadowOpacity: 0.2,
                        //shadow android
                        elevation: 2,
                        paddingHorizontal: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("Judul", device),
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Lampiran
                      </Text>

                      <FlatList
                        key={"#"}
                        data={detail.attachments}
                        renderItem={({ item }) => (
                          <View key={item.id}>
                            <CardLampiran
                              lampiran={item.file}
                              id={item.id}
                              name={item.name}
                              size={item.file_size}
                              type={getFileExtension(item.name)}
                              onClick={() => {
                                setVisibleModal(true);
                                setLampiranById(item);
                              }}
                              device={device}
                            />
                          </View>
                        )}
                        scrollEnabled={true}
                        horizontal={true}
                        style={{ marginTop: 20 }}
                        // columnWrapperStyle={{ justifyContent: "space-evenly" }}
                        // numColumns={2}
                        keyExtractor={(item) => "#" + item.id}
                      />
                    </View>
                  ) : null}

                  {/* Lampiran */}

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
                            source={{ uri: lampiranById.file }}
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

                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visibleModalInfo}
                    onRequestClose={() => {
                      setVisibleModalInfo(!visibleModalInfo);
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
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            Informasi Pengetahuan
                          </Text>
                          <TouchableOpacity
                            style={{}}
                            onPress={() => {
                              setVisibleModalInfo(false);
                            }}
                          >
                            <Ionicons
                              name="close-outline"
                              size={24}
                              color={COLORS.lighter}
                            />
                          </TouchableOpacity>
                        </View>

                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 20,
                              alignItems: "center",
                              marginHorizontal: 40,
                            }}
                          >
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: COLORS.primary,
                              }}
                            />
                            <Text
                              style={{
                                fontWeight: FONTWEIGHT.bold,
                                marginLeft: 10,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              Judul
                            </Text>
                            <Text
                              style={{
                                color: COLORS.lighter,
                                marginLeft: 5,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              [What]
                            </Text>
                          </View>

                          <Text
                            style={{
                              marginHorizontal: 60,
                              marginTop: 10,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {detail.title}
                          </Text>
                        </View>

                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 20,
                              alignItems: "center",
                              marginHorizontal: 40,
                            }}
                          >
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: COLORS.primary,
                              }}
                            />
                            <Text
                              style={{
                                fontWeight: FONTWEIGHT.bold,
                                marginLeft: 10,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              Anggota Angenda
                            </Text>
                            <Text
                              style={{
                                color: COLORS.lighter,
                                marginLeft: 5,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              [Who]
                            </Text>
                          </View>

                          <Text
                            style={{
                              marginHorizontal: 60,
                              marginTop: 10,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {detail.members_agenda}
                          </Text>
                        </View>

                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 20,
                              alignItems: "center",
                              marginHorizontal: 40,
                            }}
                          >
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: COLORS.primary,
                              }}
                            />
                            <Text
                              style={{
                                fontWeight: FONTWEIGHT.bold,
                                marginLeft: 10,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              Rangkuman
                            </Text>
                            <Text
                              style={{
                                color: COLORS.lighter,
                                marginLeft: 5,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              [Why]
                            </Text>
                          </View>

                          <Text
                            style={{
                              marginHorizontal: 60,
                              marginTop: 10,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {detail.summary}
                          </Text>
                        </View>

                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 20,
                              alignItems: "center",
                              marginHorizontal: 40,
                            }}
                          >
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: COLORS.primary,
                              }}
                            />
                            <Text
                              style={{
                                fontWeight: FONTWEIGHT.bold,
                                marginLeft: 10,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              Tempat Agenda
                            </Text>
                            <Text
                              style={{
                                color: COLORS.lighter,
                                marginLeft: 5,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              [Where]
                            </Text>
                          </View>

                          <Text
                            style={{
                              marginHorizontal: 60,
                              marginTop: 10,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {detail.place_agenda}
                          </Text>
                        </View>

                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 20,
                              alignItems: "center",
                              marginHorizontal: 40,
                            }}
                          >
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: COLORS.primary,
                              }}
                            />
                            <Text
                              style={{
                                fontWeight: FONTWEIGHT.bold,
                                marginLeft: 10,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              Waktu Mulai
                            </Text>
                            <Text
                              style={{
                                color: COLORS.lighter,
                                marginLeft: 5,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              [When]
                            </Text>
                          </View>

                          <Text
                            style={{
                              marginHorizontal: 60,
                              marginTop: 10,
                              marginBottom: 20,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {detail.start_date_agenda?.slice(0, -9)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Modal>

                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visibleModalView}
                    onRequestClose={() => {
                      setVisibleModalView(!visibleModalView);
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
                          height: 500,
                          borderRadius: 10,
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
                              Dilihat Oleh
                            </Text>
                          </View>

                          <TouchableOpacity
                            style={{}}
                            onPress={() => {
                              setVisibleModalView(false);
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
                          {listsView?.map((data) => {
                            return (
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 10,
                                  marginHorizontal: 20,
                                  marginTop: 20,
                                }}
                              >
                                <Image
                                  source={{ uri: data.avatar_url }}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 30,
                                  }}
                                />
                                <Text
                                  style={{
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {data.name}
                                </Text>
                              </View>
                            );
                          })}
                        </ScrollView>
                      </View>
                    </View>
                  </Modal>

                  {/* <View style={{
                                    height: 105,
                                    width: '90%',
                                    backgroundColor: COLORS.danger,
                                    borderRadius: 8,
                                    marginHorizontal: 15,
                                    marginBottom: 20,
                                    //shadow ios
                                    shadowOffset: { width: -2, height: 4 },
                                    shadowColor: '#171717',
                                    shadowOpacity: 0.2,
                                    //shadow android
                                    elevation: 5
                                }}>
                                    <View style={{ height: 96, width: '100%', backgroundColor: COLORS.white, borderRadius: 8, position: 'absolute', bottom: 0 }}>
                                        <Text style={{ fontWeight: 600, marginHorizontal: 20, marginTop: 20 }}>Selanjutnya</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: FONTSIZE.H4, marginHorizontal: 20, marginTop: 10, width: 300 }}>Kementrian Kelautan dan Perikanan (KKP) bersama dengan Dewan...</Text>
                                            <TouchableOpacity style={{ position: 'absolute', right: 10 }}>
                                                <Ionicons name='chevron-forward-outline' size={24} color={COLORS.lighter} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View> */}
                </View>
              </View>
            </View>
          </ScrollView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
};
const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "white",
    borderRadius: 50,
  },
  imageIos: {
    width: "100%",
    resizeMode: "cover",
  },
  imageAndroid: {
    width: "100%",
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
