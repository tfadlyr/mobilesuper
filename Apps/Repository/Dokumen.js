import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../../components/Search";
import { FlatList } from "react-native";
import { Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  setDokumentlists,
  setEdit,
  setLoadMore,
  setRating,
} from "../../store/Repository";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {} from "react-native-safe-area-context";
import { Portal } from "react-native-portalize";
import ListEmpty from "../../components/ListEmpty";
import { getTokenValue } from "../../service/session";
import { getDocument } from "../../service/api";
import { getDetailDocument } from "../../service/api";
import moment from "moment/min/moment-with-locales";
import { ActivityIndicator } from "react-native";
import { Dropdown } from "../../components/DropDown";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";

const DataList = ({ token, item, bottomSheetAttach, device, tipe }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getDetailRepo = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailDocument(params));
  };
  return (
    <BottomSheetModalProvider>
      <View
        key={item.id}
        style={{
          display: "flex",
          flexDirection: "row",
          marginVertical: 10,
          marginHorizontal: "5%",
          backgroundColor: COLORS.white,
          borderRadius: 8,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              display: "flex",
            }}
          >
            {item.published === true ? (
              <TouchableOpacity
                onPress={() => {
                  // bottomSheetAttach(item);

                  if (tipe === "revision") {
                    dispatch(setEdit("Edit"));
                    navigation.navigate("DetailActivity");
                    getDetailRepo(item.id);
                    // dispatch(setRating(true));
                  } else {
                    navigation.navigate("MainDetailRepo");
                    getDetailRepo(item.id);
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: FONTWEIGHT.bold,
                    marginBottom: 10,
                    width: device === "tablet" ? 400 : 300,
                  }}
                >
                  {item.title}
                </Text>

                <View
                  style={{
                    // backgroundColor: "brown",
                    display: "flex",
                    flexDirection: "row",
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                      width: device === "tablet" ? 200 : 100,
                    }}
                  >
                    Jumlah File
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                    }}
                  >
                    {item.attachments.length}
                  </Text>
                </View>

                <View
                  style={{
                    // backgroundColor: "brown",
                    display: "flex",
                    flexDirection: "row",
                    paddingRight: 10,
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                      width: device === "tablet" ? 200 : 100,
                    }}
                  >
                    Dibuat
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                    }}
                  >
                    {moment(item.created_at)
                      .locale("id")
                      .format("DD MMMM yyyy")}
                  </Text>
                </View>

                <View
                  style={{
                    // backgroundColor: "brown",
                    display: "flex",
                    flexDirection: "row",
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                      width: device === "tablet" ? 200 : 100,
                    }}
                  >
                    Perubahan
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                    }}
                  >
                    {moment(item.updated_at)
                      .locale("id")
                      .format("DD MMMM yyyy")}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("BerbagiDokumen", {
                    data: item,
                    type: "draft",
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: FONTWEIGHT.bold,
                    marginBottom: 10,
                    width: device === "tablet" ? 400 : 300,
                  }}
                >
                  {item.title}
                </Text>

                <View
                  style={{
                    // backgroundColor: "brown",
                    display: "flex",
                    flexDirection: "row",
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                      width: device === "tablet" ? 200 : 100,
                    }}
                  >
                    Jumlah File
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                    }}
                  >
                    {item.attachments.length}
                  </Text>
                </View>

                <View
                  style={{
                    // backgroundColor: "brown",
                    display: "flex",
                    flexDirection: "row",
                    paddingRight: 10,
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                      width: device === "tablet" ? 200 : 100,
                    }}
                  >
                    Dibuat
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                    }}
                  >
                    {moment(item.created_at)
                      .locale("id")
                      .format("DD MMMM yyyy")}
                  </Text>
                </View>

                <View
                  style={{
                    // backgroundColor: "brown",
                    display: "flex",
                    flexDirection: "row",
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                      width: device === "tablet" ? 200 : 100,
                    }}
                  >
                    Perubahan
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.normal,
                      color: COLORS.lighter,
                    }}
                  >
                    {moment(item.updated_at)
                      .locale("id")
                      .format("DD MMMM yyyy")}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};

