import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  useWindowDimensions,
  Alert,
} from "react-native";
import { Button, Chip, IconButton } from "react-native-paper";
import CardList from "../../../components/UI/CardList";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError, postHTTP } from "../../../utils/http";
import { initData } from "../../../utils/list";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import SearchFilter from "../../../components/UI/SearchFilter";
import { Config } from "../../../constants/config";
import LottieView from "lottie-react-native";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  getOrientation,
} from "../../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "../../../store/auth";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-native-modern-datepicker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Sentry from "@sentry/react-native";
import { Dropdown } from "react-native-element-dropdown";
import Checkbox from "expo-checkbox";
import {
  removeAllSelectedList,
  setSelectedAll,
  initListAll,
  initList,
} from "../../../store/listBulk";

function SubmittedList({ route }) {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDateVisible, setStartDateVisibility] = useState(false);
  const [isEndDateVisible, setEndDateVisibility] = useState(false);
  const [isSearchFilter, setIsSearchFilter] = useState(false);
  const [isSearchQuery, setIsSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const unread = route.params.unread;
  const animation = useRef(null);
  const [selectedTypeLetter, setSelectedTypeLetter] = useState({
    id: "",
    name: "Semua Jenis Surat",
  });
  const typeLetter = useSelector((state) => state.listbulk.typeLetter);
  const { selectedAll, listAll } = useSelector((state) => state.listbulk);
  const selectedId = useSelector((state) => state.listbulk.list);
  const profile = useSelector((state) => state.profile);
  const [isFocus, setIsFocus] = useState();
  const [typeBulkDelete, setTypeBulkDelete] = useState(false);
  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  // const snapPoints = useMemo(() => [50, "100%"], []);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  //Pilih Tanggal
  const [modalVisiblePicker, setModalVisiblePicker] = useState("");
  const [TanggalMulai, setTanggalMulai] = useState("");
  const [TanggalSelesai, setTanggalSelsai] = useState("");

  useFocusEffect(
    useCallback(() => {
      setList([]);
      dispatch(removeAllSelectedList());
      refresh();
    }, [])
  );

  useEffect(() => {
    filter(1);
    dispatch(removeAllSelectedList());
    if (
      profile?.profile?.title?.length > 0 &&
      !profile?.profile?.title[
        profile?.profile?.title.length - 1
      ]?.type?.startsWith("K")
    ) {
      setTypeBulkDelete(true);
    }
  }, [
    startDate,
    endDate,
    isSearchQuery,
    isSearchFilter,
    selectedTypeLetter,
    profile,
  ]);

  console.log(profile?.profile.title);

  async function getAgendaOut(page) {
    setIsLoading(true);
    try {
      let response;
      response = await getHTTP(nde_api.agendaout.replace("{$page}", page));
      let data = initData(list, response.data);
      setList(data);
      selectedAllList(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.status == 401 || error?.status == 401) {
        Sentry.captureEvent(error?.response);
        dispatch(logout());
      } else {
        handlerError(
          error,
          "Peringatan!",
          "List Surat Keluar Terkirim tidak berfungsi"
        );
      }
    }
  }

  const filter = async (page) => {
    setIsLoading(true);
    try {
      if (
        startDate == null &&
        endDate == null &&
        searchQuery.length == 0 &&
        selectedTypeLetter.name == "Semua Jenis Surat"
      ) {
        getAgendaOut(1);
      } else if (
        !isSearchFilter &&
        (startDate != null ||
          endDate != null ||
          searchQuery.length != 0 ||
          selectedTypeLetter.name != "Semua Jenis Surat")
      ) {
      } else {
        let start;
        let end;
        let word;
        let typeletter = "";
        if (startDate == undefined || startDate == null) {
          start = "";
        } else {
          start = "&start_date=" + moment(startDate).format("DD/MM/YYYY");
        }
        if (endDate == undefined || endDate == null) {
          if (startDate == undefined || startDate == null) {
            end = "";
          } else {
            end = "&end_date=" + moment(new Date()).format("DD/MM/YYYY");
            setEndDate(new Date());
          }
        } else {
          end = "&end_date=" + moment(endDate).format("DD/MM/YYYY");
        }
        if (isSearchQuery.length == 0) {
          word = "";
        } else {
          word = "&query=" + isSearchQuery;
        }
        if (selectedTypeLetter.name == "Semua Jenis Surat") {
          typeletter = "";
        } else {
          typeletter = "&type_letter=" + selectedTypeLetter.name;
        }
        let url;
        url = nde_api.agendaout;
        url = url + start + end + word + typeletter;
        let response = await getHTTP(url.replace("{$page}", page));
        if (response) {
          setIsSearchFilter(true);
          let data = initData(list, response.data);
          setList(data);
          selectedAllList(data);
          bottomSheetModalRef.current?.dismiss();
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsSearchFilter(false);
      setIsLoading(false);
      bottomSheetModalRef.current?.dismiss();
      if (error?.response?.status == 401 || error?.status == 401) {
        Sentry.captureEvent(error?.response);
        dispatch(logout());
      } else {
        handlerError(
          error,
          "Peringatan!",
          "List Surat Keluar Terkirim tidak berfungsi"
        );
      }
    }
  };

  const { width: screenWidthFilter, height: screenHeightFilter } =
    useWindowDimensions();

  let orientation = getOrientation(screenWidthFilter, screenHeightFilter);

  const { device } = useSelector((state) => state.apps);

  const renderItem = ({ item }) => (
    <>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View
          style={{
            backgroundColor: "#5C5E61",
            height: 25,
            width: 5,
            borderBottomRightRadius: 2,
            borderTopRightRadius: 2,
          }}
        />
        <View
          style={{
            backgroundColor: "#5C5E61",
            width: "100%",
            paddingVertical: 3,
            paddingHorizontal: 10,
            borderBottomLeftRadius: 2,
            borderTopLeftRadius: 2,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: 600, color: COLORS.white }}>
            {item.date}
          </Text>
        </View>
      </View>
      <View style={{ marginBottom: 16 }}>
        {item.children.map((data) => (
          <CardList
            key={data.id}
            data={data}
            tipe="agendaout"
            typeBulkDelete={typeBulkDelete}
            onPress={() => {
              navigation.navigate("SubmittedDetail", {
                id: data.id,
                title:
                  device === "tablet"
                    ? "Detail Surat Keluar Terkirim"
                    : "Detail Surat Keluar\nTerkirim",
              });
            }}
          />
        ))}
      </View>
    </>
  );

  const listEmpty = (
    <View style={styles.notFound}>
      <LottieView
        autoPlay
        ref={animation}
        style={[styles.titleNotFound, { width: "100%", height: 200 }]}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={Config.notFound}
      />
      <Text style={styles.titleNotFound}>
        {isLoading
          ? "Pencarian..."
          : isSearchFilter && unread
          ? "Dokumen tidak ditemukan"
          : isSearchFilter && !unread
          ? "Dokumen tidak ditemukan"
          : list?.count == 0 && unread
          ? "Tidak ada dokumen"
          : list?.count == 0 && !unread
          ? "Tidak ada dokumen"
          : "Pencarian..."}
      </Text>
    </View>
  );

  function loadMore() {
    if (list?.next != null) {
      if (isSearchFilter) {
        filter(list?.next);
      } else {
        getAgendaOut(list?.next);
      }
    }
  }
  function refresh() {
    setIsLoading(true);
    setStartDate();
    setEndDate();
    setSearchQuery("");
    setIsSearchFilter(false);
    setSelectedTypeLetter({
      id: "",
      name: "Semua Jenis Surat",
    });
    if (!isSearchFilter) {
      getAgendaOut(1);
    }
    bottomSheetModalRef.current?.dismiss();
    setIsLoading(false);
  }

  const showBottomFilter = () => {
    bottomSheetModalRef.current?.present();
  };

  const clearSearch = () => (
    <>
      {searchQuery.length > 0 && (
        <IconButton
          icon="close"
          onPress={() => {
            setSearchQuery("");
            setIsSearchQuery("");
            setIsSearchFilter(false);
            if (
              selectedTypeLetter.name == "Semua Jenis Surat" &&
              startDate == null &&
              endDate == null
            ) {
              setList([]);
            }
          }}
        />
      )}
    </>
  );
  const showStartDate = () => {
    setStartDateVisibility(true);
  };

  const hideStartDate = () => {
    setStartDateVisibility(false);
  };

  const handleConfirmStart = (date) => {
    setStartDate(date);
    hideStartDate();
  };
  const showEndDate = () => {
    setEndDateVisibility(!isEndDateVisible);
  };

  const hideEndDate = () => {
    setEndDateVisibility(false);
  };

  const handleConfirmEnd = (date) => {
    if (
      startDate == null &&
      moment(date).format("DD/MM/YYYY") ==
        moment(new Date()).format("DD/MM/YYYY")
    ) {
      setStartDate(date);
    }
    setEndDate(date);
    hideEndDate();
  };

  function selectedAllList(data) {
    const temp = [];
    if (data?.count == 0) {
      dispatch(initListAll([]));
    } else {
      data?.results?.map((x) =>
        x?.children?.map((y) => {
          if (!y.progress) {
            temp.push(y.id);
          }
        })
      );
      dispatch(initListAll(temp));
    }
  }

  async function bulkDelete() {
    try {
      setIsLoading(true);
      let payload = { ids: selectedId };
      let response = await postHTTP(nde_api.agendaoutdelete, payload);
      if (response?.data?.status == "Error") {
        Alert.alert("Gagal!", response?.data?.msg);
      } else {
        Alert.alert("Berhasil!", response?.data?.msg, [
          {
            text: "Ok",
            onPress: () => refresh(),
          },
        ]);
      }
      setIsLoading(false);
    } catch (error) {
      handlerError(error, "Peringatan!", "Hapus surat tidak berfungsi!");
      setIsLoading(false);
    }
  }

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* {isLoading && loadingOverlay} */}
        <View
          style={{ flex: 1, backgroundColor: GlobalStyles.colors.tertiery20 }}
        >
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            clearSearch={clearSearch}
            showBottomFilter={showBottomFilter}
            getSearch={() => {
              setList([]);
              setIsSearchQuery(searchQuery);
              setIsSearchFilter(true);
            }}
          />
          {isSearchFilter &&
            (startDate != null ||
              selectedTypeLetter.name != "Semua Jenis Surat") && (
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: GlobalStyles.colors.tertiery10,
                }}
              >
                <Text
                  style={[
                    styles.headerList,
                    {
                      backgroundColor: GlobalStyles.colors.textWhite,
                      color: GlobalStyles.colors.textBlack,
                      marginBottom: 8,
                    },
                  ]}
                >
                  {isSearchQuery.length != 0 &&
                  startDate == null &&
                  selectedTypeLetter.name == "Semua Jenis Surat"
                    ? "Cari: "
                    : "Saring : "}
                </Text>
                <View style={styles.filter}>
                  {startDate && (
                    <Chip
                      style={styles.badge}
                      onClose={() => {
                        setStartDate(null);
                        setEndDate(null);
                        if (
                          searchQuery.length == 0 &&
                          selectedTypeLetter.name == "Semua Jenis Surat"
                        ) {
                          setIsSearchFilter(false);
                          setIsLoading(true);
                        }
                        setList([]);
                      }}
                      closeIcon="close"
                    >
                      {moment(startDate).format("DD/MM/YYYY")} -{" "}
                      {moment(endDate).format("DD/MM/YYYY")}
                    </Chip>
                  )}
                  {isSearchQuery && (
                    <Chip
                      style={styles.badge}
                      onClose={() => {
                        setSearchQuery("");
                        setIsSearchQuery("");
                        if (
                          startDate == null &&
                          endDate == null &&
                          selectedTypeLetter.name == "Semua Jenis Surat"
                        ) {
                          setIsSearchFilter(false);
                          setIsLoading(true);
                        }
                        setList([]);
                      }}
                      closeIcon="close"
                    >
                      {isSearchQuery}
                    </Chip>
                  )}
                  {selectedTypeLetter.name != "Semua Jenis Surat" && (
                    <Chip
                      style={styles.badge}
                      onClose={() => {
                        setSelectedTypeLetter({
                          id: "",
                          name: "Semua Jenis Surat",
                        });
                        if (searchQuery.length == 0 && startDate == null) {
                          setIsSearchFilter(false);
                          setIsLoading(true);
                        }
                        setList([]);
                      }}
                      closeIcon="close"
                    >
                      {selectedTypeLetter.name}
                    </Chip>
                  )}
                </View>
              </View>
            )}
          {typeBulkDelete ? (
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: COLORS.white,
                padding: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Checkbox
                  value={selectedAll}
                  onValueChange={(item) => {
                    dispatch(setSelectedAll(item));
                    if (item) {
                      dispatch(initList(listAll));
                    } else {
                      dispatch(removeAllSelectedList());
                    }
                  }}
                  color={selectedAll === true ? GlobalStyles.colors.blue : null}
                  style={{ marginRight: 10 }}
                  disabled={list.count == 0 || listAll.length == 0}
                />
                <Text>Pilih Semua</Text>
              </View>
              {selectedId.length != 0 && (
                <Button
                  style={[styles.button]}
                  labelStyle={{ fontSize: 13 }}
                  mode="contained"
                  compact
                  onPress={() => {
                    Alert.alert(
                      "Peringatan !", // Judul dialog
                      "Surat yang dihapus akan hilang dan tidak bisa ditampilkan kembali. Apakah anda yakin untuk menghapusnya?", // Pesan dialog
                      [
                        {
                          text: "Tidak",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: "YA",
                          onPress: () => {
                            bulkDelete();
                          },
                        },
                      ],
                      { cancelable: true } // Menutup dialog dengan tap di luar (opsional)
                    );
                  }}
                >
                  Hapus Surat
                </Button>
              )}
            </View>
          ) : null}
          <FlatList
            keyExtractor={(item) => item.date}
            data={list?.results}
            renderItem={renderItem}
            ListEmptyComponent={listEmpty}
            refreshing={isLoading}
            onRefresh={refresh}
            onEndReached={loadMore}
          />
        </View>

        <BottomSheetModalProvider>
          <SafeAreaView>
            <BottomSheetModal
              name="filter"
              ref={bottomSheetModalRef}
              snapPoints={animatedSnapPoints}
              handleHeight={animatedHandleHeight}
              contentHeight={animatedContentHeight}
              index={0}
              style={{ borderRadius: 50 }}
              keyboardBehavior={
                Platform?.OS == "android" ? "fillParent" : "interactive"
              }
              keyboardBlurBehavior="restore"
              android_keyboardInputMode="adjust"
              backdropComponent={({ style }) => (
                <View
                  style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
                />
              )}
            >
              <BottomSheetView onLayout={handleContentLayout}>
                <View style={{ flex: 1, padding: 25 }}>
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 15, fontWeight: 500 }}>
                        Menyaring Surat Keluar
                      </Text>
                      <Text>Terkirim</Text>
                    </View>
                    <TouchableOpacity onPress={refresh}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          color: COLORS.danger,
                        }}
                      >
                        Reset
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginBottom: 10,
                      flex: 1,
                      marginTop: 20,
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.lighter,
                      }}
                    >
                      Rentang Tanggal
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <View
                          style={{
                            borderWidth: 1,
                            width:
                              device === "tablet" && orientation === "landscape"
                                ? 520
                                : device === "tablet" &&
                                  orientation === "potrait"
                                ? 330
                                : 150,
                            borderRadius: 4,
                            borderColor: COLORS.ExtraDivinder,
                            flexDirection: "row",
                          }}
                        >
                          <TextInput
                            multiline
                            numberOfLines={4}
                            maxLength={40}
                            placeholder="Mulai"
                            style={{ padding: 10, height: 40 }}
                            value={
                              startDate
                                ? moment(startDate).format("DD/MM/YYYY")
                                : "Mulai"
                            }
                            disabled
                            allowFontScaling={false}
                          />
                          <View
                            style={{
                              alignItems: "flex-end",
                              flex: 1,
                              marginRight: 10,
                              justifyContent: "center",
                            }}
                          >
                            <TouchableOpacity onPress={showStartDate}>
                              <Ionicons
                                name="calendar-outline"
                                size={24}
                                color={COLORS.grey}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      <View>
                        <View
                          style={{
                            borderWidth: 1,
                            width:
                              device === "tablet" && orientation === "landscape"
                                ? 520
                                : device === "tablet" &&
                                  orientation === "potrait"
                                ? 330
                                : 150,
                            borderRadius: 4,
                            borderColor: COLORS.ExtraDivinder,
                            flexDirection: "row",
                          }}
                        >
                          <TextInput
                            multiline
                            numberOfLines={4}
                            maxLength={40}
                            placeholder="Selesai"
                            style={{ padding: 10, height: 40 }}
                            value={
                              endDate
                                ? moment(endDate).format("DD/MM/YYYY")
                                : "Selesai"
                            }
                            disabled
                            allowFontScaling={false}
                          />
                          <View
                            style={{
                              alignItems: "flex-end",
                              flex: 1,
                              marginRight: 10,
                              justifyContent: "center",
                            }}
                          >
                            <TouchableOpacity onPress={showEndDate}>
                              <Ionicons
                                name="calendar-outline"
                                size={24}
                                color={COLORS.grey}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>

                    <DateTimePickerModal
                      isVisible={isEndDateVisible || isStartDateVisible}
                      mode="date"
                      display={Platform.OS == "android" ? "inline" : "spinner"}
                      style={{ width: "100%", height: 300 }}
                      onConfirm={(date) => {
                        isStartDateVisible
                          ? handleConfirmStart(date)
                          : isEndDateVisible
                          ? handleConfirmEnd(date)
                          : {};
                      }}
                      onCancel={() => {
                        isStartDateVisible
                          ? hideStartDate()
                          : isEndDateVisible
                          ? hideEndDate()
                          : {};
                      }}
                      minimumDate={
                        isEndDateVisible && startDate
                          ? startDate
                          : isEndDateVisible
                          ? new Date()
                          : null
                      }
                      maximumDate={new Date()}
                    />
                  </View>

                  <View
                    style={{
                      marginBottom: 10,
                      flex: 1,
                      marginTop: 10,
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.lighter,
                      }}
                    >
                      Perihal
                    </Text>
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      placeholder="Masukan Perihal"
                      style={{
                        borderWidth: 1,
                        height: 40,
                        width: "100%",
                        padding: 5,
                        borderRadius: 6,
                        borderColor: "#D0D5DD",
                      }}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      allowFontScaling={false}
                    />
                  </View>
                  <View
                    style={{
                      marginBottom: 10,
                      flex: 1,
                      marginTop: 10,
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.lighter,
                      }}
                    >
                      Jenis Surat
                    </Text>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && { borderColor: "blue" },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      iconStyle={styles.iconStyle}
                      itemTextStyle={{ fontSize: 13 }}
                      data={typeLetter}
                      maxHeight={300}
                      labelField="name"
                      valueField="name"
                      placeholder={!isFocus ? "Pilih Jenis Surat" : "..."}
                      value={selectedTypeLetter.name}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={(item) => {
                        setSelectedTypeLetter(item);
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.infoDanger,
                        height: 50,
                        marginVertical: 20,
                        borderRadius: 6,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        setIsSearchQuery(searchQuery);
                        if (!isSearchFilter) {
                          setList([]);
                        }
                        setIsSearchFilter(true);
                        bottomSheetAttachClose();
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: FONTSIZE.H1,
                          fontWeight: 500,
                        }}
                      >
                        Terapkan
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        backgroundColor: GlobalStyles.colors.tertiery80,
                        height: 50,
                        borderRadius: 6,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        bottomSheetAttachClose();
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: FONTSIZE.H1,
                          fontWeight: 500,
                        }}
                      >
                        Tutup
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </SafeAreaView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

