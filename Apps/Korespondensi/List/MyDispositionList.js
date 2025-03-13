import { useNavigation } from "@react-navigation/native";
import { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Button, Chip, IconButton } from "react-native-paper";
import CardList from "../../../components/UI/CardList";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";
import { initData } from "../../../utils/list";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import SearchFilter from "../../../components/UI/SearchFilter";
import { Config } from "../../../constants/config";
import LottieView from "lottie-react-native";

function MyDispositionList() {
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
  const snapPoints = useMemo(() => [50, "100%"], []);

  const willFocusSubscription = navigation.addListener("focus", () => {
    filter(1);
  });

  useEffect(() => {
    filter(1);
    return willFocusSubscription;
  }, [startDate, endDate, isSearchQuery, isSearchFilter]);

  async function getAgendaMyDispo(page) {
    setIsLoading(true);
    try {
      let response = await getHTTP(
        nde_api.agendamydispo.replace("{$page}", page)
      );
      let data = initData(list, response.data);
      setList(data);
      setIsLoading(false);
    } catch (error) {
      handlerError(error, "Peringatan!", "My Disposisi tidak berfungsi");
      setIsLoading(false);
    }
  }

  async function filter(page) {
    setIsLoading(true);
    try {
      if (startDate == null && endDate == null && searchQuery.length == 0) {
        getAgendaMyDispo(1);
      } else if (
        !isSearchFilter &&
        (startDate != null || endDate != null || searchQuery.length != 0)
      ) {
      } else {
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
        if (isSearchQuery.length == 0) {
          word = "";
        } else {
          word = isSearchQuery;
        }
        let url = nde_api.agendamydispo;
        url =
          url + "&start_date=" + start + "&end_date=" + end + "&query=" + word;
        let response = await getHTTP(url.replace("{$page}", page));
        if (response) {
          setIsSearchFilter(true);
          let data = initData(list, response.data);
          setList(data);
          bottomSheetModalRef.current?.dismiss();
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsSearchFilter(false);
      bottomSheetModalRef.current?.dismiss();
      setIsLoading(false);
    }
  }

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
          ? "My Disposition Letter not found"
          : list?.count == 0
          ? "You don't have My Disposition Letter"
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
            key={data.id}
            data={data}
            tipe="agendamydispo"
            onPress={() => {
              navigation.navigate("DispositionDetail", {
                id: data.id,
                title: "My Disposition\nDetail",
              });
            }}
          />
        ))}
      </View>
    </>
  );

  function loadMore() {
    if (list?.next != null) {
      if (isSearchFilter) {
        filter(list?.next);
      } else {
        getAgendaMyDispo(list?.next);
      }
    }
  }
  function refresh() {
    setIsLoading(true);
    setStartDate();
    setEndDate();
    setSearchQuery("");
    setIsSearchFilter(false);
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
            if (startDate == null && endDate == null) {
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
      <View
        style={{ flex: 1, backgroundColor: GlobalStyles.colors.tertiery10 }}
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
        {isSearchFilter && (
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
                  borderLeftWidth: 0,
                  backgroundColor: GlobalStyles.colors.textWhite,
                  color: GlobalStyles.colors.textBlack,
                  marginBottom: 8,
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
                <View style={[styles.containerRow]}>
                  <Text style={styles.titleFilter}>Filter</Text>
                  <TouchableOpacity onPress={refresh}>
                    <Text style={styles.titleReset}>Reset</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.bottomsheetContent}>
                  <Text style={styles.bottomsheetLabel}>Subject</Text>
                  <BottomSheetTextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.bottomsheetInput}
                    allowFontScaling={false}
                  />
                </View>
                <View style={styles.bottomsheetContent}>
                  <Text style={styles.bottomsheetLabel}>Tanggal Mulai</Text>
                  <Button
                    mode="outlined"
                    textColor={GlobalStyles.colors.tertiery80}
                    onPress={showStartDate}
                  >
                    {startDate
                      ? moment(startDate).format("DD/MM/YYYY")
                      : "Pilih Tanggal Mulai"}
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
                <View style={styles.bottomsheetContent}>
                  <Text style={styles.bottomsheetLabel}>Tanggal Selesai</Text>
                  <Button
                    mode="outlined"
                    textColor="black"
                    onPress={showEndDate}
                  >
                    {endDate
                      ? moment(endDate).format("DD/MM/YYYY")
                      : "Pilih Tanggal Selesai"}
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
                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => {
                      setIsSearchQuery(searchQuery);
                      if (!isSearchFilter) {
                        setList([]);
                      }
                      setIsSearchFilter(true);
                      bottomSheetModalRef.current?.dismiss();
                    }}
                  >
                    <Text style={styles.buttonText}>Apply</Text>
                  </Button>
                  <Button
                    mode="outline"
                    textColor={GlobalStyles.colors.tertiery80}
                    onPress={() => {
                      bottomSheetModalRef.current?.dismiss();
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Button>
                </View>
              </View>
            </BottomSheetModal>
          </View>
        </>
      </BottomSheetModalProvider>
    </>
  );
}

export default MyDispositionList;

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
