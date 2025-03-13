import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { TouchableOpacity, FlatList, Dimensions, Platform } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import {
  TopsTask,
  TopsTaskDashboard,
  TopsTaskKorespondensi,
} from "../../utils/menutab";
import { Search } from "../../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh, setVariant } from "../../store/Task";
import { useEffect } from "react";
import {} from "react-native-safe-area-context";
import { Dropdown } from "../../components/DropDown";
import {
  getDetailProjectTM,
  getListDashboardTM,
  getListKorespondensiArsipTM,
  getListKorespondensiNextWeekTM,
  getListKorespondensiOverdueTM,
  getListKorespondensiTM,
  getListKorespondensiTodayTM,
  getListTaskTM,
  getTreeTM,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import { FilterTask } from "./FilterTask";
import { DetailProject } from "./DetailProject";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { Loading } from "../../components/Loading";
import { Portal } from "react-native-portalize";

const tipe = [
  { key: "1", value: "Dashboard" },
  { key: "2", value: "Korespondensi" },
  { key: "3", value: "Agenda Rapat" },
  { key: "4", value: "Task Untuk Saya" },
  { key: "5", value: "Task Dari Saya" },
];

const { width: screenWidth } = Dimensions.get("window");

export const MyTask = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [page, setPage] = useState(5);
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    dispatch(getListDashboardTM({ token: token, page: page }));
    dispatch(getTreeTM({ token: token, page: page }));
  }, [token, page]);

  const { refresh, variant, treeView, list, loading } = useSelector(
    (state) => state.task
  );
  const taskLists = list.data;

  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalSelectRef = useRef(null);
  const bottomSheetModalAddRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["50%", "90%"], []);
  const initialSnapPointsTambah = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPointsTambah);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const bottomSheetAttachSelect = () => {
    bottomSheetModalSelectRef.current?.present();
  };

  const bottomSheetSelectClose = () => {
    if (bottomSheetModalSelectRef.current)
      bottomSheetModalSelectRef.current?.close();
  };

  const bottomSheetAdd = () => {
    bottomSheetModalAddRef.current?.present();
  };

  const bottomsheetAddClose = () => {
    if (bottomSheetModalAddRef.current) bottomSheetModalAddRef.current?.close();
  };

  // const loadMore = () => {
  //     if (taskLists.length % 5 === 0) {
  //         setPage(page + 5);
  //     }
  // };

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const [choiceTipe, setChoiceTipe] = useState({
    key: "1",
    value: "Dashboard",
  });
  const [choiceKategori, setChoiceKategori] = useState("");
  const [choiceList, setChoiceList] = useState("");
  const [dataKategori, setDataKategori] = useState([]);
  const [dataList, setDataList] = useState([]);

  const [choiceFilter, setChoiceFilter] = useState("semua");

  useEffect(() => {
    if (choiceTipe.key !== "1" || choiceTipe.key !== "2") {
      let arrKategori = [];
      treeView.map((item) => {
        if (choiceTipe.key === "3" && item.kategori === "event") {
          arrKategori.push({
            key: item.id,
            value: item.name,
          });
        } else {
          if (
            choiceTipe.key === "4" &&
            item.kategori === "task" &&
            !item.my_project
          ) {
            arrKategori.push({
              key: item.id,
              value: item.name,
            });
          } else if (
            choiceTipe.key === "5" &&
            item.kategori === "task" &&
            item.my_project
          ) {
            arrKategori.push({
              key: item.id,
              value: item.name,
            });
          }
        }
      });
      // setChoiceKategori(arrKategori.length > 0 ? arrKategori[0] : '')
      setDataKategori(arrKategori);
    }
  }, [choiceTipe]);

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

  const handleChoiceSubmit = () => {
    if (choiceTipe.value === "Dashboard") {
      dispatch(getListDashboardTM({ token: token, page: page }));
    } else if (choiceTipe.value === "Korespondensi") {
      dispatch(getListKorespondensiArsipTM({ token: token, page: page }));
      dispatch(getListKorespondensiTodayTM({ token: token, page: page }));
      dispatch(getListKorespondensiNextWeekTM({ token: token, page: page }));
      dispatch(getListKorespondensiOverdueTM({ token: token, page: page }));
    } else {
      if (choiceList === "" && choiceKategori !== "") {
        dispatch(
          getDetailProjectTM({
            token: token,
            id_project: choiceKategori.key,
            type: "Detail Project",
          })
        );
        setChoiceKategori([]);
      } else {
        // dispatch(getListTaskTM({ token: token, id_list: choiceList.key, type: choiceTipe.value }))
        alert("Data Tidak boleh kosong, Harap diisi");
      }
    }
    setChoiceFilter("semua");
  };

  // const filter = (event) => {
  //     setSearch(event)
  // }

  // useEffect(() => {
  //     if (search !== '') {
  //         const status = choiceFilter == 1 ? '' : choiceFilter == 2 ? 'in progress' : choiceFilter == 3 ? 'pending' : choiceFilter == 4 ? 'completed' : 'backlog'
  //         const data = taskLists.filter((item) => {
  //             if (choiceFilter == 1) {
  //                 return item.title?.toLowerCase().includes(search.toLowerCase())
  //             } else {
  //                 return item.title?.toLowerCase().includes(search.toLowerCase()) && item.status === status
  //             }
  //         })
  //         setFilterData(data)
  //     } else {
  //         const status = choiceFilter == 1 ? '' : choiceFilter == 2 ? 'in progress' : choiceFilter == 3 ? 'pending' : choiceFilter == 4 ? 'completed' : 'backlog'
  //         const data = taskLists.filter((item) => {
  //             if (choiceFilter == 1) {
  //                 return item
  //             } else {
  //                 return item.status === status
  //             }
  //         })
  //         setFilterData(data)
  //     }
  // }, [search])

  useEffect(() => {
    const data = taskLists.filter((item) => {
      if (choiceFilter === "semua") {
        return item;
        // } else if (choiceFilter == "arsip") {
        //   return item;
      } else {
        if (list.type === "Dashboard") {
          return item.deadline_status === choiceFilter;
          // } else if (list.type === "Korespondensi") {
          //   return item.deadline_status == choiceFilter;
          // } else {
          return item.status === choiceFilter;
        }
      }
    });
    setFilterData(data);
  }, [choiceFilter, list.type]);

  useEffect(() => {
    if (refresh === "tree") {
      dispatch(getTreeTM({ token: token }));
    } else if (refresh === "list_task") {
      dispatch(
        getListTaskTM({
          token: token,
          id_list: choiceList.key,
          type: choiceTipe.value,
        })
      );
    } else if (refresh === "detail_project") {
      dispatch(getTreeTM({ token: token }));
      dispatch(
        getDetailProjectTM({
          token: token,
          id_project: choiceKategori.key,
          type: "Detail Project",
        })
      );
    }
    dispatch(setRefresh(null));
  }, [refresh]);

  const { device } = useSelector((state) => state.apps);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          {loading && <Loading />}
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
              <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
                <Ionicons
                  name="chevron-back-outline"
                  size={device === "tablet" ? 40 : 24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H1", device),
                  fontWeight: 600,
                  color: COLORS.white,
                }}
              >
                Task Management
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 20,
                width: device === "tablet" ? 40 : 28,
                height: device === "tablet" ? 40 : 28,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Laporan");
                }}
              >
                <Ionicons
                  name="document-text-outline"
                  size={device === "tablet" ? 30 : 24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", gap: 5, paddingHorizontal: "5%" }}
          >
            <TouchableOpacity
              onPress={bottomSheetAttachSelect}
              style={{ width: "100%" }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  marginVertical: 20,
                  paddingVertical: 14,
                  justifyContent: "space-between",
                  alignContent: "center",
                  borderRadius: 8,
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    marginLeft: 20,
                    color: COLORS.lighter,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Pilih Project
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={24}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>

            <BottomSheetModal
              ref={bottomSheetModalSelectRef}
              snapPoints={initialSnapPoints}
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
                      alignItems: "center",
                      marginVertical: 20,
                      marginHorizontal: "5%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H1", device),
                        fontWeight: FONTWEIGHT.bold,
                      }}
                    >
                      Pilih
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        bottomSheetSelectClose();
                      }}
                    >
                      <Ionicons
                        name="close-outline"
                        size={24}
                        color={COLORS.lighter}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{ width: "90%", marginHorizontal: "5%" }}>
                    <Dropdown
                      placeHolder={"Pilih Tipe"}
                      borderWidth={1}
                      data={tipe}
                      // selected={choiceTipe}
                      setSelected={setChoiceTipe}
                      borderColor={COLORS.ExtraDivinder}
                      borderwidthDrop={1}
                      borderColorDrop={COLORS.ExtraDivinder}
                      borderWidthValue={1}
                      borderColorValue={COLORS.ExtraDivinder}
                    />
                  </View>

                  {choiceTipe.key === "3" ||
                  choiceTipe.key === "4" ||
                  choiceTipe.key === "5" ? (
                    <>
                      <View
                        style={{
                          width: "90%",
                          marginHorizontal: "5%",
                          marginTop: 20,
                        }}
                      >
                        <Dropdown
                          placeHolder={"Pilih Kategori"}
                          borderWidth={1}
                          data={dataKategori}
                          // selected={choiceKategori}
                          setSelected={setChoiceKategori}
                          borderColor={COLORS.ExtraDivinder}
                          borderwidthDrop={1}
                          borderColorDrop={COLORS.ExtraDivinder}
                          borderWidthValue={1}
                          borderColorValue={COLORS.ExtraDivinder}
                        />
                      </View>

                      {/* <View style={{ width: '90%', marginHorizontal: 20, marginTop: 20 }}>
                                                    <Dropdown
                                                        placeHolder={'Pilih List'}
                                                        borderWidth={1}
                                                        data={dataList}
                                                        // selected={choiceList}
                                                        setSelected={setChoiceList}
                                                        borderColor={COLORS.ExtraDivinder}
                                                        borderwidthDrop={1}
                                                        borderColorDrop={COLORS.ExtraDivinder}
                                                        borderWidthValue={1}
                                                        borderColorValue={COLORS.ExtraDivinder}
                                                    />
                                                </View> */}
                    </>
                  ) : null}

                  <TouchableOpacity
                    onPress={() => {
                      bottomSheetSelectClose();
                      handleChoiceSubmit();
                    }}
                    style={{
                      marginHorizontal: "5%",
                      backgroundColor: COLORS.primary,
                      width: Platform.OS === "ios" ? "90%" : "91%",
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 6,
                      marginVertical: 40,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H3", device),
                        }}
                      >
                        Terapkan
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </BottomSheetView>
            </BottomSheetModal>

            {/* <TouchableOpacity onPress={bottomSheetAttach} style={{ width: "11%" }}>
                            <View style={{ backgroundColor: COLORS.white, marginVertical: 20, height: 54, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
                                <Ionicons name='search-outline' size={24} color={COLORS.primary} />
                            </View>
                        </TouchableOpacity> */}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "column", gap: 4, flex: 1 }}>
              {loading ? (
                <>
                  {/* <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={20} />
                                        <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={150} height={20} /> */}
                </>
              ) : (
                <View
                  style={{
                    marginHorizontal: "5%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.lighter,
                    }}
                  >
                    {list.type}
                  </Text>
                  {list.type === "Dashboard" ||
                  list.type === "Korespondensi" ? null : (
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: FONTWEIGHT.normal,
                        color: COLORS.lighter,
                      }}
                      numberOfLines={2}
                    >
                      {list.name}
                    </Text>
                  )}
                </View>
              )}
              {/* {list.type !== 'Detail Project' ? (

                                <View style={{ backgroundColor: '#F0F0F0', borderRadius: 8, borderColor: COLORS.white, marginTop: 10 }}>
                                    <Search
                                        placeholder={"Cari"}
                                        iconColor={COLORS.primary}
                                        onSearch={filter}
                                    />
                                </View>
                            ) : null} */}
            </View>
          </View>

          {list.type !== "Detail Project" ? (
            <View
              style={{
                flex: 1,
                marginTop: 20,
                width: "90%",
                marginHorizontal: "5%",
              }}
            >
              {list.type === "Dashboard" ? (
                <TopsTaskDashboard device={device} />
              ) : list.type === "Korespondensi" ? (
                <TopsTaskKorespondensi device={device} />
              ) : loading === false ? (
                <TopsTask device={device} />
              ) : null}
            </View>
          ) : (
            <DetailProject
              token={token}
              type={choiceTipe}
              choiceKategori={choiceKategori}
            />
          )}

          {/* {list.type === "Task Dari Saya" ? (
            <View style={{ position: "absolute", bottom: 20, right: 20 }}>
              <TouchableOpacity onPress={bottomSheetAdd}>
                <View
                  style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 50,
                    width: 44,
                    height: 44,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="add-outline" size={24} color={COLORS.white} />
                </View>
              </TouchableOpacity>
            </View>
          ) : null} */}

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
              <View style={{ marginHorizontal: 20 }}>
                <View style={{ flexDirection: "row", gap: 16 }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "#F0F0F0",
                      borderRadius: 8,
                      borderColor: COLORS.white,
                    }}
                  >
                    {/* <Search
                                            placeholder={"Cari"}
                                            iconColor={COLORS.primary}
                                            onSearch={filter}
                                        /> */}
                  </View>
                  {/* <FlatList
                                        data={filterData}
                                        renderItem={({ item, index }) => (
                                            <View key={index}>
                                            <Item
                                                image={item.image}
                                                tanggal={item.updated_at}
                                                // subtitle={item.subtitle}
                                                title={item.title}
                                                id={item.id}
                                                item={item}
                                                token={token}
                                            />
                                            </View>
                                        )}
                                        keyExtractor={(item) => item.id}
                                    /> */}
                  <TouchableOpacity
                    style={{ justifyContent: "center" }}
                    onPress={() => {
                      bottomSheetAttachClose();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H1", device),
                        color: COLORS.infoDanger,
                        fontWeight: 500,
                      }}
                    >
                      Batal
                    </Text>
                  </TouchableOpacity>
                </View>

                <FilterTask
                  choiceFilter={choiceFilter}
                  setChoiceFilter={setChoiceFilter}
                  filterData={filterData}
                  type={list.type}
                />
              </View>
            </BottomSheetView>
          </BottomSheetModal>

          <BottomSheetModal
            ref={bottomSheetModalAddRef}
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
              <View style={{ marginBottom: 50 }}>
                <View
                  style={{
                    marginHorizontal: 20,
                    backgroundColor: COLORS.infoDanger,
                    height: 60,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                    onPress={() => {
                      navigation.navigate("AddCategory");
                      bottomsheetAddClose();
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Tambah Project
                    </Text>
                  </TouchableOpacity>
                </View>

                {}
                <View
                  style={{
                    marginHorizontal: 20,
                    backgroundColor: COLORS.infoDanger,
                    height: 60,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                    onPress={() => {
                      navigation.navigate("AddTask", {
                        id_project: choiceKategori.key,
                        id_list: choiceList.key,
                      });
                      bottomsheetAddClose();
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Tambah Task
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  circleList: {
    width: 35,
    height: 35,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  checkbox: {
    alignSelf: "flex-end",
  },
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  items: {
    width: screenWidth - 60,
    height: screenWidth - 170,
  },
});