export default SubmittedList;

const styles = StyleSheet.create({
  notFound: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  titleNotFound: {
    textAlign: "center",
    paddingVertical: 32,
    color: GlobalStyles.colors.primary,
  },
  containerRow: {
    flexDirection: "row",
    marginBottom: 16,
    paddingBottom: 16,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.colors.tertiery20,
  },
  titleFilter: {
    fontSize: GlobalStyles.font.xl,
    fontWeight: "bold",
  },
  titleReset: {
    fontSize: GlobalStyles.font.lg,
    fontWeight: "bold",
    color: GlobalStyles.colors.error80,
  },
  bottomsheetContent: {
    marginBottom: 12,
  },
  bottomsheetLabel: {
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bottomsheetInput: {
    borderRadius: 10,
    fontSize: 16,
    borderColor: GlobalStyles.colors.black50,
    borderWidth: 1,
    padding: 12,
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: GlobalStyles.colors.tertiery20,
    paddingTop: 16,
    marginTop: 16,
  },
  button: {
    backgroundColor: COLORS.infoDanger,
  },
  buttonText: {
    fontSize: GlobalStyles.font.lg,
    fontWeight: "bold",
  },
  headerList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: GlobalStyles.colors.tertiery70,
    color: GlobalStyles.colors.textWhite,
    borderRadius: 0,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  badge: { marginBottom: 5 },
  filter: { alignItems: "flex-start" },
  dropdown: {
    marginTop: 0,
    borderWidth: 1,
    minHeight: 40,
    padding: 5,
    borderRadius: 6,
    borderColor: "#D0D5DD",
  },
  placeholderStyle: {
    fontSize: 13,
  },
  selectedTextStyle: {
    fontSize: 13,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