const dropdownFilter = [
  {
    key: "false",
    value: "Draft",
  },
  {
    key: "true",
    value: "Published",
  },
];

export const Dokumen = () => {
  const [variant, setVariant] = useState("list");
  const [dataM, setDataM] = useState([]);
  const [token, setToken] = useState("");
  const [page, setPage] = useState(10);
  const [type, setType] = useState({
    key: "false",
    value: "Draft",
  });
  const dispatch = useDispatch();

  const handleVariant = (cekVariant) => {
    setVariant(cekVariant);
  };
  const navigation = useNavigation();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(
        getDocument({
          token: token,
          page: page,
          type: type.key,
          tipe: type.value,
        })
      );
    }
    dispatch(setEdit(""));
  }, [token, page, type]);

  const bottomSheetModalRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = (item) => {
    bottomSheetModalRef.current?.present();
    setDataM(item);
  };

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const { dokumen, loading, load } = useSelector((state) => state.repository);

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(dokumen.lists);
  }, [dokumen]);

  useEffect(() => {
    if (search !== "") {
      const data = dokumen.lists.filter((item) => {
        return item.title.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(dokumen.lists);
    }
  }, [search]);

  const loadMore = () => {
    if (dokumen.length !== 0) {
      if (dokumen.lists.length % 10 === 0) {
        setPage(page + 10);
      }
    }
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getDocument({ token: token, page: page, type: type.key }));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, page, type]);

  const { device } = useSelector((state) => state.apps);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading === true ? <Loading /> : null}
      <>
        <View style={{ marginBottom: 20, flex: 1 }}>
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
                backgroundColor: "white",
                borderRadius: 20,
                width: device === "tablet" ? 40 : 28,
                height: device === "tablet" ? 40 : 28,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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
                  fontSize: fontSizeResponsive("H3", device),
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Dokumen
              </Text>
            </View>
          </View>
          <View
            style={{ width: "90%", marginHorizontal: "5%", marginVertical: 20 }}
          >
            <Search
              placeholder={"Cari"}
              onSearch={filter}
              iconColor={COLORS.primary}
            />
            {/* <View style={{ marginTop: 20 }}>
              <Dropdown
                data={dropdownFilter}
                placeHolder={"Filter"}
                backgroundColor={COLORS.white}
                selected={type}
                setSelected={setType}
              />
            </View> */}
          </View>

          <View
            style={{
              paddingVertical: 10,
              flexDirection: "row",
              marginHorizontal: "5%",
              gap: 7,
            }}
          >
            <TouchableOpacity
              style={{
                width: device === "tablet" ? "19%" : null,
                paddingHorizontal: 6,
                paddingVertical: 6,
                borderWidth: 1,
                backgroundColor:
                  type.value === "Draft" ? COLORS.primary : COLORS.input,
                borderRadius: 30,
                borderColor:
                  type.value === "Draft" ? null : COLORS.ExtraDivinder,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                setType({
                  key: "false",
                  value: "Draft",
                })
              }
            >
              <Text
                style={{
                  color:
                    type.value === "Draft" ? COLORS.white : COLORS.foundation,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Draft
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: device === "tablet" ? "19%" : null,
                paddingHorizontal: 6,
                paddingVertical: 6,
                borderWidth: 1,
                backgroundColor:
                  type.value === "Published" ? COLORS.primary : COLORS.input,
                borderRadius: 30,
                borderColor:
                  type.value === "Published" ? null : COLORS.ExtraDivinder,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                setType({
                  key: "true",
                  value: "Published",
                })
              }
            >
              <Text
                style={{
                  color:
                    type.value === "Published"
                      ? COLORS.white
                      : COLORS.foundation,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Published
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: device === "tablet" ? "19%" : null,
                paddingHorizontal: 6,
                paddingVertical: 6,
                borderWidth: 1,
                backgroundColor:
                  type.value === "revision" ? COLORS.primary : COLORS.input,
                borderRadius: 30,
                borderColor:
                  type.value === "revision" ? null : COLORS.ExtraDivinder,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                setType({
                  key: "true",
                  value: "revision",
                })
              }
            >
              <Text
                style={{
                  color:
                    type.value === "revision"
                      ? COLORS.white
                      : COLORS.foundation,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Revisi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: device === "tablet" ? "19%" : null,
                paddingHorizontal: 6,
                paddingVertical: 6,
                borderWidth: 1,
                backgroundColor:
                  type.value === "review" ? COLORS.primary : COLORS.input,
                borderRadius: 30,
                borderColor:
                  type.value === "review" ? null : COLORS.ExtraDivinder,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                setType({
                  key: "true",
                  value: "review",
                })
              }
            >
              <Text
                style={{
                  color:
                    type.value === "review" ? COLORS.white : COLORS.foundation,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Sedang Ditinjau
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <FlatList
              key={"_"}
              data={filterData}
              renderItem={({ item }) => (
                <DataList
                  bottomSheetAttach={bottomSheetAttach}
                  item={item}
                  token={token}
                  device={device}
                  tipe={type.value}
                />
              )}
              ListFooterComponent={() =>
                load === true ? (
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
              keyExtractor={(item) => "_" + item.id}
              style={{
                height: device === "tablet" ? "79%" : "67%",
              }}
              ListEmptyComponent={() => <ListEmpty />}
              onEndReached={() => {
                if (dokumen.lists.length !== 0) {
                  search === "" ? loadMore() : null;
                }
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
            {/* <Portal>
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
                    <View style={{ marginVertical: 20 }}>
                      <View
                        style={{
                          marginLeft: 30,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Ionicons
                          name="document-outline"
                          size={32}
                          color={COLORS.primary}
                        />
                        <Text
                          style={{
                            fontSize: FONTSIZE.H2,
                            fontWeight: FONTWEIGHT.normal,
                            width: 300,
                          }}
                        >
                          {dataM.title}
                        </Text>
                      </View>
                      <View style={{ marginTop: 20 }}>
                        <Divider bold />
                      </View>
                      <TouchableOpacity>
                        <View
                          style={{
                            marginLeft: 30,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            marginTop: 20,
                          }}
                        >
                          <Ionicons
                            name="download-outline"
                            size={32}
                            color={"#6B7280"}
                          />
                          <Text
                            style={{
                              fontSize: FONTSIZE.H2,
                              fontWeight: FONTWEIGHT.normal,
                            }}
                          >
                            Download
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {type.key === "true" ? (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("MainDetailRepo");
                            bottomSheetAttachClose();
                          }}
                        >
                          <View
                            style={{
                              marginLeft: 30,
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 10,
                              marginTop: 20,
                            }}
                          >
                            <Ionicons
                              name="information-circle-outline"
                              size={32}
                              color={"#6B7280"}
                            />
                            <Text
                              style={{
                                fontSize: FONTSIZE.H2,
                                fontWeight: FONTWEIGHT.normal,
                              }}
                            >
                              Details & activity
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>
              </BottomSheetModalProvider>
            </Portal> */}
          </View>
        </View>

        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: COLORS.primary,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
            position: "absolute",
            bottom: 30,
            right: 20,
            flex: 1,
          }}
          onPress={() => {
            navigation.navigate("BerbagiDokumen", {
              data: null,
              type: "tambah",
            });
          }}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    flexDirection: "column",
    width: "90%",
    marginLeft: 20,
    borderRadius: 16,
  },
  profile: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    left: 16,
  },
  cardApps: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  cardNo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
    marginBottom: 10,
  },
  circleList: {
    width: 35,
    height: 35,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
