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
  Dimensions,
  Alert,
  useWindowDimensions,
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
import { useReducedMotion } from "react-native-reanimated";
import * as LocalAuthentication from "expo-local-authentication";
import { setOrganization, setProfile } from "../../../store/profile";

function NeedSignList({ route }) {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDateVisible, setStartDateVisibility] = useState(false);
  const [isEndDateVisible, setEndDateVisibility] = useState(false);
  const [isSearchFilter, setIsSearchFilter] = useState(false);
  const [isSearchQuery, setIsSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionList, setDivisionList] = useState([
    { id: "", name: "SEMUA UNIT KERJA" },
  ]);
  const [selectedDivisi, setSelectedDivisi] = useState({
    id: "",
    name: "SEMUA UNIT KERJA",
  });
  const [selectedTypeLetter, setSelectedTypeLetter] = useState({
    id: "",
    name: "Semua Jenis Surat",
  });
  const typeLetter = useSelector((state) => state.listbulk.typeLetter);
  const { profile } = useSelector((state) => state.profile);
  const { selectedAll, listAll } = useSelector((state) => state.listbulk);
  const selectedId = useSelector((state) => state.listbulk.list);
  const [isFocus, setIsFocus] = useState();
  const { width: screenWidth } = Dimensions.get("window");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const unread = route.params.unread;
  const animation = useRef(null);
  const bottomSheetModalRef = useRef(null);
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);
  const reducedMotion = useReducedMotion();

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    getProfile();
  }, [token]);
  async function getProfile() {
    setIsLoading(true);
    try {
      //get isCounter
      const response = await getHTTP(nde_api.profile);
      dispatch(setProfile(response.data));
      dispatch(setOrganization(response.data));
      setIsLoading(false);
    } catch (error) {
      // console.log(error.response);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setList([]);
      dispatch(removeAllSelectedList());
      refresh();
    }, [])
  );
  useEffect(() => {
    if (divisionList.length == 1) {
      getDivisionList();
    }
  }, [divisionList]);
  useEffect(() => {
    filter(1);
    dispatch(removeAllSelectedList());
  }, [
    startDate,
    endDate,
    isSearchQuery,
    isSearchFilter,
    selectedDivisi,
    selectedTypeLetter,
  ]);

  async function getDivisionList() {
    try {
      let response = await getHTTP(nde_api.divisionList);
      let gabung = divisionList.concat(response.data);
      setDivisionList(gabung);
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
          "Daftar Divisi pada penyaringan tidak berfungsi"
        );
      }
    }
  }
  async function getNeedFollowUp(page) {
    setIsLoading(true);
    try {
      let response = await getHTTP(
        nde_api.needfollowup.replace("{$page}", page + "&sign=1")
      );
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
          "List Surat Keluar Perlu TTD Elektronik tidak berfungsi"
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
        selectedDivisi.id == undefined &&
        selectedTypeLetter.name == "Semua Jenis Surat"
      ) {
        getNeedFollowUp(1);
      } else if (
        !isSearchFilter &&
        (startDate != null ||
          endDate != null ||
          searchQuery.length != 0 ||
          selectedDivisi.id != undefined ||
          selectedTypeLetter.name != "Semua Jenis Surat")
      ) {
      } else {
        let start;
        let end;
        let word;
        let division = "";
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
          word = "&search=" + isSearchQuery;
        }
        if (selectedDivisi.id == undefined) {
          division = "";
        } else {
          division = "&division=" + selectedDivisi.id;
        }
        if (selectedTypeLetter.name == "Semua Jenis Surat") {
          typeletter = "";
        } else {
          typeletter = "&type_letter=" + selectedTypeLetter.name;
        }
        let url = nde_api.needfollowup;
        url = url + start + end + word + division + typeletter + "&sign=1";
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
          "List Surat Keluar Perlu TTD Elektronik tidak berfungsi"
        );
      }
    }
  };

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
            tipe="needfollowup"
            is_pass={profile.is_pass}
            onPress={() => {
              navigation.navigate("NeedFollowUpDetail", {
                id: data.id,
                sign: true,
                title:
                  device === "tablet"
                    ? "Detail Surat Keluar Perlu TTD Elektronik"
                    : "Detail Surat Keluar\nPerlu TTD Elektronik",
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
          : isSearchFilter
          ? "Dokumen tidak ditemukan"
          : list?.count == 0
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
        getNeedFollowUp(list?.next);
      }
    }
  }
  function refresh() {
    setIsLoading(true);
    setStartDate();
    setEndDate();
    dispatch(setSelectedAll(false));
    setSearchQuery("");
    setSelectedDivisi({});
    setSelectedTypeLetter({
      id: "",
      name: "Semua Jenis Surat",
    });
    setIsSearchFilter(false);
    if (!isSearchFilter) {
      getNeedFollowUp(1);
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
            dispatch(setSelectedAll(false));
            if (
              selectedTypeLetter.name == "Semua Jenis Surat" &&
              selectedDivisi.id == undefined &&
              startDate == null
            ) {
              setIsSearchFilter(false);
            } else {
              setIsSearchFilter(true);
            }
            if (
              startDate == null &&
              endDate == null &&
              selectedTypeLetter.name == "Semua Jenis Surat" &&
              selectedDivisi.id == undefined
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

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
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
  async function bulkApprove() {
    try {
      setIsLoading(true);
      let payload = { ids: selectedId };
      let response = await postHTTP(nde_api.letterbulkapprove, payload);
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
      handlerError(
        error,
        "Peringatan!",
        "TTD Elektronik semua tidak berfungsi!"
      );
      //   Alert.alert("Tes", error);
      setIsLoading(false);
    }
  }

  //FINGERPRINT

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    // if (!isBiometricAvailable) return bottomSheetModalRef.current?.present();
    if (!isBiometricAvailable) return bulkApprove();

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    // if (!savedBiometrics) return bottomSheetModalRef?.current?.present();
    if (!savedBiometrics) return bulkApprove();

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });
    // Log the user in on success
    if (biometricAuth.success) {
      bulkApprove();
    }
  };

  const { width: screenWidthFilter, height: screenHeightFilter } =
    useWindowDimensions();

  let orientation = getOrientation(screenWidthFilter, screenHeightFilter);

  const { device } = useSelector((state) => state.apps);
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
          <View
            style={{
              backgroundColor: COLORS.white,
              marginBottom:
                isSearchFilter &&
                (startDate != null ||
                  selectedTypeLetter.name != "Semua Jenis Surat")
                  ? 0
                  : 16,
            }}
          >
            {divisionList && profile?.is_pass == "true" && (
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { borderColor: "blue" },
                  { width: device === "tablet" ? "96.5%" : "95%" },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={{ fontSize: 13 }}
                data={divisionList}
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder={!isFocus ? "Pilih Unit Kerja" : "..."}
                value={divisionList[0]}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setSelectedDivisi(item);
                  setIsFocus(false);
                  setIsSearchQuery(searchQuery);
                  setList([]);
                  dispatch(setSelectedAll(false));
                  setIsSearchFilter(true);
                }}
              />
            )}
            {profile?.is_pass == "true" && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  maxWidth: "95%",
                  alignItems: "center",
                  margin: 10,
                  justifyContent: "space-between",
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
                    color={
                      selectedAll === true ? GlobalStyles.colors.blue : null
                    }
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
                    onPress={handleBiometricAuth}
                  >
                    Tanda Tangan
                  </Button>
                )}
              </View>
            )}
          </View>
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
                  selectedDivisi.id == undefined &&
                  selectedTypeLetter.name == "Semua Jenis Surat"
                    ? "Cari: "
                    : "Saring : "}
                </Text>
                <View style={[styles.filter, { width: screenWidth - 70 }]}>
                  {startDate && (
                    <Chip
                      style={styles.badge}
                      onClose={() => {
                        setStartDate(null);
                        setEndDate(null);
                        if (
                          searchQuery.length == 0 &&
                          selectedDivisi.id == undefined &&
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
                  {selectedTypeLetter.name != "Semua Jenis Surat" && (
                    <Chip
                      style={styles.badge}
                      onClose={() => {
                        setSelectedTypeLetter({
                          id: "",
                          name: "Semua Jenis Surat",
                        });
                        if (
                          searchQuery.length == 0 &&
                          selectedDivisi.id == undefined &&
                          startDate == null
                        ) {
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
                  {isSearchQuery && (
                    <Chip
                      style={styles.badge}
                      onClose={() => {
                        setSearchQuery("");
                        setIsSearchQuery("");
                        if (
                          startDate == null &&
                          endDate == null &&
                          selectedDivisi.id == undefined &&
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
                </View>
              </View>
            )}
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
              animateOnMount={!reducedMotion}
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
                      <Text>Perlu TTD Elektronik</Text>
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
                        styles.dropdown2,
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

export default NeedSignList;

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
  filter: { alignItems: "flex-start" },
  badge: { marginBottom: 5 },
  dropdown: {
    margin: 10,
    marginTop: 0,
    borderWidth: 1,
    minHeight: 40,
    padding: 5,
    borderRadius: 6,
    borderColor: "#D0D5DD",
  },
  dropdown2: {
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
