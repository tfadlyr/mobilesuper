import React, { useEffect, useRef, useState } from "react";
import { FlatList, ScrollView, TextInput, View } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import { Calendar, modeToNum } from "react-native-big-calendar";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { CardAgenda } from "../../components/CardAgenda";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import { Dropdown } from "../../components/DropDown";
import { useDispatch, useSelector } from "react-redux";
import { setAcara, setAgenda } from "../../store/GrupKalender";
import { setKategori } from "../../store/GrupKalender";
import { setSubKategori } from "../../store/GrupKalender";
import {} from "react-native-safe-area-context";
import { getTokenValue } from "../../service/session";
import {
  getDetailGrup,
  getListAcara,
  getListAgendaAcara,
  getListGrup,
} from "../../service/api";
import { TouchableHighlight } from "react-native";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { ShimmerCardAgenda } from "../../components/CardAgenda/ShimmerCardAgenda";

export const GrupKalender = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState("");
  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalInfoRef = useRef(null);
  const bottomSheetModalAddRef = useRef(null);
  const bottomSheetModalAddCatRef = useRef(null);
  const bottomsheetModalGrupRef = useRef(null);
  const [token, setToken] = useState("");
  const [kegiatan, setKegiatan] = useState("");
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

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

  const bottomSheetinfo = () => {
    bottomSheetModalInfoRef.current?.present();
  };

  const bottomSheetAdd = () => {
    bottomSheetModalAddRef.current?.present();
  };

  const bottomSheetAddCat = () => {
    bottomSheetModalAddCatRef.current?.present();
  };

  const bottomSheetClose = () => {
    if (bottomSheetModalAddRef.current) bottomSheetModalAddRef.current?.close();
  };

  const bottomSheetCloseCat = () => {
    if (bottomSheetModalAddCatRef.current)
      bottomSheetModalAddCatRef.current?.close();
  };

  const bottomSheetGrup = () => {
    bottomsheetModalGrupRef.current?.present();
  };

  const bottomSheetCloseGrup = () => {
    if (bottomsheetModalGrupRef.current)
      bottomsheetModalGrupRef.current?.close();
  };

  const [kategoriField, setKategoriField] = useState("");
  const [subkategoriField, setSubKategoriField] = useState("");

  const [current, setCurrent] = useState();
  const [events, setEvents] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getListGrup(token));
    }
    dispatch(setAcara([]));
  }, [token]);

  const { agenda, acara, loading } = useSelector((state) => state.grupKalender);

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

  useEffect(() => {
    let newArr = [];
    if (acara.lists?.length > 0) {
      acara.lists?.map((child) => {
        const startDate = dayjs(child.start_date).format("YYYY-MM-DD");
        const endDate = dayjs(child.end_date).format("YYYY-MM-DD");
        let obj = {
          title: child.name || child.title,
          start: dayjs(startDate).set("hour", 10).set("minute", 0).toDate(),
          end: dayjs(endDate).set("hour", 10).set("minute", 0).toDate(),
          color: {
            backgroundColor: stringToColor(child.pic.title.name),
          },
        };
        newArr.push(obj);
      });
      setEvents(newArr);
    } else setEvents([]);
  }, [acara]);

  const datagrup = () => {
    let arr = [];
    agenda.lists.map((item) => {
      arr.push({
        key: item.id,
        value: item.name,
      });
    });
    return arr;
  };

  dayjs.locale("id");
  const today = new Date();
  const [date, setDate] = useState(today);

  const _onPrevDate = () => {
    setDate(
      dayjs(date)
        .add(dayjs(date).date() * -1, "day")
        .toDate()
    );
  };

  const _onNextDate = () => {
    setDate(dayjs(date).add(modeToNum("month", date), "day").toDate());
  };

  const _onToday = () => {
    setDate(today);
  };
  const { device } = useSelector((state) => state.apps);

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
                  onPress={() => navigation.goBack()}
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
                  Kalender
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
                    bottomSheetGrup();
                  }}
                >
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    Pilih Grup
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
                        Pilih Grup
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          bottomSheetCloseGrup();
                        }}
                      >
                        <Ionicons
                          name="close-outline"
                          size={device === "tablet" ? 40 : 24}
                          color={COLORS.normal}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: "90%", marginLeft: 20 }}>
                      <Dropdown
                        data={datagrup()}
                        setSelected={setKategoriField}
                        placeHolder={"Pilih Kategori"}
                        borderWidth={1}
                        borderWidthValue={1}
                        borderwidthDrop={1}
                        borderColor={COLORS.ExtraDivinder}
                        borderColorDrop={COLORS.ExtraDivinder}
                        borderColorValue={COLORS.ExtraDivinder}
                      />
                      {kategoriField !== "" ? (
                        <>
                          <View
                            style={{
                              marginVertical: 20,
                              flexDirection: "row",
                              gap: 10,
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 20,
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                              }}
                              onPress={() => {
                                dispatch(
                                  getListAcara({
                                    token: token,
                                    id: kategoriField.key,
                                  })
                                );
                                setKegiatan("acara kalender");
                                bottomSheetCloseGrup();
                              }}
                            >
                              <Ionicons
                                name="calendar"
                                size={device === "tablet" ? 40 : 24}
                                color={COLORS.grey}
                              />
                              <Text
                                style={{
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                Acara Kalender
                              </Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => {
                              dispatch(getDetailGrup({ token: token, id: kategoriField.key }))
                              navigation.navigate('TambahAgenda')
                            }}>
                              <Ionicons name='add-outline' size={24} color={COLORS.primary} />
                            </TouchableOpacity> */}
                          </View>

                          <TouchableOpacity
                            style={{
                              marginBottom: 20,
                              flexDirection: "row",
                              gap: 10,
                              alignItems: "center",
                            }}
                            onPress={() => {
                              dispatch(
                                getListAgendaAcara({
                                  token: token,
                                  id: kategoriField.key,
                                })
                              );
                              setKegiatan("acara agenda");
                              bottomSheetCloseGrup();
                            }}
                          >
                            <Ionicons
                              name="calendar-outline"
                              size={device === "tablet" ? 40 : 24}
                              color={COLORS.grey}
                            />
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              Acara agenda Rapat
                            </Text>
                          </TouchableOpacity>
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
              {/* <View
                style={{
                  backgroundColor: "white",
                  width: "11%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                  height: 45,
                }}
              >
                <TouchableOpacity onPress={bottomSheetinfo}>
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
                <BottomSheetModal
                  ref={bottomSheetModalInfoRef}
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
                    <View style={{ marginVertical: 20, marginLeft: 20 }}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.H2,
                          fontWeight: FONTWEIGHT.bold,
                          color: COLORS.lighter,
                        }}
                      >
                        Warna Kalender Berdasarkan PIC{" "}
                      </Text>
                    </View>

                    <View
                      style={{
                        marginHorizontal: 20,
                        marginBottom: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          height: 18,
                          width: 18,
                          backgroundColor: COLORS.danger,
                          borderRadius: 4,
                        }}
                      />
                      <Text>Direktur A</Text>
                    </View>

                    <View
                      style={{
                        marginHorizontal: 20,
                        marginBottom: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          height: 18,
                          width: 18,
                          backgroundColor: COLORS.info,
                          borderRadius: 4,
                        }}
                      />
                      <Text>Direktur B</Text>
                    </View>

                    <View
                      style={{
                        marginHorizontal: 20,
                        marginBottom: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          height: 18,
                          width: 18,
                          backgroundColor: COLORS.warning,
                          borderRadius: 4,
                        }}
                      />
                      <Text>Direktur C</Text>
                    </View>

                    <View
                      style={{
                        marginHorizontal: 20,
                        marginBottom: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          height: 18,
                          width: 18,
                          backgroundColor: COLORS.orange,
                          borderRadius: 4,
                        }}
                      />
                      <Text>Direktur D</Text>
                    </View>

                    <View
                      style={{
                        marginHorizontal: 20,
                        marginBottom: 40,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          height: 18,
                          width: 18,
                          backgroundColor: COLORS.success,
                          borderRadius: 4,
                        }}
                      />
                      <Text>Direktur E</Text>
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>
              </View> */}
            </View>

            <View
              style={{
                marginHorizontal: device === "tablet" ? 60 : 20,
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <Text
                  style={{
                    fontSize: fontSizeResponsive("Judul", device),
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  {kategoriField !== "" ? kategoriField.value : null}
                </Text>
              )}

              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      getDetailGrup({ token: token, id: kategoriField.key })
                    );
                    navigation.navigate("DetailGrup");
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.info,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {kategoriField !== "" ? "Lihat Detail" : null}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View>
              <View
                style={{
                  width: "90%",
                  marginHorizontal: "5%",
                  backgroundColor: COLORS.white,
                  padding: 10,
                  borderRadius: 8,
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
                    <Ionicons
                      name="chevron-back"
                      size={device === "tablet" ? 40 : 24}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{
                      fontSize: fontSizeResponsive("Judul", device),
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
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Hari ini
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      _onNextDate();
                    }}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={device === "tablet" ? 40 : 24}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
                <Calendar
                  events={events}
                  height={500}
                  mode="month"
                  date={date}
                  eventCellStyle={(x) => x.color}
                  locale="id"
                  activeDate={date}
                />
              </View>
            </View>

            <View
              style={{
                marginTop: 20,
                marginHorizontal: device === "tablet" ? 60 : 20,
                marginBottom: 20,
              }}
            >
              {kegiatan === "acara kalender" ? (
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Acara Kalender
                </Text>
              ) : kegiatan === "acara agenda" ? (
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Acara Agenda Rapat
                </Text>
              ) : (
                <></>
              )}
              <View style={{ marginVertical: 20 }}>
                {loading ? (
                  <>
                    <ShimmerCardAgenda />
                    <ShimmerCardAgenda />
                  </>
                ) : (
                  <>
                    {acara.lists.slice(0, 2).map((item) => {
                      return (
                        <View key={item.id}>
                          <CardAgenda
                            item={item}
                            stringToColor={stringToColor}
                            token={token}
                            kegiatan={kegiatan}
                            idKategori={kategoriField.key}
                          />
                        </View>
                      );
                    })}
                    <TouchableOpacity
                      style={{ marginVertical: 10 }}
                      onPress={bottomSheetAttach}
                    >
                      <Text
                        style={{
                          color: COLORS.info,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {acara.lists.length === 0 ? null : "Selengkapnya"}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                <View></View>

                {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1, marginRight: 20 }}>
                    <TouchableOpacity onPress={() => {
                      navigation.navigate('TambahGrup', { unread: false })
                    }}>
                      <View style={{ backgroundColor: COLORS.primary, borderRadius: 50, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name='add-outline' size={24} color={COLORS.white} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View> */}

                {/* add agenda
                <BottomSheetModal
                  ref={bottomSheetModalAddRef}
                  snapPoints={animatedSnapPoints}
                  handleHeight={animatedHandleHeight}
                  contentHeight={animatedContentHeight}
                  index={0}
                  style={{ borderRadius: 50 }}
                  keyboardBlurBehavior="restore"
                  android_keyboardInputMode="adjust"
                  backdropComponent={({ style }) => (
                    <View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
                  )}
                >
                  <BottomSheetView onLayout={handleContentLayout} >
                    <View style={{ marginHorizontal: 20, backgroundColor: COLORS.infoDanger, height: 60, marginTop: 10, borderRadius: 8 }}>
                      <TouchableOpacity
                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                        onPress={() => {
                          navigation.navigate('TambahGrup', { unread: false })
                          // props.navigation.navigate('Home', { unread: false })
                          bottomSheetClose()
                        }}
                      >
                        <Text style={{ color: COLORS.white, fontWeight: FONTWEIGHT.bold }}>Tambah Grup</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ marginHorizontal: 20, backgroundColor: COLORS.infoDanger, height: 60, marginTop: 10, borderRadius: 8 }}>
                      <TouchableOpacity
                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                        onPress={() => {
                          navigation.navigate('TambahAgenda', { unread: false })
                          // props.navigation.navigate('Home', { unread: false })
                          bottomSheetClose()
                        }}
                      >
                        <Text style={{ color: COLORS.white, fontWeight: FONTWEIGHT.bold }}>Tambah Agenda Acara</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ marginHorizontal: 20, backgroundColor: COLORS.infoDanger, height: 60, marginTop: 10, borderRadius: 8 }}>
                      <TouchableOpacity
                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                        onPress={() => {
                          bottomSheetAddCat()
                          // props.navigation.navigate('Home', { unread: false })
                        }}
                      >
                        <Text style={{ color: COLORS.white, fontWeight: FONTWEIGHT.bold }}>Tambah Kategori</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ marginHorizontal: 20, backgroundColor: COLORS.infoDanger, height: 60, marginTop: 10, borderRadius: 8 }}>
                      <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text style={{ color: COLORS.white, fontWeight: FONTWEIGHT.bold }}>Tambah Task</Text>
                      </TouchableOpacity>
                    </View>

                  </BottomSheetView>
                </BottomSheetModal> */}

                {/* add category */}
                <BottomSheetModal
                  ref={bottomSheetModalAddCatRef}
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
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          marginHorizontal: 20,
                          marginTop: 20,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H1", device),
                            fontWeight: FONTWEIGHT.bold,
                          }}
                        >
                          Kategori Baru
                        </Text>
                        <View
                          style={{
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            flex: 1,
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.infoDanger,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            Reset
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          marginBottom: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          flex: 1,
                          marginTop: 20,
                        }}
                      >
                        <TextInput
                          editable
                          multiline
                          numberOfLines={4}
                          maxLength={40}
                          placeholder="Ketikan Sesuatu"
                          style={{
                            borderWidth: 1,
                            width: "90%",
                            height: 40,
                            paddingHorizontal: 10,
                            paddingTop: 10,
                            borderRadius: 6,
                          }}
                          allowFontScaling={false}
                        />
                      </View>

                      <View
                        style={{
                          marginBottom: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          flex: 1,
                          marginTop: 20,
                        }}
                      >
                        <TextInput
                          editable
                          multiline
                          numberOfLines={4}
                          maxLength={40}
                          placeholder="Ketikan Sesuatu"
                          style={{
                            borderWidth: 1,
                            width: "90%",
                            height: 40,
                            paddingHorizontal: 10,
                            paddingTop: 10,
                            borderRadius: 6,
                          }}
                          allowFontScaling={false}
                        />
                      </View>

                      <TouchableOpacity
                        style={{
                          marginBottom: 40,
                          justifyContent: "center",
                          alignItems: "center",
                          flex: 1,
                          marginTop: 10,
                          backgroundColor: COLORS.infoDanger,
                          width: "90%",
                          height: 50,
                          marginHorizontal: 20,
                          borderRadius: 6,
                        }}
                        onPress={() => {
                          bottomSheetCloseCat();
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: fontSizeResponsive("H2", device),
                            fontWeight: FONTWEIGHT.bold,
                          }}
                        >
                          Simpan
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>

                {/* agenda hari ini */}
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
                    <View style={{ marginVertical: 20, marginLeft: 20 }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H2", device),
                          fontWeight: FONTWEIGHT.bold,
                          color: COLORS.lighter,
                        }}
                      >
                        Acara Kalender
                      </Text>
                    </View>
                    <View style={{ marginHorizontal: 20, marginBottom: 40 }}>
                      <FlatList
                        data={acara.lists}
                        renderItem={({ item }) => (
                          <CardAgenda
                            item={item}
                            kegiatan={kegiatan}
                            stringToColor={stringToColor}
                            idKategori={kategoriField.key}
                          />
                        )}
                        style={{ height: 500 }}
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>
              </View>
            </View>
          </ScrollView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
};
