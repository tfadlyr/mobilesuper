import React from "react";
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
import { getArsipCuti } from "../../service/api";
import { useEffect } from "react";
import { FlatList } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { CardListDokumenTidakDisetujui } from "../../components/CardListDokumenTidakDisetujui";
import { CardListDokumenDisetujui } from "../../components/CardListDokumenDisetujui";
import { CardListDokumenOnProgress } from "../../components/CardListDokumenOnProgress";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";
import { CardListDokumenDraft } from "../../components/CardListDokumenDraft";
import { getTokenValue } from "../../service/session";

export const DokumenCuti = () => {
  const navigation = useNavigation();
  const [variant, SetVariant] = useState("Draft");
  const dispatch = useDispatch();
  const [page, setPage] = useState(10);
  const { profile } = useSelector((state) => state.superApps);

  const [token, setToken] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getArsipCuti({ token: token, variant: variant, page: page }));
    }
  }, [token, variant, page]);
  const { arsip, loading } = useSelector((state) => state.cuti);
  const arsipLists = arsip.lists.data;

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(arsip.lists.data);
  }, [arsip]);

  useEffect(() => {
    if (search !== "") {
      const data = arsip.lists?.data.filter((item) => {
        return item.jenis_cuti.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(arsip.lists?.data);
    }
  }, [search]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getArsipCuti({ token: token, variant: variant, page: page }));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, variant, page]);

  const [ascending, setAscending] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const asc = () => {
    const sortedAscending = filterData
      .slice()
      .sort((a, b) => a.member?.nama.localeCompare(b.member?.nama));
    setFilterData(sortedAscending);
    setAscending(true);
    setIsFiltered(true);
  };

  const desc = () => {
    const sortedDescending = filterData
      .slice()
      .sort((a, b) => b.member?.nama.localeCompare(a.member?.nama));
    setFilterData(sortedDescending);
    setAscending(false);
    setIsFiltered(true);
  };

  const loadMore = () => {
    if (filterData?.length !== 0) {
      if (filterData?.length % 5 === 0) {
        setPage(page + 10);
      }
    }
  };

  const { device } = useSelector((state) => state.apps);

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
                size={device === "tablet" ? 30 : 18}
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
              alignItems: "center",
              justifyContent: "space-between",
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

          <View style={{ gap: 10, flex: 1 }}>
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
                    variant === "Draft" ? COLORS.info : COLORS.ExtraDivinder,
                  borderWidth: 2,
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 10,
                }}
                onPress={() => SetVariant("Draft")}
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
                    {arsip?.lists?.badge?.draft}
                  </Text>
                </View>
                <Text
                  style={{
                    color: variant === "Draft" ? COLORS.info : COLORS.grey,
                    fontSize: device === "tablet" ? 20 : 12,
                    marginTop: 5,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Dokumen Draft
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
                    {arsip?.lists?.badge?.completed}
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
                  Dokumen Disetujui
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
                    {arsip?.lists?.badge?.rejected}
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
                  Dokumen Ditolak
                </Text>
              </TouchableOpacity>

              {/* On Progress */}
              <TouchableOpacity
                style={{
                  width: "48%",
                  borderColor:
                    variant === "On Progress"
                      ? COLORS.orange
                      : COLORS.ExtraDivinder,
                  borderWidth: 2,
                  borderRadius: 8,
                  padding: 10,
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
                    {arsip?.lists?.badge?.on_progress}
                  </Text>
                </View>
                <Text
                  style={{
                    color:
                      variant === "On Progress" ? COLORS.orange : COLORS.grey,
                    fontSize: device === "tablet" ? 20 : 12,
                    marginTop: 5,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Dokumen Diproses
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              {variant === "Postponed" || variant === "Rejected" ? (
                <FlatList
                  data={filterData}
                  renderItem={({ item }) => (
                    <View key={item.id}>
                      <CardListDokumenTidakDisetujui
                        item={item}
                        nip={profile.nip}
                        variant={variant}
                        device={device}
                      />
                    </View>
                  )}
                  onEndReached={loadMore}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={() => <ListEmpty />}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  style={{ height: device === "tablet" ? "79%" : "70%" }}
                />
              ) : variant === "Draft" ? (
                <FlatList
                  data={filterData}
                  renderItem={({ item }) => (
                    <View key={item.id}>
                      <CardListDokumenDraft
                        item={item}
                        variant={variant}
                        token={token}
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
                  style={{
                    height: device === "tablet" ? "79%" : "70%",
                  }}
                />
              ) : variant === "On Progress" ? (
                <FlatList
                  data={filterData}
                  renderItem={({ item }) => (
                    <View key={item.id}>
                      <CardListDokumenOnProgress
                        item={item}
                        variant={variant}
                        token={token}
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
                  style={{ height: device === "tablet" ? "79%" : "70%" }}
                />
              ) : variant === "Completed" ? (
                <FlatList
                  data={filterData}
                  renderItem={({ item }) => (
                    <View key={item.id}>
                      <CardListDokumenDisetujui
                        item={item}
                        variant={variant}
                        token={token}
                        pembatalan={"pembatalan"}
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
                  style={{ height: device === "tablet" ? "79%" : "70%" }}
                />
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};
