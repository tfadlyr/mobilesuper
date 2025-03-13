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
import { getDocument, getDocumentDibagikan } from "../../service/api";
import { getDetailDocument } from "../../service/api";
import moment from "moment/min/moment-with-locales";
import { ActivityIndicator } from "react-native";
import { Dropdown } from "../../components/DropDown";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";

const DataList = ({ token, item, bottomSheetAttach, device }) => {
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
            <TouchableOpacity
              onPress={() => {
                // bottomSheetAttach(item);
                navigation.navigate("DetailTinjauan", item.id);
                getDetailRepo(item.id);
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
                  {moment(item.created_at).locale("id").format("DD MMMM yyyy")}
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
                  {moment(item.updated_at).locale("id").format("DD MMMM yyyy")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};

export const Tinjauan = () => {
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
        getDocumentDibagikan({
          token: token,
          page: page,
          tipe: "review",
        })
      );
    }
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

  const { dibagikan, loading, load } = useSelector((state) => state.repository);

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(dibagikan.lists);
  }, [dibagikan]);

  useEffect(() => {
    if (search !== "") {
      const data = dibagikan.lists.filter((item) => {
        return item.title.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(dibagikan.lists);
    }
  }, [search]);

  const loadMore = () => {
    if (dibagikan.length !== 0) {
      if (dibagikan.lists.length % 10 === 0) {
        setPage(page + 10);
      }
    }
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(
          getDocumentDibagikan({
            token: token,
            page: page,
            tipe: "review",
          })
        );
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
                Tinjauan
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
                if (dibagikan.lists.length !== 0) {
                  search === "" ? loadMore() : null;
                }
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        </View>
      </>
    </GestureHandlerRootView>
  );
};
