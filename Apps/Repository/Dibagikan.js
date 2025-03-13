import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../../components/Search";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Divider } from "react-native-paper";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ListEmpty from "../../components/ListEmpty";
import { Dropdown } from "../../components/DropDown";
import { getDetailDocument, getDocumentDibagikan } from "../../service/api";
import { getTokenValue } from "../../service/session";
import moment from "moment/min/moment-with-locales";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";
import { setEdit, setRating } from "../../store/Repository";

const DataList = ({ token, item, bottomSheetAttach, device }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
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
          backgroundColor: "white",
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
                navigation.navigate("MainDetailRepo");
                getDetailRepo(item.id);
                dispatch(setRating(true));
                dispatch(setEdit(""));
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
            {/* <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
                flex: 1,
                marginRight: 20,
              }}
            >
              <Ionicons
                name="ellipsis-vertical-outline"
                size={24}
                color={COLORS.grey}
              />
            </View> */}
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

export const Dibagikan = () => {
  const [variant, setVariant] = useState("list");
  const [dataM, setDataM] = useState([]);
  const [token, setToken] = useState("");
  const [page, setPage] = useState(10);

  const dispatch = useDispatch();

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
          tipe: "done",
        })
      );
    }
  }, [token, page]);

  const handleVariant = (cekVariant) => {
    setVariant(cekVariant);
  };
  const navigation = useNavigation();

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

  const { dibagikan, loading, load } = useSelector((state) => state.repository);

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
            tipe: "done",
          })
        );
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, page]);

  const { device } = useSelector((state) => state.apps);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading === true && dibagikan.lists.length === 0 ? <Loading /> : null}
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.primary,
              height: 80,
              alignItems: "center",
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
                Dibagikan
              </Text>
            </View>
          </View>

          <View
            style={{ width: "90%", marginHorizontal: "5%", marginVertical: 20 }}
          >
            <Search placeholder={"Cari"} iconColor={COLORS.primary} />
          </View>

          {/* <View style={{ width: '90%', marginHorizontal: 20 }}>
              <Dropdown
                data={dropdownFilter}
                placeHolder={'Filter'}
                backgroundColor={COLORS.white}
                selected={type}
                setSelected={setType}
              />
            </View> */}

          <FlatList
            key={"_"}
            data={dibagikan.lists}
            renderItem={({ item }) => (
              <DataList
                bottomSheetAttach={bottomSheetAttach}
                item={item}
                token={token}
                device={device}
              />
            )}
            ListFooterComponent={() =>
              load && (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 24,
                  }}
                >
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              )
            }
            keyExtractor={(item) => "_" + item.id}
            style={{ height: device === "tablet" ? "79%" : "67%" }}
            ListEmptyComponent={() => <ListEmpty />}
            onEndReached={() => {
              if (dibagikan.lists.length !== 0) {
                loadMore();
              }
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
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
                    fontSize: fontSizeResponsive("H2", device),
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
                      fontSize: fontSizeResponsive("H2", device),
                      fontWeight: FONTWEIGHT.normal,
                    }}
                  >
                    Download
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("MainDetailRepo")}
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
                      fontSize: fontSizeResponsive("H2", device),
                      fontWeight: FONTWEIGHT.normal,
                    }}
                  >
                    Details & activity
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
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
