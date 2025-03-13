import React, { useMemo, useRef } from "react";
import {
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Dropdown } from "../../components/DropDown";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEventDetail, setEventLists } from "../../store/Event";
import { useEffect } from "react";
import { FlatList } from "react-native";
import { Image } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { Search } from "../../components/Search";
import ListEmpty from "../../components/ListEmpty";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  getEvent,
  getEventDetail,
  getEventFilter,
  getEventProgress,
  getEventToday,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import { CardListEvent } from "../../components/CardListEvent";
import { CardProgresEvent } from "../../components/CardProgresEvent";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { Loading } from "../../components/Loading";
import { TextInput } from "react-native";

const kategories = [
  { key: "q", value: "satu" },
  { key: "e", value: "dua" },
  { key: "r", value: "tiga" },
  { key: "t", value: "empat" },
];

const tahun = new Date().getFullYear();
const bulan = new Date().getMonth();
const tanggal = new Date().getDate();

const tanggalSekarang = new Date(`${tahun}-${bulan}-${tanggal}`).toDateString();
const tanggalBesok = new Date(
  `${tahun}-${bulan}-${tanggal + 1}`
).toDateString();

const CardTodoEvent = ({ item, device }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          backgroundColor: COLORS.white,
          width: 358,
          padding: 20,
          marginBottom: 10,
          borderRadius: 8,
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {item.judul}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginVertical: 10,
          }}
        >
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            PIC
          </Text>
          <Image
            source={item.pic}
            style={{ width: 26, height: 26, borderRadius: 30 }}
          />
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item.nama}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="calendar-outline" size={24} />
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              {item.tanggal}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="time-outline" size={24} />
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {item.progres}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const CardEventFilter = ({ item, token, device }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState({
    toggle: false,
  });

  const children = item.children;

  const handleCollapse = () => {
    collapse.toggle
      ? setCollapse({ toggle: false })
      : setCollapse({ toggle: true });
  };

  const getDetail = (id) => {
    const params = { token, id };
    dispatch(getEventDetail(params));
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.primary,
          paddingHorizontal: 15,
          paddingVertical: 5,
          borderRadius: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
        onPress={handleCollapse}
      >
        <Text
          style={{
            fontSize: fontSizeResponsive("H2", device),
            color: COLORS.white,
          }}
        >
          {item.date}
        </Text>
        {collapse.toggle === true ? (
          <Ionicons
            name="chevron-up"
            size={device === "tablet" ? 40 : 24}
            color={COLORS.white}
          />
        ) : (
          <Ionicons
            name="chevron-down"
            size={device === "tablet" ? 40 : 24}
            color={COLORS.white}
          />
        )}
      </TouchableOpacity>
      {collapse.toggle ? (
        <View style={{ marginBottom: 10 }}>
          {children.map((data) => (
            <TouchableOpacity
              onPress={() => {
                getDetail(data.id);
                navigation.navigate("MainDetailEvent");
              }}
              key={data.id}
              style={{
                backgroundColor: COLORS.white,
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
                marginVertical: 5,
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 8,
                rowGap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                  fontWeight: FONTWEIGHT.bold,
                }}
              >
                {data.title}
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {data.pic.department}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    color: COLORS.lighter,
                  }}
                >
                  {data.user_role.is_member
                    ? "Peserta"
                    : data.user_role.is_notulensi
                    ? "Notulen"
                    : data.user_role.is_pic
                    ? "PIC"
                    : data.user_role.is_presensi
                    ? "Presensi"
                    : "Pembuat"}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      color: COLORS.lighter,
                    }}
                  >
                    Status
                  </Text>
                  <View
                    style={{
                      borderRadius: device === "tablet" ? 28 : 14,
                      paddingVertical: "1%",
                      paddingHorizontal: "5%",
                      backgroundColor: COLORS.infoLight,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        color: COLORS.info,
                        textTransform: "capitalize",
                      }}
                    >
                      {data.status}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export const HalamanUtama = () => {
  const navigation = useNavigation();
  const [kategori, setKategori] = useState("");
  const [progres, setProgres] = useState([]);
  const [token, setToken] = useState("");
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // useEffect(() => {
  //     dispatch(setEventLists(listsEvent))
  // }, [])

  const [inputValue, setInputValue] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getEventToday(token));
      dispatch(getEventProgress(token));
    }
  }, [token]);

  useEffect(() => {
    if (token !== "") {
      dispatch(
        getEventFilter({
          token: token,
          status: statusFilter,
          search: searchFilter,
        })
      );
    }
  }, [token, searchFilter, statusFilter]);

  const { event, loading, eventFilter } = useSelector((state) => state.event);
  const list = event.lists;
  const progreslist = event.listsprogress;
  // const [loading, setLoading] = useState(true)

  const [variant, SetVariant] = useState("hariini");

  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalAddRef = useRef(null);
  const bottomSheetModalFilterRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT", "50%", "90%"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = (data) => {
    setProgres(data);
    bottomSheetModalRef.current?.present();
  };

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const bottomSheetAttachAdd = () => {
    bottomSheetModalAddRef.current?.present();
  };

  const bottomSheetAttachAddClose = () => {
    if (bottomSheetModalAddRef.current) bottomSheetModalAddRef.current?.close();
  };

  const bottomSheetAttachFilter = () => {
    bottomSheetModalFilterRef.current?.present();
  };

  const bottomSheetAttachFilterClose = () => {
    if (bottomSheetModalFilterRef.current)
      bottomSheetModalFilterRef.current?.close();
  };

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState(event.listsprogress);
  const [ascending, setAscending] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    const item = event.listsprogress;
    if (search !== "") {
      const data = event?.listsprogress?.filter((item) => {
        return item.title.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(item);
    }
  }, [search, isFiltered]);

  const asc = () => {
    const sortedAscending = filterData
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title));
    setFilterData(sortedAscending);
    setAscending(true);
    setIsFiltered(true);
  };

  const desc = () => {
    const sortedDescending = filterData
      .slice()
      .sort((a, b) => b.title.localeCompare(a.title));
    setFilterData(sortedDescending);
    setAscending(false);
    setIsFiltered(true);
  };

  const filter = (event) => {
    setSearch(event);
  };

  const [filterDataHariIni, setFilterDataHariIni] = useState(list);

  useEffect(() => {
    const item = event.lists;
    if (search !== "") {
      const data = item.filter((item) => {
        return item.judul.toLowerCase().includes(search.toLowerCase());
      });
      setFilterDataHariIni(data);
    } else {
      setFilterDataHariIni(item);
    }
  }, [search]);

  const filterHariIni = (event) => {
    setSearch(event);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        if (variant === "hariini") {
          dispatch(getEventToday(token));
        } else {
          dispatch(getEventProgress(token));
        }
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token]);

  const handleSearchFilter = () => {
    setSearchFilter(inputValue);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const { device } = useSelector((state) => state.apps);

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
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
                Agenda Rapat
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
              paddingHorizontal: "5%",
              flexDirection: "row",
              alignItems: "center",
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
              }}
            >
              {variant === "hariini" ? (
                <Search
                  placeholder={"Cari"}
                  onSearch={filterHariIni}
                  iconColor={COLORS.primary}
                />
              ) : (
                <Search
                  placeholder={"Cari"}
                  onSearch={filter}
                  iconColor={COLORS.primary}
                />
              )}
            </View>
            <TouchableOpacity onPress={bottomSheetAttachFilter}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 30,
                  backgroundColor: COLORS.white,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: COLORS.secondaryLighter,
                }}
              >
                <Ionicons name="filter-outline" size={24} />
              </View>
            </TouchableOpacity>
          </View>

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
              <View
                style={{
                  paddingVertical: 20,
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.ExtraDivinder,
                  }}
                >
                  <View style={{ marginHorizontal: "5%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          width: "85%",
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
                            onEndEditing={handleSearchFilter}
                            clearButtonMode="always"
                            allowFontScaling={false}
                          />
                        </View>
                      </View>
                      <View style={{ width: "15%", alignItems: "center" }}>
                        <TouchableOpacity
                          onPress={bottomSheetAttachFilterClose}
                        >
                          <Text
                            style={{
                              color: COLORS.danger,
                              fontSize: fontSizeResponsive("H2", device),
                            }}
                          >
                            Batal
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        paddingVertical: 20,
                        gap: 10,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          borderRadius: device === "tablet" ? 28 : 14,
                          paddingVertical: "1%",
                          paddingHorizontal: "3%",
                          borderColor:
                            statusFilter === ""
                              ? COLORS.infoDangerLight
                              : COLORS.ExtraDivinder,
                          backgroundColor:
                            statusFilter === ""
                              ? COLORS.infoDangerLight
                              : COLORS.white,
                        }}
                        onPress={() => handleStatusFilter("")}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H3", device),
                            color: COLORS.primary,
                          }}
                        >
                          Semua
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          borderRadius: device === "tablet" ? 28 : 14,
                          paddingVertical: "1%",
                          paddingHorizontal: "3%",
                          borderColor:
                            statusFilter === "persiapan"
                              ? COLORS.infoDangerLight
                              : COLORS.ExtraDivinder,
                          backgroundColor:
                            statusFilter === "persiapan"
                              ? COLORS.infoDangerLight
                              : COLORS.white,
                        }}
                        onPress={() => handleStatusFilter("persiapan")}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H3", device),
                            color: COLORS.primary,
                          }}
                        >
                          Persiapan
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          borderRadius: device === "tablet" ? 28 : 14,
                          paddingVertical: "1%",
                          paddingHorizontal: "3%",
                          borderColor:
                            statusFilter === "pelaksanaan"
                              ? COLORS.infoDangerLight
                              : COLORS.ExtraDivinder,
                          backgroundColor:
                            statusFilter === "pelaksanaan"
                              ? COLORS.infoDangerLight
                              : COLORS.white,
                        }}
                        onPress={() => handleStatusFilter("pelaksanaan")}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H3", device),
                            color: COLORS.primary,
                          }}
                        >
                          Pelaksanaan
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          borderRadius: device === "tablet" ? 28 : 14,
                          paddingVertical: "1%",
                          paddingHorizontal: "3%",
                          borderColor:
                            statusFilter === "paska"
                              ? COLORS.infoDangerLight
                              : COLORS.ExtraDivinder,
                          backgroundColor:
                            statusFilter === "paska"
                              ? COLORS.infoDangerLight
                              : COLORS.white,
                        }}
                        onPress={() => handleStatusFilter("paska")}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H3", device),
                            color: COLORS.primary,
                          }}
                        >
                          Paska
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    marginHorizontal: "5%",
                    marginTop: 20,
                  }}
                >
                  <FlatList
                    data={eventFilter.list}
                    renderItem={({ item }) => (
                      <CardEventFilter
                        item={item}
                        token={token}
                        device={device}
                      />
                    )}
                    // keyExtractor={(item) => item.id}
                    ListEmptyComponent={() => <ListEmpty />}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                  />
                </View>
              </View>
            </BottomSheetView>
          </BottomSheetModal>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              // gap: 10,
              marginTop: 20,
              width: "90%",
              marginHorizontal: "5%",
            }}
          >
            <TouchableOpacity
              style={{
                width: "48%",
                paddingVertical: 10,
                borderWidth: 1,
                backgroundColor:
                  variant === "hariini" ? COLORS.primary : COLORS.white,
                borderRadius: 8,
                borderColor:
                  variant === "hariini" ? COLORS.white : COLORS.white,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => SetVariant("hariini")}
            >
              <Text
                style={{
                  color: variant === "hariini" ? COLORS.white : COLORS.primary,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Agenda Rapat Hari Ini
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "48%",
                paddingVertical: 10,
                borderWidth: 1,
                backgroundColor:
                  variant === "progres" ? COLORS.primary : COLORS.white,
                borderRadius: 8,
                borderColor:
                  variant === "progres" ? COLORS.white : COLORS.white,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => SetVariant("progres")}
            >
              <Text
                style={{
                  color: variant === "progres" ? COLORS.white : COLORS.primary,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Progres Agenda Rapat
              </Text>
            </TouchableOpacity>
          </View>
          {variant === "hariini" ? (
            <>
              {loading ? <Loading /> : null}
              <View style={{ flex: 1 }}>
                <FlatList
                  data={filterDataHariIni}
                  renderItem={({ item }) => (
                    <CardListEvent
                      token={token}
                      item={item}
                      loading={loading}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={() => <ListEmpty />}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
              </View>
            </>
          ) : (
            <View style={{ flex: 1 }}>
              {loading ? <Loading /> : null}
              <View
                style={{
                  paddingVertical: 25,
                  paddingHorizontal: "5%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.lighter,
                      fontSize: fontSizeResponsive("H2", device),
                    }}
                  >
                    Event
                  </Text>

                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <TouchableOpacity onPress={!ascending ? asc : desc}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 30,
                          backgroundColor: COLORS.white,
                          justifyContent: "center",
                          alignItems: "center",
                          borderColor: COLORS.secondaryLighter,
                        }}
                      >
                        <Ionicons name="funnel-outline" size={24} />
                      </View>
                    </TouchableOpacity>

                    {/* <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 30,
                        backgroundColor: COLORS.white,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons name="menu-outline" size={24} />
                    </View> */}
                  </View>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <FlatList
                  data={
                    search === "" && !isFiltered
                      ? event.listsprogress
                      : filterData
                  }
                  // data={event.listsprogress}
                  renderItem={({ item }) => (
                    <CardProgresEvent
                      token={token}
                      item={item}
                      bottomSheetAttach={bottomSheetAttach}
                      loading={loading}
                      device={device}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={() => <ListEmpty />}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
              </View>
            </View>
          )}

          {/* <TouchableOpacity style={{
            width: 50,
            height: 50,
            backgroundColor: COLORS.infoDanger,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 100,
            right: 20
          }}
            onPress={() => {
              navigation.navigate("TambahEvent");
            }}
          >
            <Ionicons name="add-outline" size={24} color={COLORS.white} />
          </TouchableOpacity> */}

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
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 331,
                    height: 50,
                    backgroundColor: COLORS.infoDanger,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  onPress={() => {
                    navigation.navigate("TambahEvent");
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Tambah Event
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: 331,
                    height: 50,
                    backgroundColor: COLORS.infoDanger,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  onPress={() => {
                    navigation.navigate("TambahAgendaEvent");
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Tambah Agenda
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: 331,
                    height: 50,
                    backgroundColor: COLORS.infoDanger,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 40,
                  }}
                  onPress={() => {
                    navigation.navigate("TambahTodo", { item: event.lists });
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Tambah ToDo
                  </Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>

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
              <FlatList
                data={progres}
                renderItem={({ item }) => (
                  <CardTodoEvent item={item} device={device} />
                )}
                style={{ marginBottom: 40 }}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
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
});
