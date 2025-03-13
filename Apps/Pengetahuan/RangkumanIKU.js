import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "../../components/DropDown";
import { Search } from "../../components/Search";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import WebView from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import {
  getListPegawai,
  getListPegawaiExport,
  getListPostPegawai,
  getListUnitKerja,
} from "../../service/api";
import { FlatList } from "react-native-gesture-handler";
import ListEmpty from "../../components/ListEmpty";
import { shareAsync } from "expo-sharing";
// import { FileSystem } from "expo";
import * as DocumentPicker from "expo-document-picker";
import { ActivityIndicator } from "react-native";
// import { shareAsync } from "expo-sharing";
// import { AsyncStorage } from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import { RefreshControl } from "react-native";
const { StorageAccessFramework } = FileSystem;

const ListDaftarPegawai = ({ item, token, device }) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const getDetail = (id) => {
    const param = { token, id };
    dispatch(getListPostPegawai(param));
  };
  return (
    <View>
      <TouchableOpacity
        key={item.id}
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 10,
          padding: 20,
          gap: 5,
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
        }}
        onPress={() => {
          getDetail(item.id);
          navigation.navigate("ListPostinganPegawai", item.nama);
        }}
      >
        <Text
          style={{
            fontSize: fontSizeResponsive("H1", device),
            fontWeight: FONTWEIGHT.bold,
          }}
        >
          {item.nama}
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          Jabatan: {item.jabatan}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: COLORS.lighter,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            Nilai Saat Ini: {item.score.nilai}
          </Text>
          <View
            style={{
              backgroundColor:
                item.score.status === "Tidak Memenuhi" ? "#EA5455" : "green",
              borderRadius: 10,
              padding: 3,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {item.score.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const RangkumanIKU = () => {
  const navigation = useNavigation();

  const [switchView, setSwitchView] = useState(true);

  const switchRangkumanView = () => {
    setSwitchView(true);
  };
  const switchDaftarPegawaiView = () => {
    setSwitchView(false);
  };

  const initialSnapPoints = useMemo(() => ["90%", "90%"], []);
  const initialSnapPointsTambah = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPointsTambah);

  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalSelectRef = useRef(null);
  const bottomSheetModalAddRef = useRef(null);

  const bottomSheetAttachSearch = () => {
    bottomSheetModalRef.current?.present();
  };
  const bottomSheetAttachSearchClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const [choiceTipe, setChoiceTipe] = useState({
    key: "1",
    value: "Dashboard",
  });

  const datalistYear = [
    { key: "year1", value: "2023" },
    { key: "year2", value: "2024" },
    { key: "year3", value: "2025" },
  ];

  const dataKuartal = [
    { key: "q1", value: "TW 1" },
    { key: "q2", value: "TW 2" },
    { key: "q3", value: "TW 3" },
    { key: "q4", value: "TW 4" },
  ];

  const [selectedYear, setSelectedYear] = useState({
    key: "",
    value: "",
  });
  const [selectedQuarter, setSelectedQuarter] = useState({
    key: "",
    value: "",
  });
  const [selectedUnitKerja, setSelectedUnitKerja] = useState({
    key: "",
    value: "",
  });

  const [choiceFilter, setChoiceFilter] = useState("semua");

  const bottomSheetAttachSelectClose = () => {
    if (bottomSheetModalSelectRef.current)
      bottomSheetModalSelectRef.current?.close();
  };

  const bottomSheetAttachSelect = () => {
    bottomSheetModalSelectRef.current?.present();
  };

  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getListUnitKerja(token));
    }
  }, [token]);

  const [savedYear, setSavedYear] = useState({ key: "year1", value: "2023" });
  const [savedQuarter, setSavedQuarter] = useState({
    key: "q3",
    value: "TW 3",
  });

  const handlePilihSimpan = () => {
    const param = {
      token: token,
      page: page,
      year: year.value,
      quarter: `q${quarter?.key}`,
      unitKerja: selectedUnitKerja.value,
    };
    if (token !== "") {
      dispatch(getListPegawai(param));
    }
  };

  const [page, setPage] = useState(10);

  useEffect(() => {
    const param = {
      token: token,
      page: page,
      year: year.value,
      quarter: `q${quarter?.key}`,
      unitKerja: selectedUnitKerja.value,
    };
    if (token !== "") {
      dispatch(getListPegawai(param));
    }
  }, [token]);

  const loadMore = () => {
    if (
      filterData.length % 10 === 0 &&
      (year.value || quarter.value || selectedUnitKerja.value)
    ) {
      if (filterData.length > page) {
        setPage(page + 10);
      }
    }
  };

  const { pegawai, refresh, loading } = useSelector(
    (state) => state.pengetahuan
  );

  useEffect(() => {
    if (refresh) {
      dispatch(getListPegawai({ token: token }));
    }
  }, [refresh]);

  const { unitKerja } = useSelector((state) => state.pengetahuan);

  const { exportPegawai, download } = useSelector((state) => state.pengetahuan);

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

  useEffect(() => {
    setFilterData(pegawai?.lists);
  }, [pegawai, year, quarter]);

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [ascending, setAscending] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    const item = pegawai?.lists;
    if (search !== "") {
      const data = item.filter((item) => {
        return item?.nama?.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(item);
    }
  }, [search, isFiltered]);

  const filter = (event) => {
    setSearch(event);
  };

  const asc = () => {
    const sortedAscending = filterData
      ?.slice()
      .sort((a, b) => a.nama.localeCompare(b.nama));
    setFilterData(sortedAscending);
    setAscending(true);
    setIsFiltered(true);
  };

  const desc = () => {
    const sortedDescending = filterData
      ?.slice()
      .sort((a, b) => b.nama.localeCompare(a.nama));
    setFilterData(sortedDescending);
    setAscending(false);
    setIsFiltered(true);
  };

  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");

  const downloadFile = async (fileUrl, fileType, fileName) => {
    //alert(fileName)

    const namafile = exportPegawai?.lists?.file.split("/");
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        downloadPath + namafile[namafile.length - 1],
        { headers: { Authorization: token } }
      );
      try {
        // if (Platform.OS === "android") {
        //   const { uri } = await downloadResumable.downloadAsync();
        //   saveAndroidFile(uri, namafile[namafile.length - 1], fileType);
        // } else {
        const { uri } = await downloadResumable.downloadAsync();
        saveIosFile(uri);
        // }
      } catch (e) {
        // setIsLoading(false);
        console.error("download error:", e);
      }
    } catch (e) {}
  };
  const saveAndroidFile = async (fileUri, fileName, fileType) => {
    try {
      const fileString = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        return;
      }

      try {
        await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          fileType
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, fileString, {
              encoding: FileSystem.EncodingType.Base64,
            });
            Alert.alert("Success!", "Download Successfully.");
          })
          .catch((e) => {
            Alert.alert(
              "Failed!",
              "Download Unsuccessful. Please choose another folder to download file."
            );
          });
      } catch (e) {
        throw new Error(e);
      }
    } catch (err) {}
  };
  const saveIosFile = async (fileUri) => {
    try {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/vnd.ms-excel",
        dialogTitle: "Share PDF",
      });
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      const param = {
        token: token,
        page: page,
        year: year.value,
        quarter: `q${quarter?.key}`,
        unitKerja: selectedUnitKerja.value,
      };
      if (token !== "") {
        dispatch(getListPegawai(param));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, year, quarter, selectedUnitKerja, page]);

  const { device } = useSelector((state) => state.apps);
  const [listYear, setListYear] = useState();
  const [quarter, setQuarter] = useState();

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

  useEffect(() => {
    const param = {
      token: token,
      year: year.value,
      quarter: `q${quarter?.key}`,
      unitKerja: selectedUnitKerja.value,
    };
    if (token !== "") {
      dispatch(getListPegawaiExport(param));
    }
  }, [token, year, quarter, selectedUnitKerja, download]);

  return (
    <>
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
            {switchView ? "Rangkuman IKU" : "Daftar Pegawai"}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginVertical: 20,
            paddingHorizontal: 20,
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: switchView ? COLORS.primary : COLORS.white,
              padding: 10,
              width: "47%",
              borderRadius: 8,
              height: device === "tablet" ? 65 : 45,
              justifyContent: "center",
              //shadow ios
              shadowOffset: switchView
                ? { width: -2, height: 4 }
                : { width: 0, height: 0 },
              shadowColor: switchView ? "#8E1414" : "FFFFFF",
              shadowOpacity: switchView ? 0.2 : 0,
              //shadow android
              elevation: switchView ? 2 : 0,
            }}
            onPress={switchRangkumanView}
          >
            <Text
              style={{
                color: switchView ? COLORS.white : COLORS.primary,
                textAlign: "center",
                fontSize: fontSizeResponsive("H4", device),
                fontWeight: 600,
              }}
            >
              Rangkuman
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: !switchView ? COLORS.primary : COLORS.white,
              padding: 10,
              width: "47%",
              borderRadius: 8,
              height: device === "tablet" ? 65 : 45,
              justifyContent: "center",
              //shadow ios
              shadowOffset: !switchView
                ? { width: -2, height: 4 }
                : { width: 0, height: 0 },
              shadowColor: !switchView ? "#8E1414" : "FFFFFF",
              shadowOpacity: !switchView ? 0.2 : 0,
              //shadow android
              elevation: !switchView ? 2 : 0,
            }}
            onPress={switchDaftarPegawaiView}
          >
            <Text
              style={{
                color: !switchView ? COLORS.white : COLORS.primary,
                textAlign: "center",
                fontSize: fontSizeResponsive("H4", device),
                fontWeight: 600,
              }}
            >
              Daftar Pegawai
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, flex: 1 }}>
          {switchView ? (
            <View
              style={{
                height: device === "tablet" ? "85%" : "80%",
                width: "100%",
              }}
            >
              <WebView
                // originWhitelist={["*"]}
                source={{
                  uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DRangkumanIKU/DRangkumanIKU.html",
                  headers: { Authorization: `${token}` },
                }}
                style={{ flex: 1, borderRadius: 8 }}
                allowFileAccess={true}
                textZoom={100}
                androidLayerType={"hardware"}
                mixedContentMode={"always"}
                allowUniversalAccessFromFileURLs={true}
                scalesPageToFit={false}
                thirdPartyCookiesEnabled={true}
              />
            </View>
          ) : (
            <>
              <View
                style={{
                  flexDirection: "column",
                  gap: 5,
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetAttachSelect();
                    // setFilterData([]);
                  }}
                  // style={{ width: "46%" }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      marginVertical: 10,
                      height: 54,
                      justifyContent: "center",
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
                        marginLeft: 20,
                        color: COLORS.lighter,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Pilih Tahun dan Triwulan dan Unit Kerja
                    </Text>
                  </View>
                </TouchableOpacity>

                <BottomSheetModal
                  ref={bottomSheetModalSelectRef}
                  snapPoints={initialSnapPoints}
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
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          marginHorizontal: "5%",
                          marginTop: 10,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: 14,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H1", device),
                          }}
                        >
                          Pilih
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            bottomSheetAttachSelectClose();
                          }}
                        >
                          <Ionicons
                            name="close-outline"
                            size={24}
                            color={COLORS.lighter}
                          />
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          // gap: 26,
                          marginHorizontal: "5%",
                          paddingBottom: 15,
                        }}
                      >
                        <View style={{ width: "47%" }}>
                          {year?.key === "" ? (
                            <Dropdown
                              placeHolder={"Pilih Tahun"}
                              borderWidth={1}
                              data={datalistYear}
                              // selected={year}
                              setSelected={setYear}
                              borderColor={COLORS.ExtraDivinder}
                              borderwidthDrop={1}
                              borderColorDrop={COLORS.ExtraDivinder}
                              borderWidthValue={1}
                              borderColorValue={COLORS.ExtraDivinder}
                            />
                          ) : (
                            <Dropdown
                              // placeHolder={"Pilih Tahun"}
                              borderWidth={1}
                              data={datalistYear}
                              selected={year}
                              setSelected={setYear}
                              borderColor={COLORS.ExtraDivinder}
                              borderwidthDrop={1}
                              borderColorDrop={COLORS.ExtraDivinder}
                              borderWidthValue={1}
                              borderColorValue={COLORS.ExtraDivinder}
                            />
                          )}
                        </View>

                        <View style={{ width: "47%" }}>
                          {quarter?.key === "" ? (
                            <Dropdown
                              placeHolder={"Pilih Triwulan"}
                              borderWidth={1}
                              data={dataKuartal}
                              // selected={quarter}
                              setSelected={setQuarter}
                              borderColor={COLORS.ExtraDivinder}
                              borderwidthDrop={1}
                              borderColorDrop={COLORS.ExtraDivinder}
                              borderWidthValue={1}
                              borderColorValue={COLORS.ExtraDivinder}
                            />
                          ) : (
                            <Dropdown
                              // placeHolder={"Pilih Triwulan"}
                              borderWidth={1}
                              data={dataKuartal}
                              selected={quarter}
                              setSelected={setQuarter}
                              borderColor={COLORS.ExtraDivinder}
                              borderwidthDrop={1}
                              borderColorDrop={COLORS.ExtraDivinder}
                              borderWidthValue={1}
                              borderColorValue={COLORS.ExtraDivinder}
                            />
                          )}
                        </View>
                      </View>

                      <View style={{ marginHorizontal: "5%" }}>
                        {selectedUnitKerja?.key === "" ? (
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
                            selected={selectedUnitKerja}
                            setSelected={setSelectedUnitKerja}
                            borderColor={COLORS.ExtraDivinder}
                            borderwidthDrop={1}
                            borderColorDrop={COLORS.ExtraDivinder}
                            borderWidthValue={1}
                            borderColorValue={COLORS.ExtraDivinder}
                          />
                        )}
                      </View>

                      {choiceTipe.key === "3" ||
                      choiceTipe.key === "4" ||
                      choiceTipe.key === "5" ? (
                        <></>
                      ) : null}

                      <View
                        style={{
                          height: 190,
                          paddingVertical: 20,
                          justifyContent: "flex-end",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            width: "90%",
                            backgroundColor: COLORS.primary,
                            height: 50,
                            // marginTop: ,
                            borderRadius: 8,
                            alignItems: "center",
                            marginHorizontal: "5%",
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            handlePilihSimpan();
                            bottomSheetAttachSelectClose();
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
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>
                {/* 
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
                  <View style={{ marginHorizontal: 20 }}>
                    <View style={{ flexDirection: "row", gap: 16 }}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "#F0F0F0",
                          borderRadius: 8,
                          borderColor: COLORS.white,
                        }}
                      >
                        <Search
                          placeholder={"Cari"}
                          iconColor={COLORS.primary}
                          onSearch={filter}
                        />
                      </View>
                      <TouchableOpacity
                        style={{ justifyContent: "center" }}
                        onPress={() => {
                          bottomSheetAttachSearchClose();
                        }}
                      >
                        <Text
                          style={{
                            fontSize: FONTSIZE.H1,
                            color: COLORS.infoDanger,
                            fontWeight: 500,
                          }}
                        >
                          Batal
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 500,
                      paddingTop: 15,
                    }}
                  >
                    <FlatList
                      data={filterData}
                      renderItem={({ item }) => (
                        <View key={item.id} style={{ marginBottom: 10 }}>
                          <ListDaftarPegawai item={item} token={token} />
                        </View>
                      )}
                      keyExtractor={(item) => item.id}
                      ListEmptyComponent={() => <ListEmpty />}
                    />
                  </View>
                </BottomSheetView>
              </BottomSheetModal> */}

                <View style={{ marginVertical: 10 }}>
                  <Search
                    placeholder={"Cari..."}
                    iconColor={COLORS.primary}
                    onSearch={filter}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {"*) Nilai Minimum = 3"}
                </Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {exportPegawai?.lists?.length !== 0 ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.white,
                        width: 40,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 30,
                      }}
                      onPress={() => {
                        downloadFile(
                          exportPegawai?.lists?.file,
                          "application/vnd.ms-excel",
                          "sample.xls"
                        );
                        // openFile();
                      }}
                    >
                      <Icon name="get-app" size={24} color={COLORS.grey} />
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    onPress={!ascending ? asc : desc}
                    style={{
                      backgroundColor: COLORS.white,
                      width: 40,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 30,
                    }}
                  >
                    <Ionicons
                      name="filter-outline"
                      size={24}
                      color={COLORS.grey}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginVertical: 10, gap: 2 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: 500,
                    color: COLORS.grey,
                  }}
                >
                  Yang dipilih:
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: 700,
                  }}
                >
                  {year.value ? year.value : "-"} /{" "}
                  {quarter.value ? quarter.value : "-"} /{" "}
                  {selectedUnitKerja.value ? selectedUnitKerja.value : "-"}
                </Text>
              </View>

              <View>
                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <FlatList
                    data={filterData}
                    renderItem={({ item }) => (
                      <View key={item.id} style={{ marginVertical: 10 }}>
                        <ListDaftarPegawai
                          item={item}
                          token={token}
                          device={device}
                        />
                      </View>
                    )}
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
                            size="large"
                            color={COLORS.primary}
                          />
                        </View>
                      ) : null
                    }
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={() => <ListEmpty />}
                    onEndReached={loadMore}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                    style={{
                      height: device === "tablet" ? "79%" : "64%",
                    }}
                  />

                  {/* {pegawai.lists.length !== 0
                  ? pegawai.lists.map((item, index) => {
                      const getDetail = (id) => {
                        const param = { token, id };
                        dispatch(getListPostPegawai(param));
                      };

                      return (
                        <TouchableOpacity
                          key={index}
                          style={{
                            backgroundColor: COLORS.white,
                            borderRadius: 10,
                            padding: 10,
                            gap: 5,
                            //shadow ios
                            shadowOffset: { width: -2, height: 4 },
                            shadowColor: "#171717",
                            shadowOpacity: 0.2,
                            //shadow android
                            elevation: 2,
                          }}
                          onPress={() => {
                            getDetail(item.id);
                            navigation.navigate(
                              "ListPostinganPegawai",
                              item.nama
                            );
                          }}
                        >
                          <Text
                            style={{
                              fontSize: FONTSIZE.H1,
                              fontWeight: FONTWEIGHT.bold,
                            }}
                          >
                            {item.nama}
                          </Text>
                          <Text>Jabatan: {item.jabatan}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={{ color: COLORS.lighter }}>
                              Nilai Saat Ini: {item.score.nilai}
                            </Text>
                            <View
                              style={{
                                backgroundColor:
                                  item.score.status === "Tidak Memenuhi"
                                    ? "#EA5455"
                                    : "green",
                                borderRadius: 10,
                                padding: 3,
                                paddingHorizontal: 10,
                              }}
                            >
                              <Text style={{ color: "white" }}>
                                {item.score.status}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                  : ""} */}
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </>
  );
};
