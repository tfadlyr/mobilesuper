import { useNavigation } from "@react-navigation/native";
import { useMemo, useRef, useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Button, Chip, IconButton, Searchbar } from "react-native-paper";
import CardList from "../../../components/UI/CardList";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";
import bgSearch from "../../../assets/superApp/images/bg-search.svg";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import SearchFilter from "../../../components/UI/SearchFilter";
import { SvgXml } from "react-native-svg";
import { Config } from "../../../constants/config";
import LottieView from "lottie-react-native";

function SearchGlobalList() {
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
  const animation = useRef(null);
  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => [50, 450], []);

  const willFocusSubscription = navigation.addListener("focus", () => {
    if (isSearchFilter && (searchQuery.length != 0 || startDate != null)) {
      getSearchGlobal(1);
    } else {
      setIsSearchFilter(false);
      setList([]);
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (isSearchFilter && (searchQuery.length != 0 || startDate != null)) {
      getSearchGlobal(1);
    } else {
      setIsLoading(false);
    }
    return willFocusSubscription;
  }, [isSearchQuery, isSearchFilter]);

  async function getSearchGlobal(page) {
    setIsLoading(true);
    try {
      if (startDate == null && endDate == null && searchQuery.length == 0) {
        setIsSearchFilter(false);
        setSearchQuery("");
        setIsSearchQuery("");
        setList([]);
      } else {
        setIsSearchQuery(searchQuery);
        let start;
        let end;
        let word;
        if (startDate == undefined || startDate == null) {
          start = "";
        } else {
          start = moment(startDate).format("DD/MM/YYYY");
        }
        if (endDate == undefined || endDate == null) {
          if (startDate == undefined || startDate == null) {
            end = "";
          } else {
            end = moment(new Date()).format("DD/MM/YYYY");
            setEndDate(new Date());
          }
        } else {
          end = moment(endDate).format("DD/MM/YYYY");
        }
        if (searchQuery.length == 0) {
          word = "";
        } else {
          word = searchQuery;
        }
        let url = nde_api.searchglobal + "?";
        url =
          url +
          "start_date=" +
          start +
          "&end_date=" +
          end +
          "&query=" +
          word +
          "&page=" +
          page;
        let response;
        response = await getHTTP(url);
        if (response) {
          setIsSearchFilter(true);
          setList(response.data);
          bottomSheetModalRef.current?.dismiss();
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsSearchFilter(false);
      bottomSheetModalRef.current?.dismiss();
      handlerError(error, "Peringatan!", "Pencarian tidak berfungsi");
      setIsLoading(false);
    }
  }
  const defaultEmpty = (
    <View style={styles.notFound}>
      <SvgXml width="90%" xml={bgSearch} />
    </View>
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
          ? "Loading..."
          : isSearchFilter
          ? "Letter not found"
          : list?.count == 0
          ? "You don't have Letter"
          : "Loading..."}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <>
      <Text style={styles.headerList}>{item.date}</Text>
      <View style={{ marginBottom: 16 }}>
        {item.children.map((data) => (
          <CardList
            key={data.agenda_id != "0" ? data.agenda_id : data.document_id}
            data={data}
            tipe="searchglobal"
            onPress={() => {
              if (data?.type == "incoming") {
                navigation.navigate("IncomingDetail", {
                  id: data.agenda_id,
                  title: "Incoming Letter\nDetail",
                });
              } else if (data?.type == "disposition") {
                navigation.navigate("DispositionDetail", {
                  id: data.agenda_id,
                  title: "Disposition Letter\nDetail",
                });
              } else if (data?.type == "outgoing") {
                navigation.navigate("NeedFollowUpDetail", {
                  id: data.document_id,
                  title: "Need Follow Up Letter\nDetail",
                });
              } else if (data?.type == "submitted") {
                navigation.navigate("SubmittedDetail", {
                  id: data.agenda_id,
                  title: "Submitted Letter\nDetail",
                });
              }
            }}
          />
        ))}
      </View>
    </>
  );

  function loadMore() {
    if (list?.next != null) {
      getSearchGlobal(list?.next);
    }
  }
  function refresh() {
    setIsLoading(true);
    setSearchQuery("");
    setIsSearchQuery("");
    setIsSearchFilter(false);
    setList([]);
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
            setList([]);
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
    setEndDate(date);
    hideEndDate();
  };

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <>
      {/* {isLoading && loadingOverlay} */}
      <View style={{ flex: 1 }}>
        {/* <SearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          showBottomFilter={showBottomFilter}
          getSearch={getSearchGlobal}
        /> */}
        <Searchbar
          placeholder="Cari..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={() => getSearchGlobal(1)}
          onSubmitEditing={() => getSearchGlobal(1)}
          clearIcon={clearSearch}
        />
        {isSearchFilter && (
          <View
            style={{
              flexDirection: "row",
              backgroundColor: GlobalStyles.colors.tertiery10,
              paddingVertical: 8,
            }}
          >
            <Text
              style={[
                styles.headerList,
                {
                  borderLeftWidth: 0,
                  backgroundColor: GlobalStyles.colors.textWhite,
                  color: GlobalStyles.colors.textBlack,
                },
              ]}
            >
              {isSearchQuery.length != 0 && startDate == null
                ? "Search: "
                : "Filter : "}
            </Text>
            <View>
              {startDate && (
                <Chip
                  style={styles.badge}
                  onClose={() => {
                    setStartDate(null);
                    setEndDate(null);
                    if (searchQuery.length == 0) {
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
                    if (startDate == null && endDate == null) {
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
        {list?.length == 0 && searchQuery.length != 0 && isSearchFilter && (
          <View style={styles.notFound}>
            <LottieView
              autoPlay
              ref={animation}
              style={[styles.titleNotFound, { width: "100%", height: 200 }]}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={Config.notFound}
            />
            <Text style={styles.titleNotFound}>Letter not found</Text>
          </View>
        )}
        <FlatList
          keyExtractor={(item) => item.date}
          data={list?.results}
          renderItem={renderItem}
          ListEmptyComponent={
            isSearchQuery.length != 0 ? listEmpty : defaultEmpty
          }
          refreshing={isLoading}
          onRefresh={refresh}
          onEndReached={loadMore}
        />
      </View>
      <BottomSheetModalProvider>
        <>
          <View>
            <BottomSheetModal
              name="filter"
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              keyboardBehavior={
                Platform?.OS == "android" ? "fillParent" : "interactive"
              }
              keyboardBlurBehavior="restore"
              android_keyboardInputMode="adjust"
            >
              <View style={styles.contentContainer}>
                <View
                  style={[
                    styles.containerRow,
                    { marginBottom: 8, justifyContent: "space-between" },
                  ]}
                >
                  <Text>Filter</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setStartDate();
                      setEndDate();
                      setSearchQuery("");
                      getSearchGlobal(1);
                      bottomSheetModalRef.current?.dismiss();
                    }}
                  >
                    <Text>Reset</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 8 }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text>Tgl Mulai</Text>
                  </View>
                  <Button
                    mode="outlined"
                    textColor="black"
                    onPress={showStartDate}
                  >
                    {startDate
                      ? moment(startDate).format("DD/MM/YYYY")
                      : "Pilih Tgl Mulai"}
                  </Button>
                  <DateTimePickerModal
                    isVisible={isStartDateVisible}
                    mode="date"
                    display={Platform.OS == "android" ? "inline" : "spinner"}
                    style={{ width: "100%", height: 300 }}
                    onConfirm={handleConfirmStart}
                    onCancel={hideStartDate}
                    maximumDate={new Date()}
                  />
                </View>
                <View style={{ marginBottom: 8 }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text>Tgl Selesai</Text>
                  </View>
                  <Button
                    mode="outlined"
                    textColor="black"
                    onPress={showEndDate}
                  >
                    {endDate
                      ? moment(endDate).format("DD/MM/YYYY")
                      : "Pilih Tgl Selesai"}
                  </Button>
                  <DateTimePickerModal
                    isVisible={isEndDateVisible}
                    mode="date"
                    display={Platform.OS == "android" ? "inline" : "spinner"}
                    style={{ width: "100%", height: 300 }}
                    onConfirm={handleConfirmEnd}
                    onCancel={hideEndDate}
                    minimumDate={startDate ? startDate : new Date()}
                    maximumDate={new Date()}
                  />
                </View>

                <View style={{ marginBottom: 8 }}>
                  <Text>Subject</Text>
                </View>
                <BottomSheetTextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.input}
                  allowFontScaling={false}
                />
                <Button
                  mode="contained"
                  style={[
                    {
                      marginBottom: 16,
                      backgroundColor: GlobalStyles.colors.approve,
                    },
                  ]}
                  onPress={() => getSearchGlobal(1)}
                >
                  Apply
                </Button>
                <Button
                  mode="contained"
                  style={[
                    {
                      backgroundColor: GlobalStyles.colors.gray500,
                      marginBottom: 16,
                    },
                  ]}
                  onPress={() => {
                    bottomSheetModalRef.current?.dismiss();
                  }}
                >
                  Cancel
                </Button>
              </View>
            </BottomSheetModal>
          </View>
        </>
      </BottomSheetModalProvider>
    </>
  );
}

export default SearchGlobalList;

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
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
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
    backgroundColor: GlobalStyles.colors.approve,
    marginBottom: 16,
    borderTopWidth: 1,
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
});
