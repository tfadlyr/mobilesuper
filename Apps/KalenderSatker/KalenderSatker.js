import React, { useState, useRef } from "react";
import {
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  FONTSIZE,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, modeToNum } from "react-native-big-calendar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { getTokenValue } from "../../service/session";
import {
  getDetailKalenderSatker,
  getlistKalenderSatker,
} from "../../service/api";
import dayjs from "dayjs";
import ListEmpty from "../../components/ListEmpty";
import { CardListKalenderPersonal } from "../../components/CardListKalenderPersonal";
import { Dropdown } from "../../components/DropDown";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const KalenderSatker = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [datalist, setDataList] = useState([]);

  const [category, setCategory] = useState({
      key: "undangan",
      value: "Undangan"
  });
  
  const categoryfilter = [
    { key: "", value: "Semua Kategori"},
    { key: "undangan", value: "Undangan"},
    { key: "tugas", value: "Tugas"},
    { key: "perintah", value: "Perintah"},
    { key: "cuti", value: "Cuti"}
  ];

  const [mode, setMode] = useState({
    key: "month",
    value: "Bulan"
  });

  const modefilter = [
    { key: "month", value: "Bulan"},
    { key: "week", value: "Minggu"},
    { key: "day", value: "Hari"}
  ];

    const bottomSheetModalRef = useRef(null);
    const bottomSheetModalInfoRef = useRef(null);
    const bottomSheetModalAddRef = useRef(null);
    const bottomSheetModalAddCatRef = useRef(null);
    const bottomsheetModalGrupRef = useRef(null);

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
const bottomSheetCloseCat = () => {
    if (bottomSheetModalAddCatRef.current)
      bottomSheetModalAddCatRef.current?.close();
  };

  const BottomSheetSatker = () => {
    bottomsheetModalGrupRef.current?.present();
  };

  const bottomSheetCloseSatker = () => {
    if (bottomsheetModalGrupRef.current)
      bottomsheetModalGrupRef.current?.close();
  };

  const { profile } = useSelector((state) => state.superApps);

  const dispatch = useDispatch();
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);
  useEffect(() => {
    switchcategory();
  }, [token, year, month, category.key, mode.key]);

  const switchcategory = async() => {
    if (token !== "") {
      dispatch(
        getlistKalenderSatker({
          token: token,
          satker:
            profile?.structure?.organizations?.divisions?.departments
              ?.satker_code == undefined
              ? ""
              : profile.structure?.organizations?.divisions?.departments
                  .satker_code,
          month: month,
          year: year,
          category: category.key,
        })
      );
    }
  }

  const { satker } = useSelector((state) => state.KalenderSatker);

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const colorsTag = {
    tugas: {
      color: "#fb8072",
      background: "#ffebc7",
    },
    cuti: {
      color: "#0d6efd",
      background: "#c2dbfe",
    },
    undangan: {
      color: "#198771",
      background: "#c5e1d4",
    },
    perintah: {
      color: "#6c759c",
      background: "#dadcde",
    },
  };

  useEffect(() => {
    let newArr = [];
    if (satker.lists?.length > 0) {
      satker.lists?.map((child) => {
        if (child.kategori !== "perintah" && child.kategori !== "tugas") {
          const startDate = dayjs(child.start_date).format("YYYY-MM-DD");
          const endDate = dayjs(child.end_date).format("YYYY-MM-DD");
          let obj = {
            title: child.name,
            start: dayjs(startDate).set("hour", 10).set("minute", 0).toDate(),
            end: dayjs(endDate).set("hour", 10).set("minute", 0).toDate(),
            color: {
              backgroundColor: colorsTag[child.kategori].background,
              textColor: colorsTag[child.kategori].color,
            },
            id: child.id,
            kategori: child.kategori,
          };
          newArr.push(obj);
        } else {
          const startDate = dayjs(
            child?.extra_attributes?.tujuan[0]?.tangal_mulai
              ? child?.extra_attributes?.tujuan[0]?.tangal_mulai
              : null
          ).format("YYYY-MM-DD");
          const endDate = dayjs(
            child?.extra_attributes?.tujuan[
              child?.extra_attributes?.tujuan?.length - 1
            ]?.tanggal_selesai
          ).format("YYYY-MM-DD");
          let obj = {
            title: child.name,
            start: dayjs(startDate).set("hour", 10).set("minute", 0).toDate(),
            end: dayjs(endDate).set("hour", 10).set("minute", 0).toDate(),
            color: {
              backgroundColor: colorsTag[child.kategori].background,
              textColor: colorsTag[child.kategori].color,
            },
            id: child.id,
            kategori: child.kategori,
          };
          newArr.push(obj);
        }
      });
      setEvents(newArr);
    } else setEvents([]);
  }, [satker]);

  dayjs.locale("id");
  const today = new Date();
  const [date, setDate] = useState(today);

  const _onPrevDate = () => {
      if (mode.key === 'month') {
        
        setDate(
          dayjs(date)
            .add(dayjs(date).date() * -1, 'day')
            .toDate(),
        )
      } else {
        setDate(
          dayjs(date)
            .add(modeToNum(mode.key, date) * -1, 'day')
            .toDate(),
        )
      }
      console.log(category.value, ' - ',mode.value)
      switchcategory();
    }
  
    const _onNextDate = () => {
      setDate(dayjs(date).add(modeToNum(mode.key, date), 'day').toDate())
      console.log(category.value, ' - ',mode.value)
      switchcategory();
    }
  
    const _onToday = () => {
      setDate(today)
      switchcategory();
    }

  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailKalenderSatker(params));
  };

  const darkTheme = {
    palette: {
      primary: {
        main: "#6185d0",
        contrastText: "#000",
      },
    },
  };

  const { device } = useSelector((state) => state.apps);
  const dates = new Date(date); // Membuat objek Date dari string

  const month = dates.getMonth() + 1; // Mengambil bulan dan menambahkan 1
  const year = date.getFullYear();

  console.log(year); // Ini akan mencetak "9"
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <ScrollView>
      
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
              fontSize: fontSizeResponsive("Judul", device),
              fontWeight: 600,
              color: COLORS.white,
            }}
          >
            Kalender Satker
          </Text>
        </View>
      </View>
      <View
                    style={{
                      flexDirection: "row",
                      marginVertical: 20,
                      gap: 10,
                      zIndex: 1,
                    }}
                  >
      <View style={{ width: "90%", marginHorizontal: "5%" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              width: "100%",
              justifyContent: "center",
              borderRadius: 8,
              height: 45,
              paddingLeft: 20,
            }}
            onPress={() => {
              BottomSheetSatker();
            }}
          >
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              {category?.value && mode?.value ? `${category.value} - ${mode.value}` : 'Pilih Filter'}
            </Text>
          </TouchableOpacity>
          <BottomSheetModal
            ref={bottomsheetModalGrupRef}
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
              <View
                style={{
                  margin: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: FONTWEIGHT.bold,
                    color: COLORS.normal,
                  }}
                >
                  Pilih Filter
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    switchcategory();
                    bottomSheetCloseSatker();
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={device === "tablet" ? 40 : 24}
                    color={COLORS.normal}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ gap:6 , width: "90%", marginLeft: 20 }}>
                <Dropdown
                  data={categoryfilter}
                  placeHolder={"Pilih Kategori"}
                  backgroundColor={COLORS.white}
                  selected={category}
                  setSelected={setCategory}
                  borderWidth={1}
                  borderWidthValue={1}
                  borderwidthDrop={1}
                  borderColor={COLORS.ExtraDivinder}
                  borderColorDrop={COLORS.ExtraDivinder}
                  borderColorValue={COLORS.ExtraDivinder}
                />
                {category !== "" ? (
                  <>
                  <Dropdown
                    data={modefilter}
                    placeHolder={"Mode"}
                    backgroundColor={COLORS.white}
                    selected={mode}
                    setSelected={setMode}
                    borderWidth={1}
                    borderWidthValue={1}
                    borderwidthDrop={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                    
                  </>
                ) : (
                  <></>
                )}
              </View>
              {/* {kategoriField !== '' ? (
                <View style={{ marginTop: 20 }}>
                  <Dropdown
                    data={dropdown.subKategori[kategoriField.key]}
                    setSelected={setSubKategoriField}
                    placeHolder={'Pilih SubKategori'}
                  />
                </View>
              ) : (
                <></>
              )} */}
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </View>
      <View
        style={{
          width: "90%",
          marginHorizontal: "5%",
          backgroundColor: COLORS.white,
          padding: 10,
          borderRadius: 8,
          marginVertical: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 20,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              _onPrevDate();
            }}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: FONTSIZE.Judul,
              fontWeight: FONTWEIGHT.bold,
            }}
          >
            {dayjs(date).format("MMMM YYYY")}
          </Text>

          <TouchableOpacity
            onPress={() => {
              _onToday();
            }}
          >
            {/* <Ionicons
                      name="calendar"
                      size={24}
                      color={COLORS.primary}
                    /> */}
            <View
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: COLORS.white }}>Hari ini</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              _onNextDate();
            }}
          >
            <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <Calendar
          events={events}
          height={700}
          // mode="month"
          mode={mode.key}
          date={date}
          eventCellStyle={(event) => ({
            backgroundColor: event.color.backgroundColor,
            color: event.color.textColor,
          })}
          // renderEvent={(data) => {
          //   return (
          //     <View
          //       style={[
          //         styles.eventbox,
          //         { backgroundColor: data.color.backgroundColor },
          //       ]}
          //     >
          //       <View
          //         style={{
          //           width: "100%",
          //           overflow: "hidden",
          //           textOverflow: "ellipsis",
          //         }}
          //       >
          //         <Text
          //           noWrap
          //           // component={'i'}
          //           style={{
          //             margin: "0 !important",
          //             fontWeight: 500,
          //             color: data.color.textColor,
          //           }}
          //         >
          //           {data.title}
          //         </Text>
          //       </View>
          //     </View>
          //   );
          // }}
          locale="id"
          activeDate={date}
          onPressEvent={(item) => {
            getDetail(item.id);
            navigation.navigate("DetailKalenderSatker");
          }}
          theme={darkTheme}
          onPressMoreLabel={(event) => {
            setDataList(event);
            setModal(true);
          }}
        />

        <View>
          <Text
            style={{
              marginTop: 20,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            Informasi Kalender :
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View>
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: "#ffebc7",
                  }}
                />
                <Text
                  style={{
                    width: device === "tablet" ? 250 : 100,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Kategori Surat Tugas
                </Text>
              </View>

              <View
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: "#dadcde",
                  }}
                />
                <Text
                  style={{
                    width: device === "tablet" ? 250 : 100,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Kategori Surat Perintah
                </Text>
              </View>
            </View>

            <View>
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: "#c5e1d4",
                  }}
                />
                <Text
                  style={{
                    width: device === "tablet" ? 250 : 100,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Kategori Surat Undangan
                </Text>
              </View>

              <View
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: "#c2dbfe",
                  }}
                />
                <Text
                  style={{
                    width: device === "tablet" ? 250 : 100,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Kategori Surat Cuti
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <TouchableOpacity
          style={[
            Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
            styles.backdrop,
          ]}
        />
        <View
          style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "90%",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                marginHorizontal: 10,
                marginTop: 20,
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
                }}
              >
                Kalender Satker
              </Text>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setModal(false);
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={COLORS.lighter}
                />
              </TouchableOpacity>
            </View>

            <View>
              <FlatList
                data={datalist}
                renderItem={({ item }) => (
                  <CardListKalenderPersonal
                    item={item}
                    token={token}
                    setModal={setModal}
                  />
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => <ListEmpty />}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  eventbox: {
    width: "100%",
    height: 25,
    padding: 5,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    borderRadius: 5,
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
