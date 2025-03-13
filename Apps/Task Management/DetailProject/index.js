import React, { useEffect, useMemo, useRef } from "react";
import { FlatList, ScrollView, useWindowDimensions, View } from "react-native";
import { Text } from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-native";
import { Portal } from "react-native-portalize";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CardItemMember } from "../../../components/CardItemMember";
import { useState } from "react";
import ListEmpty from "../../../components/ListEmpty";
import {
  deleteTask,
  deleteTaskProject,
  getListDashboardTM,
  getListTaskTM,
} from "../../../service/api";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const CardListKategori = ({ item, token, id_list, type, device }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);
  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(
          getListTaskTM({ token: token, id_list: id_list, type: type.value })
        );
      }}
    >
      <View
        style={{
          width: "90%",
          backgroundColor: COLORS.white,
          borderRadius: 8,
          gap: 1,
          marginVertical: 5,
          marginHorizontal:
            device === "tablet" && orientation === "landscape"
              ? 60
              : device === "tablet" && orientation === "potrait"
              ? 40
              : 20,
          //shadow
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <View style={{ marginVertical: 10, marginLeft: 10 }}>
          <Text
            style={{
              fontWeight: FONTWEIGHT.bold,
              fontSize: fontSizeResponsive("H2", device),
            }}
          >
            {item.value}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const DetailProject = ({
  token,
  type,
  choiceKategori,
  dataKategori,
}) => {
  const { detailProject, treeView, loading } = useSelector(
    (state) => state.task
  );
  const { profile } = useSelector((state) => state.superApps);
  const dispatch = useDispatch();
  // const [choiceKategori, setChoiceKategori] = useState('')
  const [dataList, setDataList] = useState([]);
  const navigation = useNavigation();
  const bottomSheetModalMemberRef = useRef(null);
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
  const bottomsheetMemberClose = () => {
    if (bottomSheetModalMemberRef.current)
      bottomSheetModalMemberRef.current?.close();
  };
  useEffect(() => {
    let arrList = [];
    const index = treeView.map((e) => e.id).indexOf(choiceKategori.key);
    treeView[index]?.list_tasks?.map((item) => {
      arrList.push({
        key: item.id,
        value: item.name,
      });
    });
    // setChoiceList(arrList.length > 0 ? arrList[0] : '')
    setDataList(arrList);
  }, [choiceKategori]);

  let arrTask = [];
  {
    treeView.map((item) => {
      if (detailProject.id === item.id) {
        item.list_tasks.map((task) => {
          arrTask.push({
            key: task.id,
            value: task.name,
          });
          // setDataList(arrTask)
        });
      } else {
      }
    });
  }

  const setType = () => {
    type = {
      key: "1",
      value: "Dashboard",
    };
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const { device } = useSelector((state) => state.apps);

  return (
    <>
      {loading === true ? null : (
        <BottomSheetModalProvider>
          <View style={{ flex: 1 }}>
            <ScrollView>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  marginHorizontal:
                    device === "tablet" && orientation === "landscape"
                      ? 60
                      : device === "tablet" && orientation === "potrait"
                      ? 40
                      : 20,
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
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("Judul", device),
                        color: COLORS.lighter,
                        fontWeight: FONTWEIGHT.bold,
                      }}
                    >
                      {detailProject.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        color: COLORS.lighter,
                      }}
                    >
                      {detailProject.description}
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
                        Tanggal Dibuat
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          color: COLORS.lighter,
                          flex: 1,
                        }}
                      >
                        : {detailProject.created_at}
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
                        PIC
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
                        {detailProject.pic.length > 1 ? (
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
                              {detailProject.pic.map((data, index) => {
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
                            <TouchableOpacity onPress={bottomSheetMember}>
                              <View>
                                <Ionicons
                                  name="chevron-forward-outline"
                                  size={device === "tablet" ? 40 : 24}
                                  color={COLORS.grey}
                                />
                              </View>
                            </TouchableOpacity>
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
                              source={{ uri: detailProject.pic[0]?.avatar_url }}
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
                                {detailProject.pic[0]?.title?.name !== ""
                                  ? detailProject.pic[0]?.title?.name
                                  : detailProject.pic[0]?.nama}
                              </Text>
                              {detailProject.pic[0]?.title?.name !== "" ? (
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.normal,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {" "}
                                  {detailProject.pic[0]?.nama}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        )}
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
                        {detailProject.members.length > 1 ? (
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
                              {detailProject.members.map((data, index) => {
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
                            <TouchableOpacity onPress={bottomSheetMember}>
                              <View>
                                <Ionicons
                                  name="chevron-forward-outline"
                                  size={device === "tablet" ? 40 : 24}
                                  color={COLORS.grey}
                                />
                              </View>
                            </TouchableOpacity>
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
                                uri: detailProject.members[0]?.avatar_url,
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
                                {detailProject.members[0]?.title?.name !== ""
                                  ? detailProject.members[0]?.title?.name
                                  : detailProject.members[0]?.nama}
                              </Text>
                              {detailProject.members[0]?.title?.name !== "" ? (
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.normal,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {" "}
                                  {detailProject.members[0]?.nama}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        )}
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
                            source={{ uri: detailProject.creator.avatar_url }}
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
                              {detailProject.creator.title?.name !== ""
                                ? detailProject.creator.title?.name
                                : detailProject.creator.nama}
                            </Text>
                            {detailProject.creator.title?.name !== "" ? (
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.normal,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {" "}
                                {detailProject.creator.nama}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {profile.nip === detailProject.creator.nip ||
              profile.nip === detailProject.pic[0].nip ? (
                <View
                  style={{
                    marginVertical: 20,
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EditCategory", {
                        id: detailProject.id,
                      })
                    }
                  >
                    <View
                      style={{
                        marginHorizontal:
                          device === "tablet" && orientation === "landscape"
                            ? 60
                            : device === "tablet" && orientation === "potrait"
                            ? 40
                            : 20,
                        backgroundColor: COLORS.lightBrown,
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
                        id: detailProject.id,
                      };
                      dispatch(deleteTaskProject(datas));
                      setTimeout(() => {
                        dispatch(getListDashboardTM({ token: token, page: 5 }));
                      }, 3000);
                    }}
                  >
                    <View
                      style={{
                        marginHorizontal:
                          device === "tablet" && orientation === "landscape"
                            ? 60
                            : device === "tablet" && orientation === "potrait"
                            ? 40
                            : 20,
                        backgroundColor: COLORS.infoDanger,
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
                </View>
              ) : null}

              <View>
                <Text
                  style={{
                    marginHorizontal:
                      device === "tablet" && orientation === "landscape"
                        ? 60
                        : device === "tablet" && orientation === "potrait"
                        ? 40
                        : 20,
                    marginVertical: 10,
                    fontWeight: FONTWEIGHT.bold,
                    color: COLORS.lighter,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  List Task
                </Text>
                <FlatList
                  data={arrTask}
                  renderItem={({ item }) => (
                    <CardListKategori
                      item={item}
                      token={token}
                      id_list={item.key}
                      type={type}
                      device={device}
                    />
                  )}
                  ListEmptyComponent={() => <ListEmpty />}
                />
              </View>
              {/* <Portal>  */}
              <BottomSheetModal
                ref={bottomSheetModalMemberRef}
                snapPoints={animatedSnapPoints}
                handleHeight={animatedHandleHeight}
                contentHeight={animatedContentHeight}
                index={0}
                style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
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
                        marginBottom: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          fontWeight: FONTWEIGHT.bold,
                          color: COLORS.lighter,
                        }}
                      >
                        Penanggung Jawab
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          bottomsheetMemberClose();
                        }}
                      >
                        <View
                          style={{
                            width: 51,
                            height: 51,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 50,
                          }}
                        >
                          <Ionicons name="close-outline" size={24} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <FlatList
                        data={detailProject.members}
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
              {/* </Portal> */}
            </ScrollView>
          </View>
        </BottomSheetModalProvider>
      )}
    </>
  );
};
