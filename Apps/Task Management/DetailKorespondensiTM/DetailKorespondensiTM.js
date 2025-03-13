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
} from "../../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {} from "react-native-safe-area-context";
import moment from "moment/min/moment-with-locales";
import {
  getDetailKorespondensiTM,
  postMarkKorespondensiTM,
} from "../../../service/api";
import { KeyboardAvoidingView } from "react-native";
import { getTokenValue } from "../../../service/session";
import { ShimmerDetailKorespondensi } from "./ShimmerDetailKorespondensi";
import { Config } from "../../../constants/config";

export const DetailKorespondensiTM = () => {
  const navigation = useNavigation();

  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const { list, refresh, loading } = useSelector((state) => state.task);
  const { profile } = useSelector((state) => state.superApps);
  const taskDetail = list.detail;
  const BASE_URL = Config.base_url + "bridge";

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (refresh === "list_task") {
      dispatch(getDetailKorespondensiTM({ token: token, id: taskDetail.id }));
    }
    // dispatch(setRefresh(null))
  }, [refresh]);

  // useEffect(() => {
  //     if (taskDetail !== null) {
  //         setStatus({
  //             key: taskDetail.done,
  //             value: transformCapitalize(taskDetail.done)
  //         })
  //     }
  // }, [taskDetail])
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
                  width: 28,
                  height: 28,
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
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
                <Text
                  style={{ fontSize: 15, fontWeight: 600, color: COLORS.white }}
                >
                  Detail Tugas
                </Text>
              </View>
            </View>

            <ScrollView>
              {loading ? (
                <ShimmerDetailKorespondensi />
              ) : (
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    marginHorizontal: 20,
                    marginBottom: 20,
                    borderRadius: 8,
                    marginTop: 20,
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
                          fontSize: FONTSIZE.Judul,
                          color: COLORS.lighter,
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        {taskDetail.subject}
                      </Text>
                      <Text
                        style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter }}
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
                            fontSize: FONTSIZE.H4,
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Target Tanggal
                        </Text>
                        <Text
                          style={{
                            fontSize: FONTSIZE.H4,
                            color: COLORS.lighter,
                            flex: 1,
                          }}
                        >
                          :{" "}
                          {moment(taskDetail.due_date)
                            .locale("id")
                            .format(DATETIME.LONG_DATE)}
                        </Text>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: FONTSIZE.H4,
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
                              fontSize: FONTSIZE.H4,
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
                                fontSize: FONTSIZE.H4,
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
                            fontSize: FONTSIZE.H4,
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
                              fontSize: FONTSIZE.H4,
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
                            {/* <Image source={{ uri: BASE_URL + taskDetail.sender[0]?.avatar }} style={{
                                                                borderWidth: 2,
                                                                borderRadius: 50,
                                                                borderColor: COLORS.white,
                                                                width: 30,
                                                                height: 30
                                                            }} /> */}
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: FONTSIZE.H4,
                                }}
                              >
                                {taskDetail.sender[0]?.title?.name !== ""
                                  ? taskDetail.sender[0]?.title?.name
                                  : taskDetail.sender[0]?.name}
                              </Text>
                              {taskDetail.sender[0]?.name !== "" ? (
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.normal,
                                    fontSize: FONTSIZE.H4,
                                  }}
                                >
                                  {" "}
                                  {taskDetail.sender[0]?.name}
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
                            fontSize: FONTSIZE.H4,
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Penerima Tugas
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
                              fontSize: FONTSIZE.H4,
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
                            {/* <Image source={{ uri: taskDetail.creator?.avatar_url }} style={{
                                                                borderWidth: 2,
                                                                borderRadius: 50,
                                                                borderColor: COLORS.white,
                                                                width: 30,
                                                                height: 30
                                                            }} /> */}
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: FONTSIZE.H4,
                                }}
                              >
                                {taskDetail.receiver[0]?.title?.name !== ""
                                  ? taskDetail.receiver[0]?.title?.name
                                  : taskDetail.receiver[0]?.name}
                              </Text>
                              {taskDetail.receiver[0]?.title?.name !== "" ? (
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.normal,
                                    fontSize: FONTSIZE.H4,
                                  }}
                                >
                                  {" "}
                                  {taskDetail.receiver[0]?.name}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter, width: '40%' }}>Project PIC</Text>
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter }}>: </Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                            <Image source={{ uri: taskDetail.project_pic?.avatar_url }} style={{
                                                                borderWidth: 2,
                                                                borderRadius: 50,
                                                                borderColor: COLORS.white,
                                                                width: 30,
                                                                height: 30
                                                            }} />
                                                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 4 }}>
                                                                <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H4 }}>{taskDetail.project_pic?.title?.name !== '' ? taskDetail.project_pic?.title?.name : taskDetail.project_pic?.nama}</Text>
                                                                {
                                                                    taskDetail.project_pic?.title?.name !== '' ? (
                                                                        <Text style={{ fontWeight: FONTWEIGHT.normal, fontSize: FONTSIZE.H4 }}> {taskDetail.project_pic?.nama}</Text>
                                                                    ) : null
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View> */}

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: FONTSIZE.H4,
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Pengingat
                        </Text>
                        <Text
                          style={{
                            fontSize: FONTSIZE.H4,
                            color: COLORS.lighter,
                            flex: 1,
                          }}
                        >
                          : {taskDetail.reminder}
                        </Text>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: FONTSIZE.H4,
                            color: COLORS.lighter,
                            width: "40%",
                          }}
                        >
                          Selesai
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
                              fontSize: FONTSIZE.H4,
                              color: COLORS.lighter,
                            }}
                          >
                            :{" "}
                          </Text>
                          <View
                            style={{
                              backgroundColor:
                                taskDetail.done === false
                                  ? COLORS.infoDangerLight
                                  : taskDetail.done === true
                                  ? COLORS.successLight
                                  : COLORS.infoLight,
                              borderRadius: 30,
                              padding: 4,
                            }}
                          >
                            {taskDetail.done === true ? (
                              <Text
                                style={{
                                  fontSize: FONTSIZE.H4,
                                  color: COLORS.success,
                                  textTransform: "capitalize",
                                }}
                              >
                                Selesai
                              </Text>
                            ) : (
                              <Text
                                style={{
                                  fontSize: FONTSIZE.H4,
                                  color: COLORS.infoDanger,
                                  textTransform: "capitalize",
                                }}
                              >
                                Belum Selesai
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              <View
                style={{ flexDirection: "column", gap: 20, marginBottom: 20 }}
              >
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      postMarkKorespondensiTM({
                        token: token,
                        id: taskDetail.id,
                      })
                    )
                  }
                >
                  <View
                    style={{
                      marginHorizontal: 20,
                      backgroundColor: COLORS.primary,
                      width: Platform.OS === "ios" ? "90%" : "91%",
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: COLORS.white }}> Tandai Selesai</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </GestureHandlerRootView>
      ) : null}
    </>
  );
};
