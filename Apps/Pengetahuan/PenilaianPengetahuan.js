import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  COLORS,
  DATETIME,
  DateFormat,
  FONTSIZE,
  FONTWEIGHT,
  FORMATDATE,
  fixedDateString,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { Search } from "../../components/Search";
import { Portal } from "react-native-portalize";
import ListEmpty from "../../components/ListEmpty";
import { Dropdown } from "../../components/DropDown";
import { getTokenValue } from "../../service/session";
import {
  getDetailLinimasa,
  getDetailPenilaian,
  getListPenilaian,
  getListUnitKerja,
  getNilai,
  getTotalPenilaian,
} from "../../service/api";
import moment from "moment/min/moment-with-locales";
// import "moment/locale/id";
import {} from "react-native-safe-area-context";
import { Loading } from "../../components/Loading";
import { TextInput } from "react-native";
import { RefreshControl } from "react-native";

const CardPenilaian = ({ item, token, device }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const getDetail = (id) => {
    // const data = { token: token, id: id }
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailLinimasa({ token, id }));
  };

  // const tanggal = item.published_date;

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          gap: 10,
          marginVertical: 5,
          backgroundColor: COLORS.white,
          borderRadius: 8,
          // justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
          width: "100%",
        }}
        onPress={() => {
          dispatch(getDetailPenilaian({ token: token, id: item.id }));
          dispatch(getNilai({ token: token }));
          navigation.navigate("DetailPenilain");
        }}
      >
        <View>
          <Image
            source={{ uri: item.cover }}
            style={{
              width: device === "tablet" ? 100 : 70,
              height: device === "tablet" ? 80 : 50,
            }}
          />
        </View>
        <View>
          <Text
            style={{
              fontWeight: FONTWEIGHT.bold,
              fontSize: fontSizeResponsive("H4", device),
              width:
                device === "tablet" && orientation === "potrait"
                  ? "70%"
                  : "90%",
            }}
          >
            {item.title}
          </Text>
          <View style={{ gap: 10, marginTop: 10 }}>
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {/* Tanggal: {engDate.locale("id").format("LL")} */}
              Tanggal:{" "}
              {DateFormat({
                date: item.published_date,
                fromDate: DATETIME.LONG_DATETIME,
                toDate: DATETIME.LONG_DATE,
              })}
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <Text
                style={{
                  color: COLORS.lighter,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Poin:
              </Text>
              {item.is_scored !== true ? (
                <View
                  style={{
                    borderWidth: 1,
                    paddingHorizontal: "5%",
                    paddingVertical: 5,
                    borderColor: COLORS.primary,
                    borderRadius: device === "tablet" ? 24 : 16,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      color: COLORS.primary,
                    }}
                  >
                    Waiting
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: "5%",
                    backgroundColor: COLORS.success,
                    borderRadius: device === "tablet" ? 24 : 16,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      color: COLORS.white,
                    }}
                  >
                    {item.score}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const datalistYear = [
  { key: "year1", value: "2023" },
  { key: "year2", value: "2024" },
  { key: "year3", value: "2025" },
];

const dataKuartal = [
  {
    key: "1",
    value: "TW1",
  },
  {
    key: "2",
    value: "TW2",
  },
  {
    key: "3",
    value: "TW3",
  },
  {
    key: "4",
    value: "TW4",
  },
];

export const PenilaianPenggetahaun = () => {
  const navigation = useNavigation();
  const [quarter, setQuarter] = useState();
  // const [kuartal, setKuartal] = useState(dataKuartal)
  const [listYear, setListYear] = useState();
  const [token, setToken] = useState("");
  const isFocused = useIsFocused();
  const [inputValue, setInputValue] = useState("");

  const [page, setPage] = useState(5);

  const bottomSheetModalRef = useRef(null);

  const bottomSheetModalFilterRef = useRef(null);

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

  const bottomSheetAttachFilter = () => {
    bottomSheetModalFilterRef.current?.present();
  };

  const bottomSheetAttachCloseFilter = () => {
    if (bottomSheetModalFilterRef.current)
      bottomSheetModalFilterRef.current?.close();
  };

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const [selectedUnitKerja, setSelectedUnitKerja] = useState({
    key: "",
    value: "",
  });

  const [year, setYear] = useState({
    key: new Date().getFullYear(),
    value: new Date().getFullYear(),
  });

  const month = new Date().getMonth() + 1;

  useEffect(() => {
    let q = "";
    if (1 <= month && month <= 3) {
      q = "1";
    } else if (4 <= month && month <= 6) {
      q = "2";
    } else if (7 <= month && month <= 9) {
      q = "3";
    } else {
      q = "4";
    }
    setQuarter({
      key: q,
      value: q == 1 ? "TW1" : q == 2 ? "TW2" : q == 3 ? "TW3" : "TW4",
    });

    let thn = [];
    for (let i = 2023; i <= year; i++) {
      thn.push({
        key: i,
        value: i,
      });
    }
    setListYear(thn);
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const [ditinjau, setDitinjau] = useState("");

  const handleBelum = () => {
    setDitinjau(false);
  };

  const handleTelah = () => {
    setDitinjau(true);
  };

  useEffect(() => {
    if (token !== "") {
      dispatch(getListUnitKerja(token));
    }
  }, [token]);

  const [savedUnitKerja, setSavedUnitKerja] = useState({ key: "", value: "" });

  const handlePilihSimpan = () => {
    setSavedUnitKerja(selectedUnitKerja);
  };

  useEffect(() => {
    if (token !== "" && isFocused) {
      let data = {
        token: token,
        tahun: year.value,
        TW: quarter.key,
        ditinjau: ditinjau,
        unitKerja: savedUnitKerja.value,
        page: page,
        search: search,
      };
      // dispatch(getDivision(token))
      dispatch(getListPenilaian(data));
      dispatch(getTotalPenilaian(data));
      // dispatch(getDivisionTree({ token: token, id: kategori.key }))
    }
  }, [
    token,
    quarter,
    year,
    isFocused,
    ditinjau,
    savedUnitKerja,
    page,
    search,
    penilaian,
  ]);

  const { penilaian, unitKerja, loading } = useSelector(
    (state) => state.pengetahuan
  );

  const dataUnitKerja = () => {
    let valueUnitKerja = [];

    unitKerja?.lists?.map((item) => {
      valueUnitKerja.push({
        key: item.id,
        value: item.unit_kerja_nama,
      });
    });

    return valueUnitKerja;
  };

  // const dataUnitKerja = [
  //   { key: "1", value: "KEMENTERIAN KELAUTAN DAN PERIKANAN" },
  //   { key: "2", value: "PUSAT DATA STATISTIK DAN INFORMASI" },
  //   { key: "3", value: "INSPEKTORAT JENDERAL" },
  // ];

  // useEffect(() => {
  //   let valueUnitKerja = [];
  //   unitKerja?.lists?.map((item) => {
  //     valueUnitKerja.push({
  //       key: item.id,
  //       value: item.unit_kerja_nama,
  //     });
  //   });
  //   setDataUnitKerja(valueUnitKerja);
  // }, [unitKerja]);

  useEffect(() => {
    setFilterData(penilaian.lists);
  }, [penilaian.lists]);

  const filter = () => {
    setSearch(inputValue);
  };
  // useEffect(() => {
  //   if (search !== "") {
  //     const data = penilaian.lists.filter((item) => {
  //       return item.title.toLowerCase().includes(search.toLowerCase());
  //     });
  //     setFilterData(data);
  //   } else {
  //     setFilterData(penilaian.lists);
  //   }
  // }, [search]);

  const loadMore = () => {
    if (penilaian?.lists.length !== 0) {
      if (penilaian?.lists.length % 5 === 0) {
        setPage(page + 5);
      }
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "" && isFocused) {
        let data = {
          token: token,
          tahun: year.value,
          TW: quarter.key,
          ditinjau: ditinjau,
          unitKerja: savedUnitKerja.value,
          page: page,
          search: search,
        };
        // dispatch(getDivision(token))
        dispatch(getListPenilaian(data));
        dispatch(getTotalPenilaian(data));
        // dispatch(getDivisionTree({ token: token, id: kategori.key }))
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [
    token,
    quarter,
    year,
    isFocused,
    ditinjau,
    savedUnitKerja,
    page,
    search,
    penilaian,
  ]);

  const { device } = useSelector((state) => state.apps);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  console.log(penilaian?.total);

  return (
    <>
      {loading ? <Loading /> : null}
      <View style={{ flex: 1 }}>
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
              onPress={() => navigation.navigate("Main")}
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
              Penilaian
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
            flexDirection: "row",
            paddingHorizontal: 20,
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
                style={{ fontSize: fontSizeResponsive("H4", device), flex: 1 }}
                maxLength={30}
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
                onEndEditing={filter}
                clearButtonMode="always"
                allowFontScaling={false}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              bottomSheetAttachFilter();
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
              }}
            >
              <Ionicons name="filter-outline" size={24} />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 20,
            paddingHorizontal: 20,
            gap: 20,
          }}
        >
          <View
            style={{
              width: "50%",
              gap: 10,
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Pilih Tahun
            </Text>
            <Dropdown
              data={datalistYear}
              placeHolder={"Pilih Tahun"}
              backgroundColor={COLORS.white}
              selected={year}
              setSelected={setYear}
            />
          </View>

          <View
            style={{
              width: "50%",
              gap: 10,
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Pilih Triwulan
            </Text>

            <Dropdown
              data={dataKuartal}
              placeHolder={"Pilih Kuartal"}
              backgroundColor={COLORS.white}
              selected={quarter}
              setSelected={setQuarter}
            />
          </View>
        </View>

        <BottomSheetModal
          ref={bottomSheetModalFilterRef}
          snapPoints={initialSnapPoints}
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
            <View style={{ flex: 1 }}>
              <View
                style={{
                  marginHorizontal: "5%",
                  width: "90%",
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: "88%",
                    // backgroundColor: "brown",
                  }}
                >
                  {savedUnitKerja.key === "" ? (
                    <Dropdown
                      placeHolder={"Pilih Unit Kerja"}
                      borderWidth={1}
                      data={dataUnitKerja()}
                      setSelected={setSelectedUnitKerja}
                      borderColor={COLORS.ExtraDivinder}
                      borderwidthDrop={1}
                      borderColorDrop={COLORS.ExtraDivinder}
                      borderWidthValue={1}
                      borderColorValue={COLORS.ExtraDivinder}
                    />
                  ) : (
                    <Dropdown
                      borderWidth={1}
                      data={dataUnitKerja()}
                      selected={savedUnitKerja}
                      setSelected={setSelectedUnitKerja}
                      borderColor={COLORS.ExtraDivinder}
                      borderwidthDrop={1}
                      borderColorDrop={COLORS.ExtraDivinder}
                      borderWidthValue={1}
                      borderColorValue={COLORS.ExtraDivinder}
                    />
                  )}
                </View>
              </View>
              <View style={{ position: "absolute", right: 20, top: 30 }}>
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetAttachCloseFilter();
                    setSelectedUnitKerja({
                      key: "",
                      value: "",
                    });
                    setSavedUnitKerja({ key: "", value: "" });
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.danger,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Batal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ position: "relative" }}>
              <TouchableOpacity
                style={{
                  width: "90%",
                  backgroundColor: COLORS.primary,
                  height: 50,
                  marginVertical: 40,
                  borderRadius: 6,
                  alignItems: "center",
                  marginHorizontal: "5%",
                  justifyContent: "center",
                }}
                onPress={() => {
                  handlePilihSimpan();
                  bottomSheetAttachCloseFilter();
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: fontSizeResponsive("H1", device),
                    fontWeight: 500,
                  }}
                >
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            gap: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor:
                !ditinjau && ditinjau !== "" ? COLORS.primary : COLORS.white,
              width: "49.5%",
              flex: 1,
              height: 130,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleBelum}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Image source={require("../../assets/superApp/unreviewed.png")} />
              <Text
                style={{
                  fontSize: fontSizeResponsive("Judul", device),
                  fontWeight: FONTWEIGHT.bold,
                  marginTop: 10,
                  color: !ditinjau && ditinjau !== "" ? COLORS.white : null,
                }}
              >
                {penilaian?.total?.total_unreviewed}
              </Text>
            </View>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                fontWeight: FONTWEIGHT.bold,
                marginVertical: 5,
                color: !ditinjau && ditinjau !== "" ? COLORS.white : null,
              }}
            >
              BELUM DINILAI
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                color:
                  !ditinjau && ditinjau !== "" ? COLORS.white : COLORS.lighter,
              }}
            >
              pada triwulan terakhir
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor:
                ditinjau && ditinjau !== "" ? COLORS.primary : COLORS.white,
              flex: 1,
              height: 130,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleTelah}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Image source={require("../../assets/superApp/reviewed.png")} />
              <Text
                style={{
                  fontSize: fontSizeResponsive("Judul", device),
                  fontWeight: FONTWEIGHT.bold,
                  marginTop: 10,
                  color: ditinjau && ditinjau !== "" ? COLORS.white : null,
                }}
              >
                {penilaian?.total?.total_reviewed}
              </Text>
            </View>
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
                marginVertical: 5,
                color: ditinjau && ditinjau !== "" ? COLORS.white : null,
              }}
            >
              TELAH DINILAI
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                color:
                  ditinjau && ditinjau !== "" ? COLORS.white : COLORS.lighter,
              }}
            >
              pada triwulan terakhir
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 10,
            paddingVertical: 5,
            flex: 1,
            marginHorizontal: 20,
            // backgroundColor: "brown",
          }}
        >
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              List Penilaian
            </Text>
          </View>
          <FlatList
            data={filterData}
            renderItem={({ item }) => (
              <CardPenilaian item={item} token={token} device={device} />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => <ListEmpty />}
            onEndReached={penilaian?.lists.length === 0 ? null : loadMore}
          />
        </View>
      </View>
    </>
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
  backIcon: {
    backgroundColor: "white",
    height: 28,
    width: 28,
    borderRadius: 50,
  },
  imageIos: {
    height: 193,
    width: 350,
    borderRadius: 16,
  },
  imageAndroid: {
    height: 193,
    width: 369,
    borderRadius: 16,
  },
});
