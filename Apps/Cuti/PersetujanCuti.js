import React, { useEffect } from "react";
import { useState } from "react";
import { BackHandler, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../../components/Search";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { getDetailArsipCuti, getDokumenPersetujuan } from "../../service/api";
import { CardListDokumenDisetujui } from "../../components/CardListDokumenDisetujui";
import {
  CardListDokumenTidakDisetujui,
  ListDokumenTidakDisetujui,
} from "../../components/CardListDokumenTidakDisetujui";
import { CardListDokumenDikembalikan } from "../../components/CardDokumenDikembalikan";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";
import { CardListDokumenPerluDisetujui } from "../../components/CardListDokumenPerluDisetujui";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getTokenValue } from "../../service/session";

export const PersetujanCuti = () => {
  const navigation = useNavigation();
  const [variant, SetVariant] = useState("On Progress");
  const [page, setPage] = useState(10);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.superApps);

  const [token, setToken] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(
        getDokumenPersetujuan({ token: token, variant: variant, page: page })
      );
    }
  }, [token, variant, page]);

  const { persetujuan, loading } = useSelector((state) => state.cuti);

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(persetujuan.lists.data);
  }, [persetujuan, token]);

  useEffect(() => {
    if (search !== "") {
      const data = persetujuan.lists?.data.filter((item) => {
        return item.jenis_cuti.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(persetujuan.lists?.data);
    }
  }, [search]);

  const [ascending, setAscending] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const asc = () => {
    const sortedAscending = filterData
      .slice()
      .sort((a, b) => a.jenis_cuti.localeCompare(b.jenis_cuti));
    setFilterData(sortedAscending);
    setAscending(true);
    setIsFiltered(true);
  };

  const desc = () => {
    const sortedDescending = filterData
      .slice()
      .sort((a, b) => b.jenis_cuti.localeCompare(a.jenis_cuti));
    setFilterData(sortedDescending);
    setAscending(false);
    setIsFiltered(true);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(
          getDokumenPersetujuan({ token: token, variant: variant, page: page })
        );
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, variant, page]);

  const { device } = useSelector((state) => state.apps);

  const loadMore = () => {
    if (filterData.length !== 0) {
      if (filterData.length % 5 === 0) {
        setPage(page + 10);
      }
    }
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Home"); // Navigasi langsung ke Home
      return true; // Mencegah aksi back default Android
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? <Loading /> : null}
      <View style={{ position: "relative", flex: 1 }}>
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
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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
                fontWeight: FONTWEIGHT.bold,
                color: COLORS.white,
              }}
            >
              Cuti
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
            <TouchableOpacity onPress={() => navigation.navigate("Libur")}>
              <Ionicons
                name="calendar-outline"
                size={device === "tablet" ? 25 : 18}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            paddingVertical: PADDING.Page,
            marginHorizontal: "5%",
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ width: device === "tablet" ? "90%" : "85%" }}>
              <Search
                placeholder={"Cari"}
                iconColor={COLORS.primary}
                onSearch={filter}
              />
            </View>
            <TouchableOpacity onPress={!ascending ? asc : desc}>
              <View
                style={{
                  width: device === "tablet" ? 50 : 40,
                  height: device === "tablet" ? 50 : 40,
                  borderRadius: 30,
                  backgroundColor: COLORS.white,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: COLORS.secondaryLighter,
                  borderWidth: isFiltered ? 1 : 0,
                }}
              >
                <Ionicons name="filter-outline" size={24} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            {/* <View
              style={{
                backgroundColor: "white",
                marginTop: 10,
                borderRadius: 8,
              }}
            > */}
            <View
              style={{
                paddingVertical: 10,
                marginTop: 10,
                borderRadius: 8,
                paddingHorizontal: 10,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                backgroundColor: COLORS.white,
                gap: 5,
              }}
            >
              {/* On Progress */}
              <TouchableOpacity
                style={{
                  width: "48%",
                  borderColor:
                    variant === "On Progress"
                      ? COLORS.info
                      : COLORS.ExtraDivinder,
                  borderWidth: 2,
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 10,
                }}
                onPress={() => SetVariant("On Progress")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.info,
                      borderRadius: device === "tablet" ? 40 : 20,
                      width: device === "tablet" ? 42 : 28,
                      height: device === "tablet" ? 42 : 28,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={device === "tablet" ? 27 : 18}
                      color={COLORS.white}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    {persetujuan?.lists?.badge?.on_progress}
                  </Text>
                </View>
                <Text
                  style={{
                    color:
                      variant === "On Progress" ? COLORS.info : COLORS.grey,
                    fontSize: device === "tablet" ? 20 : 12,
                    marginTop: 5,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Butuh Persetujuan
                </Text>
              </TouchableOpacity>

              {/* Completed */}
              <TouchableOpacity
                style={{
                  width: "48%",
                  borderColor:
                    variant === "Completed"
                      ? COLORS.success
                      : COLORS.ExtraDivinder,
                  borderWidth: 2,
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 10,
                }}
                onPress={() => SetVariant("Completed")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.success,
                      borderRadius: device === "tablet" ? 40 : 20,
                      width: device === "tablet" ? 42 : 28,
                      height: device === "tablet" ? 42 : 28,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={device === "tablet" ? 27 : 18}
                      color={COLORS.white}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    {persetujuan?.lists?.badge?.completed}
                  </Text>
                </View>
                <Text
                  style={{
                    color:
                      variant === "Completed" ? COLORS.success : COLORS.grey,
                    fontSize: device === "tablet" ? 20 : 12,
                    marginTop: 5,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Disetujui Anda
                </Text>
              </TouchableOpacity>

              {/* Rejected */}
              <TouchableOpacity
                style={{
                  width: "48%",
                  borderColor:
                    variant === "Rejected"
                      ? COLORS.infoDangerLight
                      : COLORS.ExtraDivinder,
                  borderWidth: 2,
                  borderRadius: 8,
                  padding: 10,
                }}
                onPress={() => SetVariant("Rejected")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.danger,
                      borderRadius: device === "tablet" ? 40 : 20,
                      width: device === "tablet" ? 42 : 28,
                      height: device === "tablet" ? 42 : 28,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={device === "tablet" ? 27 : 18}
                      color={COLORS.white}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    {persetujuan?.lists?.badge?.rejected}
                  </Text>
                </View>
                <Text
                  style={{
                    color:
                      variant === "Rejected" ? COLORS.infoDanger : COLORS.grey,
                    fontSize: device === "tablet" ? 20 : 12,
                    marginTop: 5,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Tidak Disetujui Anda
                </Text>
              </TouchableOpacity>

              {/* Returned */}
              <TouchableOpacity
                style={{
                  width: "48%",
                  borderColor:
                    variant === "Returned"
                      ? COLORS.orange
                      : COLORS.ExtraDivinder,
                  borderWidth: 2,
                  borderRadius: 8,
                  padding: 10,
                }}
                onPress={() => SetVariant("Returned")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.orange,
                      borderRadius: device === "tablet" ? 40 : 20,
                      width: device === "tablet" ? 42 : 28,
                      height: device === "tablet" ? 42 : 28,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={device === "tablet" ? 27 : 18}
                      color={COLORS.white}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: FONTWEIGHT.bold,
                      marginTop: 5,
                    }}
                  >
                    {persetujuan?.lists?.badge?.returned}
                  </Text>
                </View>
                <Text
                  style={{
                    color: variant === "Returned" ? COLORS.orange : COLORS.grey,
                    fontSize: device === "tablet" ? 20 : 12,
                    marginTop: 5,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Dikembalikan Anda
                </Text>
              </TouchableOpacity>
            </View>

            {/* </View> */}
            <View style={{ flex: 1 }}>
              {variant === "Completed" ? (
                <FlatList
                  data={filterData}
                  renderItem={({ item }) => (
                    <View key={item.id}>
                      <CardListDokumenDisetujui
                        item={item}
                        variant={variant}
                        device={device}
                        token={token}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  onEndReached={loadMore}
                  ListEmptyComponent={() => <ListEmpty />}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
              ) : variant === "Rejected" ? (
                <FlatList
                  data={filterData}
                  renderItem={({ item }) => (
                    <View key={item.id}>
                      <CardListDokumenTidakDisetujui
                        item={item}
                        token={token}
                        variant={variant}
                        device={device}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  onEndReached={loadMore}
                  ListEmptyComponent={() => <ListEmpty />}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  style={{ height: "70%" }}
                />
              ) : variant === "Returned" ? (
                <FlatList
                  data={filterData}
                  renderItem={({ item }) => (
                    <View key={item.id}>
                      <CardListDokumenDikembalikan
                        item={item}
                        token={token}
                        variant={variant}
                        device={device}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  onEndReached={loadMore}
                  ListEmptyComponent={() => <ListEmpty />}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  style={{ height: "70%" }}
                />
              ) : variant === "On Progress" ? (
                <FlatList
                  data={filterData}
                  renderItem={({ item }) => (
                    <View key={item.id}>
                      <CardListDokumenPerluDisetujui
                        item={item}
                        token={token}
                        variant={variant}
                        device={device}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  onEndReached={loadMore}
                  ListEmptyComponent={() => <ListEmpty />}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  style={{ height: "70%" }}
                />
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};
