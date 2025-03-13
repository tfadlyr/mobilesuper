import React, { useMemo, useRef } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { View } from "react-native";
import {} from "react-native-safe-area-context";
import {
  AVATAR,
  COLORS,
  DATETIME,
  DateFormat,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setLiniMasa,
  setRefresh,
  setResetDetailLinimasa,
} from "../../store/Pengetahuan";
import { FlatList } from "react-native";
import { Image } from "react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Search } from "../../components/Search";
import {
  getDetailLinimasa,
  getDivisionFilter,
  getLinimasa,
  getListsLike,
  getSubDivisionFilter,
  getViewLinimasa,
  patchLike,
  patchUnlike,
  postComment,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import moment from "moment/min/moment-with-locales";
import { ScrollView } from "react-native";
import { Loading } from "../../components/Loading";
import { ActivityIndicator } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { RefreshControl } from "react-native";
import { Portal } from "react-native-portalize";
import { Divider } from "react-native-paper";
import { Dropdown } from "../../components/DropDown";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
        elevation: 2,
      }}
    >
      <View
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
              source={{ uri: listData.creator_avatar }}
              style={{ width: 30, height: 30, borderRadius: 20 }}
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H2", device),
                fontWeight: FONTWEIGHT.bold,
                lineHeight: 20,
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
                  lineHeight: 18,
                  wordWrap: "break-word",
                  marginBottom: 10,
                }}
              >
                {listData.created_at}
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
                          lineHeight: 18,
                          wordWrap: "break-word",
                        }}
                      >
                        Tampilkan {listData.child?.length} Balasan
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}

                {listData.id === toggleComment.id && toggleComment.toggle ? (
                  <View>
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
                                lineHeight: 20,
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
                                  lineHeight: 18,
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
                                lineHeight: 18,
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
                                      lineHeight: 18,
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

const CardLiniMasa = ({ item, token, device }) => {
  const navigation = useNavigation();
  const [like, setLike] = useState(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalView, setVisibleModalView] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [parentId, setParentId] = useState({ id: "", creator: "" });
  const [visibleModalViewDisukai, setVisibleModalViewDisukai] = useState(false);

  const bottomSheetModalRef = useRef(null);
  const initialSnapPoints = useMemo(() => ["95%"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttachComment = () => {
    bottomSheetModalRef.current?.present();
  };
  const bottomSheetAttachCommentClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const handleLike = () => {
    const data = {
      token: token,
      id: item.id,
    };
    if (item.liked == false) {
      dispatch(patchLike(data));
    } else {
      dispatch(patchUnlike(data));
    }
  };

  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailLinimasa(params));
    dispatch(getViewLinimasa(params));
  };

  const { linimasa, refresh } = useSelector((state) => state.pengetahuan);
  const detail = linimasa?.detail;

  const [komen, setKomen] = useState("");
  const [toggleComment, setToggleComment] = useState({
    toggle: false,
    id: "",
  });
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
      id: detail.id,
    };
    if (refresh) {
      dispatch(getDetailLinimasa(data));
      dispatch(setRefresh(false));
    }
  }, [refresh]);

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginTop: 20,
        width: "100%",
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        //shadow android
        elevation: 2,
        alignContent: "center",
        marginBottom: 5,
      }}
    >
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          // getDetail(item.id);
          dispatch(setResetDetailLinimasa());

          navigation.navigate("DetailLinimasa", {
            // like_list: item.like_list,
            id: item.id,
          });
        }}
      >
        <View
          style={{
            marginTop: 30,
            marginHorizontal: 15,
          }}
        >
          <View style={{ flexDirection: "row", gap: 15 }}>
            <View>
              <Image
                source={{ uri: item.avatar_url }}
                style={{ borderRadius: 50, width: 50, height: 50 }}
              />
            </View>

            <View
              style={{ display: "flex", alignItems: "flex-start", flex: 1 }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {item.creator.name}
              </Text>
              <View
                style={{
                  gap: 14,
                }}
              >
                <Text
                  style={{
                    color: COLORS.grey,
                    marginVertical: 1,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {/* {item?.published_date?.slice(0, -9)} */}
                  {DateFormat({
                    date: item.published_date,
                    fromDate: DATETIME.LONG_DATETIME,
                    toDate: DATETIME.LONG_DATE,
                  })}
                </Text>
                <View
                  style={{
                    backgroundColor:
                      item.category.toLowerCase() === "video / jurnal"
                        ? COLORS.successLight
                        : item.category.toLowerCase() === "infografis"
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
                  {item.category.toLowerCase() === "infografis" ? (
                    <Ionicons
                      name="document-outline"
                      color={"#F6AD1D"}
                      size={device === "tablet" ? 20 : 16}
                      style={{ marginTop: 2 }}
                    />
                  ) : item.category.toLowerCase() === "kegiatan" ? (
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
                        item.category.toLowerCase() === "infografis"
                          ? COLORS.warning
                          : item.category.toLowerCase() === "kegiatan"
                          ? COLORS.info
                          : COLORS.success,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {item.category}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginVertical: 20 }}>
            <Image
              source={{ uri: item.cover }}
              style={{
                width: "100%",
                height: device === "tablet" ? 300 : 160,
                borderRadius: 8,
              }}
            />
          </View>

          <Text
            style={{
              textAlign: "justify",
              color: COLORS.lighter,
              fontSize: fontSizeResponsive("H3", device),
            }}
          >
            {item.title}
          </Text>

          {/* <View
            style={{
              flexDirection: "row",
              gap: 15,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              onPress={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            >
              <Ionicons
                name="thumbs-up-outline"
                size={18}
                color={item.liked == true ? COLORS.primary : null}
              />
              <Text
                style={{ color: item.liked == true ? COLORS.primary : null }}
              >
                {item.likes_count}
              </Text>
            </TouchableOpacity>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <Ionicons name="chatbox-outline" size={18} />
              <Text>{item.comment_count}</Text>
            </View>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              onPress={(e) => {
                e.stopPropagation();
                setVisibleModalView(true);
              }}
            >
              <Ionicons name="eye-outline" size={18} />
              <Text>{item.views_count}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              onPress={(e) => {
                e.stopPropagation();
                setVisibleModal(true);
              }}
            >
              <Ionicons name="information-circle-outline" size={18} />
            </TouchableOpacity>
          </View> */}
        </View>
      </TouchableOpacity>

      {/* Modal Informasi */}
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
            Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
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
                  width: "70%",
                  marginHorizontal: 60,
                  marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {detail?.title !== "" && detail?.title !== null
                  ? detail.title
                  : "-"}
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
                  Anggota Agenda
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
                  width: "70%",
                  marginHorizontal: 60,
                  marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {detail?.members_agenda !== "" &&
                detail?.members_agenda !== null
                  ? detail.members_agenda
                  : "-"}
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
                  width: "70%",
                  marginHorizontal: 60,
                  marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {detail?.summary !== "" && detail?.summary !== null
                  ? detail.summary
                  : "-"}
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
                  width: "70%",
                  marginHorizontal: 60,
                  marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {detail?.place_agenda !== "" && detail?.place_agenda !== null
                  ? detail.place_agenda
                  : "-"}
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
                  width: "70%",
                  marginHorizontal: 60,
                  marginTop: 10,
                  marginBottom: 20,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {detail?.start_date_agenda !== "" &&
                detail?.start_date_agenda !== null
                  ? detail.start_date_agenda?.slice(0, -9)
                  : "-"}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Dilihat */}
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
            Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
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
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: "#DBDADE",
                  marginVertical: 10,
                }}
              />
            </View>

            <ScrollView style={{ marginBottom: 20 }}>
              {item.view_list.map((data) => {
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
                      style={{ width: 50, height: 50, borderRadius: 30 }}
                    />
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
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

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginVertical: 10,
          marginHorizontal: 20,
          justifyContent: "center",
          gap: wp(8),
          // paddingHorizontal: 16,
          // backgroundColor: "grey",
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
              {item.likes_count} Disukai
            </Text>
          </TouchableOpacity>
        </View>

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
          <View style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                backgroundColor: COLORS.white,
                width: "90%",
                borderRadius: 10,
                marginTop: "40%",
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
                {item.like_list?.map((data) => {
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
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
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

        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              color: COLORS.lighter,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            {item.comment_count} Komentar
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
            onPress={() => {
              setVisibleModalView(true);
            }}
          ></TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              setVisibleModalView(true);
            }}
          >
            {/* <Ionicons
              name="eye-outline"
              size={18}
              style={{ color: COLORS.lighter }}
            /> */}
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {item.views_count} Dilihat
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
          justifyContent: "center",
          gap: 30,
        }}
      >
        <View>
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
        </View>

        {/* <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
          onPress={bottomSheetAttachComment}
          >
            <Ionicons name="chatbox-outline" size={18} />
            <Text>Komentar</Text>
          </TouchableOpacity> */}

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
          onPress={() => {
            getDetail(item.id);
            bottomSheetAttachComment();
          }}
        >
          {/* <Ionicons name="chatbox-outline" size={18} /> */}
          {/* <Text>Komentar</Text> */}
        </TouchableOpacity>

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
            <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
          )}
        >
          <BottomSheetView onLayout={handleContentLayout} style={{}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "height" : "height"}
              keyboardVerticalOffset={parentId !== "" ? 80 : 70}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginLeft: 20,
                }}
              >
                <Ionicons
                  name="thumbs-up-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {detail.likes_count}
                </Text>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Disukai
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetAttachCommentClose();
                    dispatch(getListsLike({ token: token, id: detail.id }));
                    navigation.navigate("ListSukaLinimasa");
                  }}
                >
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: 20, marginVertical: 20 }}>
                <Text
                  style={{
                    color: COLORS.ExtraDivinder,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Komentar({detail.comment_count})
                </Text>
              </View>

              <FlatList
                data={detail.comments}
                renderItem={({ item }) => (
                  <CardKomen
                    listData={item}
                    inputRef={inputRef}
                    setParentId={setParentId}
                    toggleComment={toggleComment}
                    setToggleComment={setToggleComment}
                    device={device}
                  />
                )}
                style={{ height: 370 }}
              />

              <View style={{ justifyContent: "flex-end", paddingTop: 10 }}>
                {parentId.id !== "" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: 20,
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
                  <BottomSheetTextInput
                    numberOfLines={1}
                    maxLength={30}
                    placeholder="Ketik Komentar Disini"
                    ref={inputRef}
                    style={{ padding: 10, width: "90%" }}
                    onChangeText={setKomen}
                    value={komen}
                  />
                  <View
                    style={{
                      alignItems: "flex-end",
                      flex: 1,
                      marginRight: 10,
                      marginLeft: 50,
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
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
            </KeyboardAvoidingView>
          </BottomSheetView>
        </BottomSheetModal>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
          onPress={() => {
            getDetail(item.id);
            setVisibleModal(true);
          }}
        >
          <Ionicons name="information-circle-outline" size={18} />
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            Info
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const LiniMasa = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [token, setToken] = useState("");
  const [page, setPage] = useState(5);

  const [kegiatan, setKegiatan] = useState(false);
  const [infografis, setInfografis] = useState(false);
  const [videoJurnal, setVideoJurnal] = useState(false);

  const [kepemimpinan, setKepemimpinan] = useState(false);
  const [manajerial, setManajerial] = useState(false);
  const [sosialKultural, setSosialKultural] = useState(false);
  const [teknisFungsional, setTeknisFungsional] = useState(false);

  const handleKegiatan = () => {
    kegiatan ? setKegiatan(false) : setKegiatan(true);
  };

  const handleInfografis = () => {
    infografis ? setInfografis(false) : setInfografis(true);
  };

  const handleVideoJurnal = () => {
    videoJurnal ? setVideoJurnal(false) : setVideoJurnal(true);
  };

  const handleKepemimpinan = () => {
    kepemimpinan ? setKepemimpinan(false) : setKepemimpinan(true);
  };

  const handleManajerial = () => {
    manajerial ? setManajerial(false) : setManajerial(true);
  };

  const handleSosialKultural = () => {
    sosialKultural ? setSosialKultural(false) : setSosialKultural(true);
  };

  const handleTeknisFungsional = () => {
    teknisFungsional ? setTeknisFungsional(false) : setTeknisFungsional(true);
  };

  const [category, setCategory] = useState("");
  const [competence, setCompetence] = useState("");

  const clearBadge = () => {
    setKegiatan(false);
    setInfografis(false);
    setVideoJurnal(false);

    setKepemimpinan(false);
    setManajerial(false);
    setSosialKultural(false);
    setTeknisFungsional(false);

    setCategory("");
    setCompetence("");
  };

  useEffect(() => {
    let category = "";

    if (kegiatan) {
      category += "kegiatan";
    }

    if (infografis) {
      category += category.length > 0 ? ",infografis" : "infografis";
    }

    if (videoJurnal) {
      category += category.length > 0 ? ",video / jurnal" : "video / jurnal";
    }

    setCategory(category);
  }, [kegiatan, infografis, videoJurnal]);

  useEffect(() => {
    let competence = "";

    if (kepemimpinan) {
      competence += "Kepemimpinan";
    }

    if (manajerial) {
      competence += competence.length > 0 ? ",Manajerial" : "Manajerial";
    }

    if (sosialKultural) {
      competence +=
        competence.length > 0 ? ",Sosial Kultural" : "Sosial Kultural";
    }

    if (teknisFungsional) {
      competence +=
        competence.length > 0 ? ",Teknis Fungsional" : "Teknis Fungsional";
    }

    setCompetence(competence);
  }, [kepemimpinan, manajerial, sosialKultural, teknisFungsional]);

  const [filterUnker, setFilterUnker] = useState();
  const [filterSatker, setFilterSatker] = useState();

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    if (filterUnker && filterUnker.key) {
      dispatch(getSubDivisionFilter({ token: token, id: filterUnker.key }));
    }
  }, [filterUnker]);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(
        getLinimasa({
          token: token,
          page: page,
          category: category,
          competence: competence,
          unker: filterUnker ? filterUnker.value : "",
          satker: filterSatker ? filterSatker.value : "",
          search: search,
        })
      );
      dispatch(setRefresh(false));
    }
  }, [token, page, category, competence, filterUnker, filterSatker, search]);

  const { linimasa, refresh, loading } = useSelector(
    (state) => state.pengetahuan
  );

  const { filter } = useSelector((state) => state.repository);

  useEffect(() => {
    if (refresh) {
      dispatch(
        getLinimasa({
          token: token,
          page: page,
          category: category,
          competence: competence,
          unker: filterUnker ? filterUnker.value : "",
          satker: filterSatker ? filterSatker.value : "",
          search: search,
        })
      );
    }
  }, [refresh]);

  const loadMore = () => {
    if (linimasa.lists.length % 5 === 0 && linimasa.lists.length !== 0) {
      if (linimasa.lists.length === page) {
        setPage(page + 5);
      }
    }
  };

  const filterSearch = () => {
    setSearch(inputValue);
  };

  // useEffect(() => {
  //   if (search !== "") {
  //     const data = linimasa.lists?.filter((item) => {
  //       return item.title.toLowerCase().includes(search.toLowerCase());
  //     });
  //     setFilterData(data);
  //     if (data.length === 0) {
  //     }
  //   } else {
  //     setFilterData(linimasa.lists);
  //   }
  // }, [search, linimasa]);

  // const [ascending, setAscending] = useState(false);
  // const [isFiltered, setIsFiltered] = useState(false);

  // const asc = () => {
  //   const sortedAscending = filterData
  //     .slice()
  //     .sort((a, b) => a.title.localeCompare(b.title));
  //   setFilterData(sortedAscending);
  //   setAscending(true);
  //   setIsFiltered(true);
  // };

  // const desc = () => {
  //   const sortedDescending = filterData
  //     .slice()
  //     .sort((a, b) => b.title.localeCompare(a.title));
  //   setFilterData(sortedDescending);
  //   setAscending(false);
  //   setIsFiltered(true);
  // };

  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalFilterRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttachFilter = (item) => {
    bottomSheetModalFilterRef.current?.present();
  };

  const bottomSheetAttachFilterClose = () => {
    if (bottomSheetModalFilterRef.current)
      bottomSheetModalFilterRef.current?.close();
  };

  const unker = () => {
    let judulUnker = [];
    filter.unker.map((item) => {
      judulUnker.push({
        key: item.id,
        value: item.name,
      });
    });
    return judulUnker;
  };

  const satker = () => {
    let judulSatker = [];
    filter.satker.map((item) => {
      judulSatker.push({
        key: item.id,
        value: item.name,
      });
    });
    return judulSatker;
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(
          getLinimasa({
            token: token,
            page: page,
            category: category,
            competence: competence,
            unker: filterUnker ? filterUnker.value : "",
            satker: filterSatker ? filterSatker.value : "",
            search: search,
          })
        );
        dispatch(setRefresh(false));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, page, category, competence, filterUnker, filterSatker, search]);

  useEffect(() => {
    if (filterData.length === 0) {
      setFilterData(linimasa.lists);
    }
  }, [linimasa]);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const { device } = useSelector((state) => state.apps);

  return (
    <>
      {loading ? <Loading /> : null}
      <>
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
            <TouchableOpacity
              style={{}}
              onPress={() => {
                navigation.navigate("Main");
              }}
            >
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
                fontWeight: 600,
                color: COLORS.white,
              }}
            >
              Linimasa Pengetahuan
            </Text>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              paddingTop: 20,
              paddingBottom: 10,
              rowGap: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width:
                    device === "tablet" && orientation === "landscape"
                      ? "95%"
                      : device === "tablet" && orientation === "potrait"
                      ? "92%"
                      : "85%",
                  // marginRight: 10,
                  backgroundColor: COLORS.white,
                  borderRadius: 8,
                }}
              >
                <View style={styles.input}>
                  <Ionicons
                    name="search"
                    size={fontSizeResponsive("H3", device)}
                    color={COLORS.primary}
                  />
                  <TextInput
                    placeholder={"Cari..."}
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      flex: 1,
                    }}
                    maxLength={30}
                    value={inputValue}
                    onChangeText={(text) => setInputValue(text)}
                    onEndEditing={filterSearch}
                    clearButtonMode="always"
                    allowFontScaling={false}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetAttachFilter();
                  dispatch(getDivisionFilter({ token: token }));
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 30,
                    backgroundColor: COLORS.white,
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: COLORS.secondaryLighter,
                    // borderWidth: isFiltered ? 1 : 0,
                  }}
                >
                  <Ionicons name="filter-outline" size={24} />
                </View>
              </TouchableOpacity>
            </View>

            <Portal>
              <BottomSheetModalProvider>
                <BottomSheetModal
                  ref={bottomSheetModalFilterRef}
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
                    <View style={{ marginVertical: 20 }}>
                      <View
                        style={{
                          marginHorizontal: 20,
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
                          Filter Satuan dan Unit Kerja
                        </Text>
                        <TouchableOpacity
                          style={{}}
                          onPress={() => {
                            bottomSheetAttachFilterClose();
                          }}
                        >
                          <Ionicons
                            name="close-outline"
                            size={24}
                            color={COLORS.lighter}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                        <Text
                          style={{
                            marginHorizontal: 10,
                            marginBottom: 10,
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Unit Kerja
                        </Text>
                        <Dropdown
                          search={true}
                          data={unker()}
                          placeHolder={"Pilih Unit Kerja"}
                          backgroundColor={COLORS.white}
                          selected={filterUnker}
                          setSelected={setFilterUnker}
                          borderWidth={1}
                          borderWidthValue={1}
                          borderwidthDrop={1}
                          borderColor={COLORS.ExtraDivinder}
                          borderColorValue={COLORS.ExtraDivinder}
                          borderColorDrop={COLORS.ExtraDivinder}
                        />
                      </View>

                      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                        <Text
                          style={{
                            marginHorizontal: 10,
                            marginBottom: 10,
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Satuan Kerja
                        </Text>
                        {filterUnker && filterUnker.key ? (
                          <Dropdown
                            data={satker()}
                            search={true}
                            placeHolder={"Pilih Satuan Kerja"}
                            backgroundColor={COLORS.white}
                            selected={filterSatker}
                            setSelected={setFilterSatker}
                            borderWidth={1}
                            borderWidthValue={1}
                            borderwidthDrop={1}
                            borderColor={COLORS.ExtraDivinder}
                            borderColorValue={COLORS.ExtraDivinder}
                            borderColorDrop={COLORS.ExtraDivinder}
                            heightValue={300}
                          />
                        ) : (
                          <View
                            style={{
                              flexDirection: "row",
                              marginHorizontal: 10,
                              marginBottom: 10,
                              gap: 5,
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.infoDanger,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              *
                            </Text>
                            <Text
                              style={{
                                color: COLORS.lighter,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              Daftar satuan kerja akan muncul setelah memilih
                              unit kerja
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>
              </BottomSheetModalProvider>
            </Portal>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor: "brown",
              }}
            >
              <ScrollView
                horizontal
                style={{
                  // backgroundColor: "black",
                  paddingVertical: 10,
                  flexDirection: "row",
                  width: "85%",
                }}
              >
                <TouchableOpacity
                  style={kegiatan ? styles.badgeActive : styles.badge}
                  onPress={handleKegiatan}
                >
                  <Text
                    style={[
                      kegiatan ? styles.badgeTextActive : styles.badgeText,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    Kegiatan
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={infografis ? styles.badgeActive : styles.badge}
                  onPress={handleInfografis}
                >
                  <Text
                    style={[
                      infografis ? styles.badgeTextActive : styles.badgeText,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    Infografis
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={videoJurnal ? styles.badgeActive : styles.badge}
                  onPress={handleVideoJurnal}
                >
                  <Text
                    style={[
                      videoJurnal ? styles.badgeTextActive : styles.badgeText,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    Video / Jurnal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={kepemimpinan ? styles.badgeActive : styles.badge}
                  onPress={handleKepemimpinan}
                >
                  <Text
                    style={[
                      kepemimpinan ? styles.badgeTextActive : styles.badgeText,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    Kepemimpinan
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={manajerial ? styles.badgeActive : styles.badge}
                  onPress={handleManajerial}
                >
                  <Text
                    style={[
                      manajerial ? styles.badgeTextActive : styles.badgeText,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    Manajerial
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={sosialKultural ? styles.badgeActive : styles.badge}
                  onPress={handleSosialKultural}
                >
                  <Text
                    style={[
                      sosialKultural
                        ? styles.badgeTextActive
                        : styles.badgeText,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    Sosial Kultural
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={teknisFungsional ? styles.badgeActive : styles.badge}
                  onPress={handleTeknisFungsional}
                >
                  <Text
                    style={[
                      teknisFungsional
                        ? styles.badgeTextActive
                        : styles.badgeText,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    Teknis Fungsional
                  </Text>
                </TouchableOpacity>
              </ScrollView>
              <View>
                <TouchableOpacity onPress={clearBadge}>
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color={COLORS.lighter}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              width: "100%",
            }}
          >
            <FlatList
              data={linimasa.lists}
              renderItem={({ item }) => (
                <View key={item.id}>
                  <CardLiniMasa
                    item={item}
                    token={token}
                    // setVisibleModal={setVisibleModal}
                    device={device}
                  />
                </View>
              )}
              style={{
                width: "100%",
                // backgroundColor: "brown",
              }}
              ListFooterComponent={() =>
                loading === true ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 24,
                    }}
                  >
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  </View>
                ) : null
              }
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => <ListEmpty />}
              onEndReached={linimasa.lists.length !== 0 ? loadMore : null}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        </View>
      </>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.ExtraDivinder,
    borderRadius: 8,
  },
  badge: {
    // marginHorizontal: 5,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    // backgroundColor: COLORS.secondary,
    marginRight: 5,
    borderRadius: 30,
    borderColor: COLORS.secondaryLighter,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeActive: {
    // marginHorizontal: 5,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    backgroundColor: COLORS.primary,
    marginRight: 5,
    borderRadius: 30,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: COLORS.lighter,
  },
  badgeTextActive: {
    color: COLORS.white,
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
  imageIos: {
    width: "100%",
  },
  imageAndroid: {
    width: "100%",
  },
});
