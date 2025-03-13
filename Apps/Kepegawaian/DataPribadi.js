import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getTokenValue } from "../../service/session";
import {
  getDataIPASN,
  getDataPribadi,
  getDivisionFilter,
  getSubDivisionFilter,
} from "../../service/api";
import { CardListDataIPASN } from "../../components/CardListDataIPASN";
import ListEmpty from "../../components/ListEmpty";
import { Loading } from "../../components/Loading";
import { CardListDataPribadi } from "../../components/CardListDataPribadi";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Portal } from "react-native-portalize";
import { Dropdown } from "../../components/DropDown";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const DataPribadi = () => {
  const { device } = useSelector((state) => state.apps);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(10);
  const [filterUnker, setFilterUnker] = useState();
  const [filterSatker, setFilterSatker] = useState();
  const { profile } = useSelector((state) => state.superApps);
  const { filter } = useSelector((state) => state.repository);

  useEffect(() => {
    if (filterUnker && filterUnker.key) {
      dispatch(getSubDivisionFilter({ token: token, id: filterUnker.key }));
    }
  }, [filterUnker]);

  const roleOperator = ["OP_KEPEGAWAIAN"];
  const isRoleOperator = profile?.roles_access?.some((item) =>
    roleOperator.includes(item)
  );

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    const unker = filterUnker ? filterUnker.value : "";
    const satker = filterSatker ? filterSatker.value : "";
    if (token) {
      dispatch(
        getDataPribadi({
          token,
          page,
          search,
          unker,
          satker,
        })
      );
    }
  }, [token, page, search, filterSatker, filterUnker]);

  const { DataPribadi, loading } = useSelector((state) => state.kepegawaian);

  const loadMore = () => {
    if (DataPribadi.lists.length % 10 === 0) {
      //   if (DataIPASN.lists.length > page) {
      setPage(page + 10);
      //   }
    }
  };

  const filterSearch = () => {
    setSearch(inputValue);
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const bottomSheetModalFilterRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttachFilter = (item) => {
    bottomSheetModalFilterRef.current?.present();
  };

  const bottomSheetAttachFilterClose = () => {
    if (bottomSheetModalFilterRef.current)
      bottomSheetModalFilterRef.current?.close();
  };

  const unker = () => {
    let judulUnker = [];
    filter.unker.map((item) => {
      judulUnker.push({
        key: item.id,
        value: item.name,
      });
    });
    return judulUnker;
  };

  const satker = () => {
    let judulSatker = [];
    filter.satker.map((item) => {
      judulSatker.push({
        key: item.id,
        value: item.name,
      });
    });
    return judulSatker;
  };

  return (
    <GestureHandlerRootView>
      {loading ? <Loading /> : null}
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
          <TouchableOpacity onPress={() => navigation.navigate("Main")}>
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
              color: "white",
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
            }}
          >
            Data Pribadi
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 5,
          marginTop: 20,
          marginHorizontal: 20,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderWidth: 1,
            borderColor: COLORS.ExtraDivinder,
            borderRadius: 8,
            backgroundColor: COLORS.white,
            width:
              device === "tablet" && orientation === "landscape"
                ? "91.5%"
                : device === "tablet" && orientation === "potrait"
                ? "90%"
                : "85%",
          }}
        >
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
            onEndEditing={filterSearch}
            clearButtonMode="always"
            allowFontScaling={false}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            bottomSheetAttachFilter();
            dispatch(getDivisionFilter({ token: token }));
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 30,
              backgroundColor: COLORS.white,
              justifyContent: "center",
              alignItems: "center",
              borderColor: COLORS.secondaryLighter,
              // borderWidth: isFiltered ? 1 : 0,
            }}
          >
            <Ionicons name="filter-outline" size={24} />
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={DataPribadi.lists}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <View key={item.id}>
            <CardListDataPribadi
              item={item}
              token={token}
              device={device}
              isRoleOperator={isRoleOperator}
            />
          </View>
        )}
        ListEmptyComponent={() => <ListEmpty />}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        onEndReached={loadMore}
        style={{ height: "75%", marginHorizontal: 20 }}
      />

      <BottomSheetModalProvider>
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
            <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
          )}
        >
          <BottomSheetView onLayout={handleContentLayout}>
            <View style={{ marginVertical: 20 }}>
              <View
                style={{
                  marginHorizontal: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  borderBottomWidth: 2,
                  borderBottomColor: COLORS.grey,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Filter Satuan dan Unit Kerja
                </Text>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    bottomSheetAttachFilterClose();
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color={COLORS.lighter}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                <Text
                  style={{
                    marginHorizontal: 10,
                    marginBottom: 10,
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Unit Kerja
                </Text>
                <Dropdown
                  search={true}
                  data={unker()}
                  placeHolder={"Pilih Unit Kerja"}
                  backgroundColor={COLORS.white}
                  selected={filterUnker}
                  setSelected={setFilterUnker}
                  borderWidth={1}
                  borderWidthValue={1}
                  borderwidthDrop={1}
                  borderColor={COLORS.ExtraDivinder}
                  borderColorValue={COLORS.ExtraDivinder}
                  borderColorDrop={COLORS.ExtraDivinder}
                />
              </View>

              <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                <Text
                  style={{
                    marginHorizontal: 10,
                    marginBottom: 10,
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Satuan Kerja
                </Text>
                {filterUnker && filterUnker.key ? (
                  <Dropdown
                    data={satker()}
                    search={true}
                    placeHolder={"Pilih Satuan Kerja"}
                    backgroundColor={COLORS.white}
                    selected={filterSatker}
                    setSelected={setFilterSatker}
                    borderWidth={1}
                    borderWidthValue={1}
                    borderwidthDrop={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    heightValue={300}
                  />
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 10,
                      marginBottom: 10,
                      gap: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.infoDanger,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      *
                    </Text>
                    <Text
                      style={{
                        color: COLORS.lighter,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Daftar satuan kerja akan muncul setelah memilih unit kerja
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={{
                  marginHorizontal: 20,
                  marginVertical: 20,
                  backgroundColor: COLORS.danger,
                  padding: 10,
                  alignItems: "center",
                  borderRadius: 8,
                }}
                onPress={() => {
                  setFilterSatker("");
                  setFilterUnker("");
                  bottomSheetAttachFilterClose();
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
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
