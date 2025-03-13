import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import { getAksiPerubahan, getFilterAksiPerubahan } from "../../service/api";
import { CardAksiPerubahan } from "../../components/CardAksiPerubahan";
import ListEmpty from "../../components/ListEmpty";
import { Loading } from "../../components/Loading";
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
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Dropdown } from "../../components/DropDown";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
// import { ScrollView } from "react-native";

export const AksiPerubahan = () => {
  const dataKategori = [
    {
      id: 1,
      name: "LATIHAN DASAR",
    },
    {
      id: 2,
      name: "PELATIHAN KEPEMIMPINAN PENGAWAS",
    },
    {
      id: 3,
      name: "PELATIHAN KEPEMIMPINAN ADMINISTRATOR",
    },
    {
      id: 4,
      name: "PELATIHAN KEPEMIMPINAN NASIONAL TINGKAT I",
    },
    {
      id: 5,
      name: "PELATIHAN KEPEMIMPINAN NASIONAL TINGKAT II",
    },
  ];
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [filterTahun, setFilterTahun] = useState([]);
  const [filterKategori, setFilterKategori] = useState([]);
  const [listAngkatan, setListAngkatan] = useState([]);
  const [filterAngkatan, setFilterAngkatan] = useState([]);
  const [idAngkatan, setIdAngkatan] = useState([]);
  const [modalDetail, setModalDetail] = useState(false);
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const { device } = useSelector((state) => state.apps);
  const { lists, loading, filter, detail } = useSelector(
    (state) => state.aksiperubahan
  );

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(
        getAksiPerubahan({
          token: token,
          page: page,
          search: search,
          angkatan: filterAngkatan,
          tahun: filterTahun,
          new_title: idAngkatan,
        })
      );
    }
  }, [token, page, search, idAngkatan]);

  const loadMore = () => {
    if (lists.length !== 0) {
      if (lists.length % 5 === 0) {
        setPage(page + 1);
        if (scrollRef) {
          scrollRef.current.scrollToIndex({ animated: false, index: 0 });
        }
      }
    }
  };

  const onRefresh = () => {
    if (page > 1) {
      setPage(page - 1);
    }
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const filterSearch = () => {
    setSearch(inputValue);
  };

  const bottomSheetModalFilterRef = useRef(null);
  const bottomSheetModalDetailRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["90%", "100%"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttachFilter = (item) => {
    bottomSheetModalFilterRef.current?.present();
  };

  const bottomSheetAttachDetail = (item) => {
    bottomSheetModalDetailRef.current?.present();
  };

  const bottomSheetAttachFilterClose = () => {
    if (bottomSheetModalFilterRef.current)
      bottomSheetModalFilterRef.current?.close();
  };

  const bottomSheetAttachDetailClose = () => {
    if (bottomSheetModalDetailRef.current)
      bottomSheetModalDetailRef.current?.close();
  };

  const tahun = () => {
    let tahunMap = {};

    filter.forEach((item) => {
      // Memeriksa apakah nilai value sudah ada dalam objek tahunMap
      if (!tahunMap[item.year]) {
        // Jika belum ada, maka tambahkan entri baru
        tahunMap[item.year] = {
          id: item.id,
          name: item.year,
        };
      }
    });

    // Mengonversi objek menjadi array hasil
    const hasil = Object.keys(tahunMap).map((key) => tahunMap[key]);
    return hasil;
  };

  useEffect(() => {
    let arr = [];
    filterKategori.map((item) => {
      filter.map((value) => {
        if (value.name.includes(item)) {
          let result = value.name.split("ANGKATAN ");
          let angkatan = result[result.length - 1];
          let check = arr.some((x) => x.name === angkatan);

          if (!check) {
            arr.push({
              id: value.batch,
              name: angkatan,
            });
          }
        }
      });
    });
    setListAngkatan(arr);
  }, [filterKategori]);

  const handleSubmitFilter = () => {
    let arrId = [];
    filterTahun.map((itemTahun, indexTahun) => {
      filterKategori.map((itemKategori, indexKategori) => {
        filterAngkatan.map((itemAngkatan, indexAngakatan) => {
          // console.log("filterKategori", itemKategori);
          // console.log("filterTahun", itemTahun);
          // console.log("filterAngkatan", itemAngkatan);
          // filter.filter((x) => {
          //   if (x.name === itemKategori)
          // });
          filter.map((itemFilter) => {
            if (
              itemFilter.name.includes(itemKategori) &&
              itemFilter.year === itemTahun &&
              itemFilter.batch === itemAngkatan
            ) {
              arrId.push(itemFilter.id);
            }
          });
        });
      });
    });
    setIdAngkatan(arrId);
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  return (
    <GestureHandlerRootView>
      {loading ? <Loading /> : null}
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
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
              marginRight: 50,
            }}
          >
            Aksi Perubahan
          </Text>
        </View>
      </View>

      <View style={{ padding: PADDING.Page }}>
        <Text
          style={{
            fontSize: fontSizeResponsive("H1", device),
            marginBottom: 10,
            fontWeight: FONTWEIGHT.bold,
          }}
        >
          Daftar Aksi Perubahan
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // alignContent: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: COLORS.ExtraDivinder,
              borderRadius: 8,
              backgroundColor: COLORS.white,
              width:
                device === "tablet" && orientation === "landscape"
                  ? "95%"
                  : device === "tablet" && orientation === "potrait"
                  ? "92%"
                  : "85%",
            }}
          >
            <Ionicons name="search" size={24} color={COLORS.primary} />
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
              dispatch(getFilterAksiPerubahan(token));
            }}
          >
            <View
              style={{
                width: device === "tablet" ? 50 : 40,
                height: device === "tablet" ? 50 : 40,
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

        <View>
          <FlatList
            data={lists}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => (
              <CardAksiPerubahan
                item={item}
                device={device}
                token={token}
                bottomSheetAttachDetail={bottomSheetAttachDetail}
              />
            )}
            onEndReached={loadMore}
            ref={scrollRef}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={() => <ListEmpty />}
            style={{
              height:
                device === "tablet" && orientation === "potrait" ? "85%" : 630,
            }}
          />
        </View>
      </View>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalDetailRef}
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
            {/* <View
            // style={{
            //   height:
            //     device === "tablet" && orientation === "landscape"
            //       ? "90%"
            //       : "100%",
            // }}
            > */}
            <ScrollView
              nestedScrollEnabled={true}
              scrollEnabled={true}
              style={{
                height: useWindowDimensions().height - 100,
              }}
            >
              <View
                style={{
                  marginHorizontal: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  borderBottomWidth: 2,
                  borderBottomColor: COLORS.grey,
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Detail Aksi Perubahan
                </Text>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    bottomSheetAttachDetailClose();
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={device === "tablet" ? 40 : 24}
                    color={COLORS.lighter}
                  />
                </TouchableOpacity>
              </View>

              <View>
                <View
                  style={{
                    marginVertical: 20,
                    marginHorizontal: 40,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Jenis Kategori
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail.title}
                  </Text>

                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Nama
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail.display_name}
                  </Text>

                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    NIP
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail.coach_nip}
                  </Text>

                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Unit Kerja
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail.unker}
                  </Text>

                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Satuan Kerja
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail.satker}
                  </Text>

                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Coach
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail.coach}
                  </Text>

                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    implementasi
                  </Text>
                  <View
                    style={{
                      backgroundColor:
                        detail.implementation === true
                          ? COLORS.successLight
                          : COLORS.infoDangerLight,
                      padding: 4,
                      width: 100,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        marginTop: 5,
                        color:
                          detail.implementation === true
                            ? COLORS.success
                            : COLORS.infoDanger,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {detail.implementation === true ? "Ya" : "Tidak"}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Rating
                  </Text>
                  <Rating
                    fractions={2}
                    startingValue={detail.rating}
                    readonly
                    imageSize={20}
                    style={{ marginTop: 5, alignItems: "flex-start" }}
                  />

                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    File
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 20,
                      marginVertical: 10,
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: COLORS.ExtraDivinder,
                      }}
                    >
                      <Image
                        source={require("../../assets/superApp/pdf.png")}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail.file_name}
                  </Text>
                </View>
                {/* 
              <Text
                style={{
                  width: "70%",
                  marginHorizontal: 60,
                  marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {detail?.title !== "" && detail?.title !== null
                  ? detail.title
                  : "-"}
              </Text> */}
              </View>
            </ScrollView>
            {/* </View> */}
          </BottomSheetView>
        </BottomSheetModal>

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
                  Filter Aksi Perubahan
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
                  Tahun
                </Text>
                <SectionedMultiSelect
                  items={tahun()}
                  IconRenderer={Icon}
                  uniqueKey="name"
                  onSelectedItemsChange={setFilterTahun}
                  selectedItems={filterTahun}
                  modalWithSafeAreaView={true}
                  confirmText="Simpan"
                  searchPlaceholderText="Cari"
                  selectText="Pilih Tahun"
                  showChips
                  styles={{
                    backdrop: styles.multiSelectBackdrop,
                    selectToggle: styles.multiSelectChipContainer,
                    chipContainer: styles.multiSelectChipText,
                    chipText: styles.multiSelectChipText,
                    button: styles.button,
                    confirmText: styles.confirmText,
                    itemText: styles.confirmText,
                    selectToggleText: styles.selectToggleText,
                  }}
                />
              </View>
              {filterTahun.length > 0 ? (
                <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                  <Text
                    style={{
                      marginHorizontal: 10,
                      marginBottom: 10,
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Jenis Kategori
                  </Text>
                  <SectionedMultiSelect
                    items={dataKategori}
                    IconRenderer={Icon}
                    uniqueKey="name"
                    onSelectedItemsChange={setFilterKategori}
                    selectedItems={filterKategori}
                    modalWithSafeAreaView={true}
                    confirmText="Simpan"
                    searchPlaceholderText="Cari"
                    selectText="Pilih Kategori"
                    showChips
                    styles={{
                      backdrop: styles.multiSelectBackdrop,
                      selectToggle: styles.multiSelectChipContainer,
                      chipContainer: styles.multiSelectChipText,
                      chipText: styles.multiSelectChipText,
                      button: styles.button,
                      confirmText: styles.confirmText,
                      itemText: styles.confirmText,
                      selectToggleText: styles.selectToggleText,
                    }}
                  />
                </View>
              ) : null}

              {filterKategori.length > 0 ? (
                <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                  <Text
                    style={{
                      marginHorizontal: 10,
                      marginBottom: 10,
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Angkatan
                  </Text>
                  <SectionedMultiSelect
                    items={listAngkatan}
                    IconRenderer={Icon}
                    uniqueKey="id"
                    onSelectedItemsChange={setFilterAngkatan}
                    selectedItems={filterAngkatan}
                    modalWithSafeAreaView={true}
                    confirmText="Simpan"
                    searchPlaceholderText="Cari"
                    selectText="Pilih Angkatan"
                    showChips
                    styles={{
                      backdrop: styles.multiSelectBackdrop,
                      selectToggle: styles.multiSelectChipContainer,
                      chipContainer: styles.multiSelectChipText,
                      chipText: styles.multiSelectChipText,
                      button: styles.button,
                      confirmText: styles.confirmText,
                      itemText: styles.confirmText,
                      selectToggleText: styles.selectToggleText,
                    }}
                  />
                </View>
              ) : null}

              {filterAngkatan.length > 0 ? (
                <TouchableOpacity
                  style={{
                    padding: 20,
                    backgroundColor: COLORS.primary,
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                  onPress={() => {
                    handleSubmitFilter();
                    bottomSheetAttachFilterClose();
                  }}
                >
                  <Text style={{ color: COLORS.white }}>Tampilkan</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={{
                  padding: 20,
                  backgroundColor: COLORS.infoDanger,
                  marginTop: 10,
                  marginHorizontal: 20,
                  alignItems: "center",
                  borderRadius: 8,
                }}
                onPress={() => {
                  setFilterTahun([]);
                  setFilterKategori([]);
                  setListAngkatan([]);
                  setFilterAngkatan([]);
                  setIdAngkatan([]);
                }}
              >
                <Text style={{ color: COLORS.white }}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  multiSelectChipContainer: {
    borderWidth: 1,
    backgroundColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  multiSelectChipText: {
    color: "#222",
    fontSize: 12,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  container: {
    height: "10%",
  },
  button: {
    backgroundColor: COLORS.primary,
  },
  confirmText: {
    fontSize: 15,
  },
  selectToggleText: {
    fontSize: 12,
  },
  chipsWrapper: {
    backgroundColor: "red",
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.32,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
