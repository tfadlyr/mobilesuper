import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { CardKebijakan } from "../../components/CardKebijakan/";
import {
  getCategory,
  getCategoryId,
  getCategoryIdPage,
  getDokHukum,
  getUnitKerjaTematikId,
} from "../../service/api";
import { Search } from "../../components/Search";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { Button } from "../../components/Button";
import { CardKebijakanCard } from "../../components/CardKebijkanCard";
import { useNavigation } from "@react-navigation/native";
import { Divider } from "react-native-paper";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import { ActivityIndicator } from "react-native";
import { Loading } from "../../components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "../../components/DropDown";
import { setRefresh } from "../../store/Kebijakan";
import ListEmpty from "../../components/ListEmpty";
import { event } from "react-native-reanimated";
import { TextInput } from "react-native";

export default function Dashboard(params) {
  const id = params?.route.params;
  const [open, setOpen] = useState(false);
  const [openTentang, setOpenTentang] = useState(false);
  const [openTahun, setOpenTahun] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [value, setValue] = useState();
  const [category, setCategory] = useState([]);
  const bottomSheetModalRef = useRef(null);
  const [variant, setVariant] = useState("list");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState();
  const [token, setToken] = useState("");
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  function handlePressModal() {
    bottomSheetModalRef.current?.present();
  }

  const handleVariant = (cekVariant) => {
    setVariant(cekVariant);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getCategory({ token: token, page: page }));
    }
  }, [token, page]);

  const [selectedList, setSelectedList] = useState({ key: "", value: "" });

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (token !== "") {
      dispatch(
        getDokHukum({
          token: token,
          id: selectedList.key,
          page: page,
          search: search,
        })
      );
      // dispatch(setRefresh(false));
    }
  }, [token, selectedList.key, page, search]);

  useEffect(() => {
    if (id !== undefined && !(id?.unread === false)) {
      const params = { token: token, id: id, page: page, search: search };
      dispatch(getUnitKerjaTematikId(params));
    }
  }, [token, id, page, search]);

  const { dokumen, lists, dokumenList, unitKerjaId, refresh, loading } =
    useSelector((state) => state.kebijakan);
  const [dataFilter, setFilterData] = useState([]);

  // useEffect(() => {
  //   if (refresh) {
  //     dispatch(getCategory({ token: token, page: page }));
  //   }
  // }, [refresh]);

  useEffect(() => {
    setCategory(dokumen);
    setValue(dokumen[0]?.value);
  }, [dokumen]);

  const listDokHukum = dokumen.slice(0, 34).map((item) => ({
    key: item.value,
    value: item.label,
  }));

  console.log(selectedList);

  // useEffect(() => {
  //   if (lists.count > 5) {
  //     let mdl = parseInt(lists.count / 5);
  //     const modulus = lists.count % 5;
  //     if (modulus !== 0) {
  //       mdl += 1;
  //     }
  //     setCount(mdl);
  //   } else {
  //     setCount(1);
  //   }
  // }, [page]);

  // useEffect(() => {
  //   dispatch(getCategoryId(selectedList.key));
  // }, [selectedList.key]);

  // const filterData = (search) => {
  //   const filter =
  //     lists.results?.datas.length !== 0 &&
  //     lists.results?.datas.filter((item) => {
  //       return item.subjek.toLowerCase().includes(search.toLowerCase());
  //     });
  //   setFilterData(filter);
  // };
  const [ascending, setAscending] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [viewDok, setViewDok] = useState(true);
  const switchToViewDok = () => {
    setSearch("");
    setViewDok(true);
  };
  const switchToViewTematik = () => {
    setSearch("");
    setViewDok(false);
  };

  useEffect(() => {
    setPage(5);
  }, [selectedList.key]);

  useEffect(() => {
    setFilterData(dokumenList);
  }, [dokumenList]);

  const [filterTematik, setFilterTematik] = useState([]);
  useEffect(() => {
    setFilterTematik(unitKerjaId.lists);
  }, [unitKerjaId]);

  // useEffect(() => {
  //   const item = dokumenList;
  //   if (search !== "") {
  //     const data = item.filter((item) => {
  //       return item.subjek.toLowerCase().includes(search.toLowerCase());
  //     });
  //     setFilterData(data);
  //   } else {
  //     setFilterData(item);
  //   }
  // }, [search]);

  const filterData = () => {
    setSearch(inputValue);
  };

  const asc = () => {
    const sortedAscending = viewDok
      ? dataFilter?.slice().sort((a, b) => a.nomor - b.nomor)
      : filterTematik?.slice().sort((a, b) => a.nomor - b.nomor);
    if (viewDok) {
      setFilterData(sortedAscending);
    } else {
      setFilterTematik(sortedAscending);
    }
    setAscending(true);
    setIsFiltered(true);
  };

  const desc = () => {
    const sortedDescending = viewDok
      ? dataFilter?.slice().sort((a, b) => b.nomor - a.nomor)
      : filterTematik?.slice().sort((a, b) => b.nomor - a.nomor);
    if (viewDok) {
      setFilterData(sortedDescending);
    } else {
      setFilterTematik(sortedDescending);
    }
    setAscending(false);
    setIsFiltered(true);
  };

  const loadMore = () => {
    if (dokumenList.length !== 0) {
      if (dokumenList.length % 5 === 0) {
        setPage(page + 5);
      }
    }
  };

  const loadMoreTematik = () => {
    if (unitKerjaId.lists.length !== 0) {
      if (unitKerjaId.lists?.length % 5 === 0) {
        setPage(page + 5);
      }
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(
          getDokHukum({
            token: token,
            id: selectedList.key,
            page: page,
            search: search,
          })
        );
        // dispatch(setRefresh(false));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, selectedList.key, page, search]);

  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);

  return (
    <>
      {loading ? <Loading /> : null}
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
            <TouchableOpacity
              style={{}}
              onPress={() => navigation.navigate("Home")}
            >
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
                fontWeight: 600,
                color: COLORS.white,
              }}
            >
              Dokumen Hukum
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
        >
          <View style={{ width: "90%" }}>
            <Text
              style={[
                styles.subJudul,
                { fontSize: fontSizeResponsive("H2", device) },
              ]}
            >
              Dokumen Hukum
            </Text>
          </View>
          <View style={styles.dropdown}>
            {/* <DropDownPicker
              open={open}
              value={value}
              items={category}
              setOpen={setOpen}
              setValue={setValue}
              zIndex={5000}
              searchable={true}
              searchPlaceholder="Cari Kategori"
              containerStyle={{
                height: "30%",
                width: "90%",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 18,
              }}
            /> */}
            {selectedList.key === "" ? (
              <Dropdown
                data={listDokHukum}
                setSelected={setSelectedList}
                placeHolder={"Pilih"}
                borderWidth={1}
                borderwidthDrop={1}
                borderWidthValue={1}
                borderColor={COLORS.ExtraDivinder}
                borderColorDrop={COLORS.ExtraDivinder}
                borderColorValue={COLORS.ExtraDivinder}
                heightValue={150}
                search={true}
              />
            ) : (
              <Dropdown
                data={listDokHukum}
                setSelected={setSelectedList}
                selected={selectedList}
                borderWidth={1}
                borderwidthDrop={1}
                borderWidthValue={1}
                borderColor={COLORS.ExtraDivinder}
                borderColorDrop={COLORS.ExtraDivinder}
                borderColorValue={COLORS.ExtraDivinder}
                heightValue={150}
                search={true}
              />
            )}
          </View>
          <View style={styles.ContainerCard}>
            <View
              style={{
                marginTop: 20,
                // flexDirection: "row",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {selectedList.key !== "" && selectedList.value !== "" ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      width: device === "tablet" ? "90%" : "85%",
                      backgroundColor: COLORS.white,
                      borderRadius: 8,
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
                        onEndEditing={filterData}
                        clearButtonMode="always"
                        allowFontScaling={false}
                      />
                    </View>
                  </View>
                  <View style={{}}>
                    <TouchableOpacity onPress={!ascending ? asc : desc}>
                      <View
                        style={{
                          width: device === "tablet" ? 50 : 40,
                          height: device === "tablet" ? 50 : 40,
                          borderRadius: 30,
                          backgroundColor: COLORS.white,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons name="filter-outline" size={24} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
            {id === undefined || id?.unread === false ? null : (
              <View
                style={{
                  justifyContent: "space-between",
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    borderRadius: 8,
                    paddingVertical: 10,
                    backgroundColor: viewDok ? COLORS.primary : COLORS.white,
                    paddingHorizontal: 20,
                    //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                    //shadow android
                    elevation: 2,
                    width: "48%",
                  }}
                  onPress={switchToViewDok}
                >
                  <Text
                    style={{
                      color: viewDok ? COLORS.white : COLORS.primary,
                      textAlign: "center",
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: 600,
                    }}
                  >
                    Dokumen Hukum
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderRadius: 8,
                    paddingVertical: 10,
                    backgroundColor: viewDok ? COLORS.white : COLORS.primary,
                    paddingHorizontal: 20,
                    //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                    //shadow android
                    elevation: 2,
                    width: "48%",
                  }}
                  onPress={switchToViewTematik}
                >
                  <Text
                    style={{
                      color: viewDok ? COLORS.primary : COLORS.white,
                      textAlign: "center",
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: 600,
                    }}
                  >
                    Tematik
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {/* <StatusBar style="auto" /> */}
          </View>
          {lists.results?.length === 0 ? (
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                Tidak ada
              </Text>
            </View>
          ) : (
            <View
              style={{
                height:
                  id === undefined || id?.unread === false ? "100%" : "52%",
                width: "90%",
                alignItems: "center",
                paddingHorizontal: 0,
              }}
            >
              {variant === "list" ? (
                !viewDok && id !== undefined && !(id?.unread === false) ? (
                  <FlatList
                    data={filterTematik}
                    renderItem={({ item }) => (
                      <CardKebijakan
                        subjek={item.subjek}
                        bentuk={item.bentuk}
                        id_peraturan={item.id_peraturan}
                        item={item}
                        nomor={item.nomor}
                        tahun={item.tahun}
                        device={device}
                      />
                    )}
                    style={{ width: "100%" }}
                    keyExtractor={(item) => item.id_peraturan}
                    ListFooterComponent={() =>
                      loading === true ? (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 24,
                          }}
                        >
                          <ActivityIndicator
                            size="small"
                            color={COLORS.primary}
                          />
                        </View>
                      ) : null
                    }
                    onEndReached={
                      unitKerjaId.lists?.length === 0
                        ? null
                        : id !== undefined && !(id?.unread === false)
                        ? loadMoreTematik
                        : null
                    }
                    ListEmptyComponent={<ListEmpty />}
                    refreshControl={
                      selectedList.value !== "" ? (
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                        />
                      ) : null
                    }
                  />
                ) : (
                  <FlatList
                    data={dataFilter}
                    renderItem={({ item }) => (
                      <CardKebijakan
                        subjek={item.subjek}
                        bentuk={item.bentuk}
                        id_peraturan={item.id_peraturan}
                        item={item}
                        nomor={item.nomor}
                        tahun={item.tahun}
                        device={device}
                      />
                    )}
                    style={{ width: "100%" }}
                    keyExtractor={(item) => item.id_peraturan}
                    ListFooterComponent={() =>
                      loading === true ? (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 24,
                          }}
                        >
                          <ActivityIndicator
                            size="small"
                            color={COLORS.primary}
                          />
                        </View>
                      ) : null
                    }
                    onEndReached={dokumenList?.length === 0 ? null : loadMore}
                    ListEmptyComponent={<ListEmpty />}
                    refreshControl={
                      selectedList.value !== "" ? (
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                        />
                      ) : null
                    }
                  />
                )
              ) : null}
            </View>
          )}
        </View>
      </BottomSheetModalProvider>
    </>
  );
}

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
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginLeft: 20,
  },
  ContainerCard: {
    width: "90%",
  },
  dropdown: {
    borderRadius: 8,
    backgroundColor: COLORS.white,
    width: "90%",
  },
  cardList: {
    backgroundColor: COLORS.white,
  },
  judul: {
    fontWeight: FONTWEIGHT.bold,
    textAlign: "left",
    paddingLeft: 20,
    paddingTop: 20,
  },
  subJudul: {
    fontWeight: FONTWEIGHT.bold,
    textAlign: "left",
    marginVertical: 20,
  },
  judulFilter: {
    fontWeight: FONTWEIGHT.bold,
    textAlign: "left",
    color: "#499CD7",
  },
  contentContainer: {
    paddingHorizontal: 16,
    margin: 0,
    marginTop: 40,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: "#959CA9",
    borderRadius: 10,
    marginTop: 10,
    height: 50,
    paddingLeft: 20,
  },
  button: {
    backgroundColor: "#164B78",
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 40,
    width: 360,
    marginLeft: 15,
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
