import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {} from "react-native-safe-area-context";
import { Portal } from "react-native-portalize";
import { CardItemMember } from "../../../components/CardItemMember";
import { setRefresh } from "../../../store/Pengetahuan";
import {
  getDetailTaskTM,
  postCommentTM,
  updateStatusTaskTM,
} from "../../../service/api";
import { KeyboardAvoidingView } from "react-native";
import { getTokenValue } from "../../../service/session";
import { Dropdown } from "../../../components/DropDown";
import { ShimmerDetailTask } from "./ShimmerDetailTask";
import moment from "moment/min/moment-with-locales";

const dataStatus = [
  {
    key: "backlog",
    value: "Backlog",
  },
  {
    key: "in progress",
    value: "In Progress",
  },
  {
    key: "pending",
    value: "Pending",
  },
  {
    key: "completed",
    value: "Complete",
  },
];

export const DetailTask = () => {
  const navigation = useNavigation();
  const bottomSheetModalMemberRef = useRef(null);
  const bottomSheetModalKomentarRef = useRef(null);
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetMember = () => {
    bottomSheetModalMemberRef.current?.present();
  };

  const bottomSheetKomentar = () => {
    bottomSheetModalKomentarRef.current?.present();
  };

  const bottomsheetKomentarClose = () => {
    if (bottomSheetModalKomentarRef.current)
      bottomSheetModalKomentarRef.current?.close();
  };

  const [token, setToken] = useState("");
  const [komen, setKomen] = useState("");
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [parentId, setParentId] = useState({ id: "", creator: "" });
  const [status, setStatus] = useState("");
  const { list, refresh, loading } = useSelector((state) => state.task);
  const { profile } = useSelector((state) => state.superApps);
  const taskDetail = list.detail;

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
    setStatus("");
  }, []);

  const handleComment = () => {
    const payload = {
      task_id: taskDetail.id,
      parent_id: parentId.id !== "" ? parentId.id : "",
      message: komen,
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postCommentTM(data));
    setKomen("");
    setParentId({ id: "", creator: "" });
  };

  useEffect(() => {
    if (refresh === "comment" || refresh === "list_task") {
      dispatch(getDetailTaskTM({ token: token, id_task: taskDetail.id }));
    }
    dispatch(setRefresh(null));
  }, [refresh]);

  useEffect(() => {
    if (taskDetail !== null) {
      setStatus({
        key: taskDetail.status,
        value: transformCapitalize(taskDetail.status),
      });
    }
  }, [taskDetail]);

  useEffect(() => {
    if (typeof status !== "string" && status.key !== taskDetail?.status) {
      const payload = {
        status: status.key,
      };
      const data = {
        token: token,
        payload: payload,
        id_task: taskDetail.id,
      };
      dispatch(updateStatusTaskTM(data));
    }
  }, [status]);

  const transformCapitalize = (title) => {
    const titleCase = title
      .toLowerCase()
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

    return titleCase;
  };

  const { device } = useSelector((state) => state.apps);

  return (
    <>
      {taskDetail !== null ? (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
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
                <TouchableOpacity
                  style={{}}
                  onPress={() => navigation.goBack()}
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
                  Detail Tugas
                </Text>
              </View>
            </View>

            <View style={{ marginVertical: 20, marginHorizontal: "5%" }}>
              <Dropdown
                placeHolder={"Pilih Prioritas"}
                borderWidth={1}
                data={dataStatus}
                selected={status}
                setSelected={setStatus}
                backgroundColor={COLORS.primary}
                borderColor={COLORS.ExtraDivinder}
                borderwidthDrop={1}
                borderColorDrop={COLORS.ExtraDivinder}
                borderWidthValue={1}
                borderColorValue={COLORS.ExtraDivinder}
                textColor={COLORS.white}
              />
            </View>

            <ScrollView>
              {loading ? (
                <ShimmerDetailTask />
              ) : (
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    marginHorizontal: "5%",
                    marginBottom: 20,
                    borderRadius: 8,
                  }}
                >
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginVertical: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 20,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("Judul", device),
                          color: COLORS.lighter,
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        {taskDetail.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          color: COLORS.lighter,
                        }}
                      >
                        {taskDetail.description}
                      </Text>
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Target Tanggal
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.lighter,
                            flex: 1,
                          }}
                        >
                          :{" "}
                          {moment(taskDetail.due_date).format(
                            DATETIME.LONG_DATE
                          )}
                        </Text>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Prioritas
                        </Text>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                              color: COLORS.lighter,
                            }}
                          >
                            :{" "}
                          </Text>
                          <View
                            style={{
                              backgroundColor:
                                taskDetail.priority === "high"
                                  ? COLORS.infoDangerLight
                                  : taskDetail.priority === "normal"
                                  ? COLORS.successLight
                                  : COLORS.infoLight,
                              borderRadius: 30,
                              padding: 4,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                                color:
                                  taskDetail.priority === "high"
                                    ? COLORS.infoDanger
                                    : taskDetail.priority === "normal"
                                    ? COLORS.success
                                    : COLORS.info,
                                textTransform: "capitalize",
                              }}
                            >
                              {taskDetail.priority}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Penanggung Jawab
                        </Text>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                              color: COLORS.lighter,
                            }}
                          >
                            :{" "}
                          </Text>
                          {taskDetail.members.length > 1 ? (
                            <>
                              <View
                                style={{
                                  flexDirection: "row",
                                  flex: 1,
                                  position: "relative",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {taskDetail.members.map((data, index) => {
                                  return (
                                    <View key={data.nip}>
                                      <Image
                                        source={{ uri: data?.avatar_url }}
                                        style={{
                                          marginLeft: index === 0 ? 0 : -8,
                                          borderWidth: 2,
                                          borderRadius: 50,
                                          borderColor: COLORS.white,
                                          width: device === "tablet" ? 60 : 30,
                                          height: device === "tablet" ? 60 : 30,
                                        }}
                                      />
                                    </View>
                                  );
                                })}
                              </View>
                              {taskDetail.members.length > 3 ? (
                                <TouchableOpacity onPress={bottomSheetMember}>
                                  <View>
                                    <Ionicons
                                      name="chevron-forward-outline"
                                      size={24}
                                      color={COLORS.grey}
                                    />
                                  </View>
                                </TouchableOpacity>
                              ) : null}
                            </>
                          ) : (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Image
                                source={{
                                  uri: taskDetail.members[0]?.avatar_url,
                                }}
                                style={{
                                  borderWidth: 2,
                                  borderRadius: 50,
                                  borderColor: COLORS.white,
                                  width: device === "tablet" ? 60 : 30,
                                  height: device === "tablet" ? 60 : 30,
                                }}
                              />
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.bold,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {taskDetail.members[0]?.title?.name !== ""
                                    ? taskDetail.members[0]?.title?.name
                                    : taskDetail.members[0]?.nama}
                                </Text>
                                {taskDetail.members[0]?.title?.name !== "" ? (
                                  <Text
                                    style={{
                                      fontWeight: FONTWEIGHT.normal,
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                    }}
                                  >
                                    {" "}
                                    {taskDetail.members[0]?.nama}
                                  </Text>
                                ) : null}
                              </View>
                            </View>
                          )}
                        </View>

                        <Portal>
                          <BottomSheetModalProvider>
                            <BottomSheetModal
                              ref={bottomSheetModalMemberRef}
                              snapPoints={animatedSnapPoints}
                              handleHeight={animatedHandleHeight}
                              contentHeight={animatedContentHeight}
                              index={0}
                              style={{ borderRadius: 50 }}
                              keyboardBlurBehavior="restore"
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
                                <View
                                  style={{ marginTop: 20, marginBottom: 40 }}
                                >
                                  <View
                                    style={{
                                      marginBottom: 20,
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: fontSizeResponsive(
                                          "H2",
                                          device
                                        ),
                                        fontWeight: FONTWEIGHT.bold,
                                        color: COLORS.lighter,
                                      }}
                                    >
                                      Penanggung Jawab
                                    </Text>
                                  </View>
                                  <View>
                                    <FlatList
                                      data={taskDetail.members}
                                      renderItem={({ item }) => (
                                        <View key={item.nip}>
                                          <CardItemMember
                                            item={item}
                                            device={device}
                                          />
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
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Pembuat Project
                        </Text>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                              color: COLORS.lighter,
                            }}
                          >
                            :{" "}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Image
                              source={{
                                uri: taskDetail.project_creator?.avatar_url,
                              }}
                              style={{
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: COLORS.white,
                                width: device === "tablet" ? 60 : 30,
                                height: device === "tablet" ? 60 : 30,
                              }}
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {taskDetail.project_creator?.title?.name !== ""
                                  ? taskDetail.project_creator?.title?.name
                                  : taskDetail.project_creator?.nama}
                              </Text>
                              {taskDetail.project_creator?.title?.name !==
                              "" ? (
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.normal,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {" "}
                                  {taskDetail.project_creator?.nama}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Pembuat Tugas
                        </Text>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                              color: COLORS.lighter,
                            }}
                          >
                            :{" "}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Image
                              source={{ uri: taskDetail.creator?.avatar_url }}
                              style={{
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: COLORS.white,
                                width: device === "tablet" ? 60 : 30,
                                height: device === "tablet" ? 60 : 30,
                              }}
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {taskDetail.creator?.title?.name !== ""
                                  ? taskDetail.creator?.title?.name
                                  : taskDetail.creator?.nama}
                              </Text>
                              {taskDetail.creator?.title?.name !== "" ? (
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.normal,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {" "}
                                  {taskDetail.creator?.nama}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Project PIC
                        </Text>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                              color: COLORS.lighter,
                            }}
                          >
                            :{" "}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Image
                              source={{
                                uri: taskDetail.project_pic?.avatar_url,
                              }}
                              style={{
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: COLORS.white,
                                width: device === "tablet" ? 60 : 30,
                                height: device === "tablet" ? 60 : 30,
                              }}
                            />
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                gap: 4,
                              }}
                            >
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {taskDetail.project_pic?.title?.name !== ""
                                  ? taskDetail.project_pic?.title?.name
                                  : taskDetail.project_pic?.nama}
                              </Text>
                              {taskDetail.project_pic?.title?.name !== "" ? (
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.normal,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {" "}
                                  {taskDetail.project_pic?.nama}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Pengingat
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            color: COLORS.lighter,
                            flex: 1,
                          }}
                        >
                          : {taskDetail.reminder}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              <View
                style={{ flexDirection: "column", gap: 20, marginBottom: 20 }}
              >
                <TouchableOpacity onPress={bottomSheetKomentar}>
                  <View
                    style={{
                      marginHorizontal: "5%",
                      backgroundColor: COLORS.info,
                      width: Platform.OS === "ios" ? "90%" : "91%",
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Komentar ({taskDetail.comments.length})
                    </Text>
                  </View>
                </TouchableOpacity>

                {profile.nip === taskDetail.project_creator?.nip ||
                profile.nip === taskDetail.project_pic?.nip ? (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("EditTask", {
                          id_project: taskDetail.project_id,
                          id_list: taskDetail.list_id,
                          id: taskDetail.id,
                        })
                      }
                    >
                      <View
                        style={{
                          marginHorizontal: "5%",
                          backgroundColor: COLORS.lightBrown,
                          width: Platform.OS === "ios" ? "90%" : "91%",
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Ubah
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        const datas = {
                          token: token,
                          id: taskDetail.id,
                        };
                        dispatch(deleteTask(datas));
                        setTimeout(() => {
                          dispatch(
                            getListDashboardTM({ token: token, page: page })
                          );
                        }, 3000);
                      }}
                    >
                      <View
                        style={{
                          marginHorizontal: "5%",
                          backgroundColor: COLORS.infoDanger,
                          width: Platform.OS === "ios" ? "90%" : "91%",
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Hapus
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                ) : null}
              </View>
              <Portal>
                <BottomSheetModalProvider>
                  <BottomSheetModal
                    ref={bottomSheetModalKomentarRef}
                    snapPoints={animatedSnapPoints}
                    handleHeight={animatedHandleHeight}
                    contentHeight={animatedContentHeight}
                    index={0}
                    style={{ borderRadius: 50 }}
                    keyboardBlurBehavior="restore"
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
                    <BottomSheetView onLayout={handleContentLayout} style={{}}>
                      <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "height" : "height"}
                        keyboardVerticalOffset={parentId !== "" ? 120 : 80}
                      >
                        <View style={{ marginLeft: 20, marginVertical: 20 }}>
                          <Text
                            style={{
                              color: COLORS.ExtraDivinder,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            Komentar({taskDetail.comments.length})
                          </Text>
                        </View>

                        <FlatList
                          data={taskDetail.comments}
                          renderItem={({ item }) => (
                            <CardKomen
                              listData={item}
                              inputRef={inputRef}
                              setParentId={setParentId}
                              device={device}
                            />
                          )}
                          style={{ height: 500 }}
                        />

                        <View style={{ justifyContent: "flex-end" }}>
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
                                  fontSize: fontSizeResponsive("H4", device),
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
                              justifyContent: "center",
                              alignItems: "center",
                              marginHorizontal: 20,
                              borderRadius: 16,
                              borderColor: COLORS.ExtraDivinder,
                              flexDirection: "row",
                              backgroundColor: COLORS.ExtraDivinder,
                              marginTop: 10,
                              marginBottom: 40,
                            }}
                          >
                            <BottomSheetTextInput
                              numberOfLines={1}
                              maxLength={40}
                              placeholder="Ketik Komentar Disini"
                              ref={inputRef}
                              style={{ padding: 10, width: "90%" }}
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
                </BottomSheetModalProvider>
              </Portal>
            </ScrollView>
          </View>
        </GestureHandlerRootView>
      ) : null}
    </>
  );
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
              style={{
                width: device === "tablet" ? 50 : 30,
                height: device === "tablet" ? 50 : 30,
                borderRadius: device === "tablet" ? 30 : 20,
              }}
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H2", device),
                fontWeight: FONTWEIGHT.bold,
                lineHeight: 25,
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
                  lineHeight: 20,
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
                fontSize: fontSizeResponsive("H3", device),
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
                          lineHeight: 20,
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
                              source={{ uri: listData.creator_avatar }}
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
                                lineHeight: 25,
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
                                  lineHeight: 20,
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
                                lineHeight: 25,
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
                                      lineHeight: 20,
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
