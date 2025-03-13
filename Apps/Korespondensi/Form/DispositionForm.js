import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import { Fragment, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Button,
  Card,
  Checkbox,
  IconButton,
  Switch,
  TextInput,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import {
  getHTTP,
  handlerError,
  headerToken,
  postHTTP,
} from "../../../utils/http";
import DetailAgenda from "../Detail/Tab/DetailAgenda";
import moment from "moment";
import {
  addDispoMulti,
  removeDispoMulti,
  setNotaTindakan,
  setNotaTindakanFree,
  setTodoDuedate,
  setTodoPriority,
  setTodoRemind,
  setTodoRemindCount,
  switchTindakan,
  switchTodo,
} from "../../../store/dispoMulti";
import { Config } from "../../../constants/config";
import { COLORS } from "../../../config/SuperAppps";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native";
import { useRef } from "react";
import { useMemo } from "react";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { setUnker } from "../../../store/profile";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import SignatureScreen from "react-native-signature-canvas";
import { formEselonI } from "../../../components/FormDispo/formEselon1";
import { formEselonII } from "../../../components/FormDispo/formEselon2";
import { Ionicons } from "@expo/vector-icons";

function DispositionForm({ route, id, data, noAgenda, tipe, title }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { profile, selectedAttr } = useSelector((state) => state.profile);
  const { device } = useSelector((state) => state.apps);
  const [senderAttr, setSenderAttr] = useState(selectedAttr);
  let dispoMulti = useSelector((state) => state.dispoMulti.data);
  // const addressbook = useSelector((state) => state.addressbook.selected);
  const [stateConfig, setStateConfig] = useState({});
  const { addressbook } = useSelector((state) => state.addressBookKKP);
  const [selectedAddressbook, setSelectedAddressbook] = useState(addressbook);
  const [ids, setid] = useState();
  const [detail, setDetail] = useState();
  // const [noAgenda, setNoAgenda] = useState();
  const [tipes, setTipe] = useState();
  const [tindakanList, setTindakanList] = useState();
  const [visibleDatePicker, setvisibleDatePicker] = useState();
  const [isFocusPrio, setIsFocusPrio] = useState();
  const [isFocusAttr, setIsFocusAttr] = useState();
  let header = {};
  const [btnAdd, setbtnAdd] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [scrollEnabled, setScrollEnabled] = useState();
  const [stylusEnabled, setStylusEnabled] = useState(false);
  const [stylusFile, setStylusFile] = useState("");
  const refresh = navigation.addListener("focus", () => {
    setSelectedAddressbook(addressbook);
  });
  const [selectedTindakan, setSelectedTindakan] = useState([]);
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  const priority = [
    { view: "Tinggi", value: "hi" },
    { view: "Normal", value: "nr" },
    { view: "Rendah", value: "lo" },
  ];

  const bottomSheetRefNotaTindakan = useRef(null);
  const snapPoint = useMemo(() => [50, "100%"], []);

  const [pilihanKepada, setPilihanKepada] = useState([]);
  const [headerDispo, setHeaderDispo] = useState({});

  const [collapse, setCollapse] = useState({
    petunjuk: true,
  });
  const toggleCollapse = (index) => {
    setCollapse((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (stateConfig.title === "Addressbook\nDisposition") {
      setPilihanKepada(addressbook.selected);
    }
    // console.log("addressbook", pilihanKepada);
  }, [addressbook.selected]);

  useEffect(() => {
    // setDetail(route?.params?.data);
    // setNoAgenda(route?.params?.noAgenda);
    if (id == undefined) {
      setid(route?.params?.id);
    } else {
      setid(id);
    }
    if (tipe == undefined) {
      setTipe(route?.params?.tipe);
    } else {
      setTipe(tipe);
    }
    if (data == undefined) {
      setDetail(route?.params?.data);
    } else {
      setDetail(data);
    }
    // if (dispoMulti.length === 5) {
    //   setbtnAdd(false);
    // } else {
    //   setbtnAdd(true);
    // }
    getHeader();
    if (profile.title.length == 1) {
      setSenderAttr(profile.title[0]);
    }
    return refresh;
  }, [data]);

  useEffect(() => {
    getTindakan();
  }, [senderAttr]);

  async function getHeader() {
    header = await headerToken();
  }
  const renderItemTindakan = ({ item, index }) => (
    <View
      key={index}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Checkbox.Item
        mode="android"
        position="leading"
        color={COLORS.primary}
        status={selectedTindakan.includes(item.name) ? "checked" : "unchecked"}
        label={item.name}
        labelStyle={[
          styles.labelCheckbox,
          {
            fontSize: GlobalStyles.font.sm,
            textAlignVertical: "center",
            marginTop: -7,
          },
        ]}
        onPress={() => {
          dispatch(setNotaTindakan({ index: 0, nota_tindakan1: item }));
          setSelectedTindakan((prev) =>
            prev.includes(item.name)
              ? prev.filter((tind) => tind !== item.name)
              : [...prev, item.name]
          );
        }}
        style={{
          height: 27,
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 0,
        }}
      />
    </View>
  );

  async function getTindakan() {
    setIsLoading(true);
    try {
      const response = await getHTTP(nde_api.dispoaction);
      setTindakanList(response.data.action);
      setHeaderDispo(response.data);
      dispatch(
        setUnker({
          key: response?.data?.unker_id,
          value: response?.data?.unker,
        })
      );
      setIsLoading(false);
    } catch (error) {
      handlerError(error, "Peringatan!", "Nota Tindakan tidak berfungsi!");
      setIsLoading(false);
    }
  }
  //menambah form disposisi
  function addDispo() {
    let payload = {
      kepadaDispo: [],
      btnDel: true,
      tindakan1: true,
      nota_tindakan1: "",
      nota_tindakan_free1: "",
      create_todo1: false,
      duedate_todo1: "",
      send_priority_todo1: "",
      remind_todo1: false,
      remind_count_todo1: 0,
    };
    dispatch(addDispoMulti(payload));
  }
  //menghapus form disposisi
  function delDispo(i) {
    dispatch(removeDispoMulti(i));
  }

  async function postDisposition() {
    setIsLoading(true);
    try {
      let status = 1;
      // validasi
      dispoMulti.map((items) => {
        if (senderAttr?.code == undefined) {
          status = 0;
        } else if (pilihanKepada.length == 0 || pilihanKepada == "") {
          status = 0;
        } else if (
          items.nota_tindakan1 == undefined ||
          items.nota_tindakan1.length == 0
        ) {
          status = 0;
        } else if (
          items.create_todo1 &&
          (items.duedate_todo1 == undefined ||
            items.duedate_todo1 == "" ||
            items.send_priority_todo1 == "")
        ) {
          status = 0;
        } else if (items.create_todo1 && items.remind_todo1) {
          if (
            items.remind_count_todo1 == undefined ||
            items.remind_count_todo1 == 0
          ) {
            status = 0;
          }
        }
      });
      if (status == 1) {
        //prep-data
        let request = [];
        dispoMulti.map((items, i) => {
          request.push({
            kepada: "",
            kepada_ids: "",
            tindakan: "0",
            nota_tindakan:
              selectedTindakan.length != 0 ? selectedTindakan.join("\n") : "",
            nota_tindakan_free: items.nota_tindakan_free1
              ? items.nota_tindakan_free1
              : "",
            create_todo: items.create_todo1 ? "on" : "off",
            duedate_todo: "",
            send_priority_todo: "",
            remind_todo: items.remind_todo1 ? "on" : "off",
            remind_count_todo: parseInt(items.remind_count_todo1),
          });
          let temp = [];
          let temp_ids = [];
          pilihanKepada.map((item, j) => {
            temp.push(
              item.fullname
                ? item.fullname
                : item.title
                ? item.title
                : item.person
            );
            temp_ids.push(item.nik ? item.nik : item.code);
          });
          request[i].kepada = temp.join("\n");
          request[i].kepada_ids = temp_ids.join("\n");

          if (items.create_todo1) {
            request[i].duedate_todo = moment(items.duedate_todo1).format(
              "DD/MM/YYYY"
            );
            request[i].send_priority_todo = items.send_priority_todo1.value;
          }
        });
        // console.log(request);
        let payload = {
          attachments:
            stylusFile === ""
              ? []
              : [
                  {
                    base64: stylusFile,
                    description: "notes-stylus",
                    name: "Catatan_Disposisi.svg",
                    size: 0,
                  },
                ],
          request: request,
          id: ids,
          copy_log: "1",
        };
        // post api dispo
        const response = await postHTTP(
          nde_api.postDisposition
            .replace("{$type}", tipes)
            .replace("{$id}", ids),
          payload
        );
        // alert response
        if (response.data.status == "Error") {
          Alert.alert("Peringatan!", response.data.msg);
        } else {
          Alert.alert("Berhasil!", "Disposisi berhasil terkirim!");
          navigation.goBack();
          // navigation.goBack();
        }
      } else {
        Alert.alert("Peringatan!", "Silakan isi lembar disposisi!");
      }
      setIsLoading(false);
    } catch (error) {
      handlerError(error, "Peringatan!", "Disposisi tidak berfungsi!");
      setIsLoading(false);
    }
  }

  function confirmRemoveAll() {
    if (selectedTindakan?.length == 0) {
      Alert.alert("Info", "Catatan kosong");
    } else {
      Alert.alert(
        "Konfirmasi",
        "Anda yakin untuk menghapus semua catatan?",
        [
          { text: "Batal", onPress: () => {} },
          {
            text: "Ya",
            onPress: () => setSelectedTindakan([]),
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  }

  const ref = useRef();

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {
    console.log(signature);
    setStylusFile(signature);
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    setStylusFile("");
    console.log("Empty");
  };

  // Called after ref.current.clearSignature()
  const handleClear = () => {
    setStylusFile("");
    console.log("clear success!");
  };

  // Called after end of stroke
  const handleEnd = () => {
    setScrollEnabled(true);
    ref.current.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = (data) => {
    console.log(data);
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView scrollEnabled={scrollEnabled}>
          {loadingOverlay}
          <View style={styles.screen}>
            {(headerDispo?.type == "1" || headerDispo?.type == "a") &&
              formEselonI(detail, headerDispo)}
            {(headerDispo?.type == "b" ||
              headerDispo?.type == "c" ||
              headerDispo?.type == "2" ||
              headerDispo?.type == "3" ||
              headerDispo?.type == "4") &&
              formEselonII(detail, headerDispo)}
            {dispoMulti.map((item, index) => (
              <Card key={index} style={styles.containerCard}>
                {item.btnDel && (
                  <View style={styles.headerCard}>
                    <IconButton icon="close" onPress={() => delDispo(index)} />
                  </View>
                )}
                <View style={styles.containerTitle}>
                  <Text style={styles.title}>Disposisi Kepada</Text>
                  {pilihanKepada != undefined && pilihanKepada.length != 0 && (
                    <Ionicons
                      name="add"
                      size={24}
                      onPress={() => {
                        const config = {
                          title: "Addressbook\nDisposition",
                          tipeAddress: "korespondensi",
                          tabs: {
                            jabatan: true,
                            pegawai: true,
                            favorit: true,
                            para: true,
                            senderCode: senderAttr.code,
                          },
                          multiselect: true,
                          payload: pilihanKepada,
                        };
                        setStateConfig(config);
                        navigation.navigate("AddressBook", { config: config });
                      }}
                    />
                  )}
                </View>
                <View>
                  {pilihanKepada != undefined &&
                    pilihanKepada.map((items, index) => (
                      <Fragment key={index}>
                        <Text style={styles.titleLabel}>
                          {index + 1}.{" "}
                          {items.fullname
                            ? items.fullname
                            : items.title
                            ? items.title
                            : items.person}
                        </Text>
                      </Fragment>
                    ))}

                  {(pilihanKepada == undefined ||
                    pilihanKepada.length == 0) && (
                    <TextInput
                      mode="outlined"
                      theme={{ roundness: 6 }}
                      placeholder="Pilih Kepada"
                      right={
                        <TextInput.Icon
                          size={24}
                          icon="account-plus"
                          // onPress={() => {
                          //   navigation.navigate("Addressbook", {
                          //     title: "Addressbook\nDisposition",
                          //     multiple: true,
                          //     indexDispo: index,
                          //     tipe: "receivers",
                          //   });
                          // }}
                          onPress={() => {
                            const config = {
                              title: "Addressbook\nDisposition",
                              tipeAddress: "korespondensi",
                              tabs: {
                                jabatan: true,
                                pegawai: true,
                                favorit: true,
                                para: true,
                              },
                              multiselect: true,
                              payload: pilihanKepada,
                              senderCode: senderAttr.code,
                            };
                            setStateConfig(config);
                            navigation.navigate("AddressBook", {
                              config: config,
                            });
                          }}
                        />
                      }
                      editable={false}
                      style={styles.titleLabel}
                      allowFontScaling={false}
                    />
                  )}
                </View>
                <View style={styles.containerTitle}>
                  <Text style={styles.title}>Petunjuk</Text>
                  <Text onPress={() => toggleCollapse("petunjuk")}>
                    {collapse["petunjuk"] ? (
                      <Ionicons
                        name="remove-circle-outline"
                        size={24}
                        onPress={toggleCollapse[item.header]}
                      />
                    ) : (
                      <Ionicons name="add-circle-outline" size={24} />
                    )}
                  </Text>
                </View>
                {collapse["petunjuk"] && (
                  <View>
                    <FlatList
                      data={tindakanList}
                      renderItem={renderItemTindakan}
                      keyExtractor={(item, index) =>
                        item?.code ? item.code.toString() : `fallback-${index}`
                      }
                      nestedScrollEnabled
                      numColumns={device === "tablet" ? 2 : 1}
                      columnWrapperStyle={
                        device === "tablet"
                          ? { justifyContent: "space-between" }
                          : null
                      } // Agar grid lebih rapi di tablet
                    />
                  </View>
                )}
                <View style={styles.containerTitle}>
                  <Text style={styles.title}>Catatan</Text>
                </View>
                <TextInput
                  value={item.nota_tindakan_free1}
                  mode="outlined"
                  multiline={true}
                  theme={{ roundness: 6 }}
                  placeholder="Masukkan catatan..."
                  onChangeText={(text) => {
                    dispatch(
                      setNotaTindakanFree({
                        index: index,
                        nota_tindakan_free1: text,
                      })
                    );
                  }}
                  style={[styles.titleLabel, { paddingVertical: 12 }]}
                  allowFontScaling={false}
                />

                <View
                  style={[
                    styles.containerTitleLeft,
                    {
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 10,
                      justifyContent: "space-between",
                      marginTop: 10,
                      borderColor: GlobalStyles.colors.tertiery70,
                    },
                  ]}
                >
                  {/* <Button
                    labelStyle={{
                      fontSize: GlobalStyles.font.sm,
                    }}
                    mode="outlined"
                    textColor="white"
                    onPress={() => {
                      if (stylusEnabled == true) {
                        handleClear();
                      }
                      setStylusEnabled(!stylusEnabled);
                    }}
                    style={{ width: "100%", backgroundColor: COLORS.info }}
                  >
                    <Ionicons name="pencil" size={16} />
                    Catatan
                  </Button> */}
                  <View
                    style={{
                      width: device === "tablet" ? 300 : 230,
                    }}
                  >
                    <Text style={[styles.titleTodo, { paddingRight: 8 }]}>
                      Stylus Pen
                    </Text>
                    <Text
                      style={{
                        paddingRight: 8,
                        color: GlobalStyles.colors.grey,
                        marginTop: 5,
                      }}
                    >
                      Tambah catatan dengan stylus
                    </Text>
                  </View>
                  <Switch
                    value={stylusEnabled}
                    onValueChange={() => {
                      if (stylusEnabled == true) {
                        handleClear();
                      }
                      setStylusEnabled(!stylusEnabled);
                    }}
                  />
                </View>
                {stylusEnabled && (
                  <View
                    style={{
                      height: 600,
                      width: "90%",
                      marginLeft: "5%",
                      marginTop: 10,
                    }}
                  >
                    <SignatureScreen
                      ref={ref}
                      onBegin={() => setScrollEnabled(false)}
                      onEnd={handleEnd}
                      onOK={handleOK}
                      onEmpty={handleEmpty}
                      onClear={handleClear}
                      onGetData={handleData}
                      autoClear={false}
                      imageType="image/svg+xml"
                      descriptionText=" "
                      webStyle={`
                      .m-signature-pad {
                        position: absolute;
                        width: 100%;
                        height: 89%;
                        top: 0;
                        left: 0;
                        margin-left: 0;
                        margin-top: 0;
                        border: 1px solid #e8e8e8;
                        background-color: #ffff;
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
                      }
                     .m-signature-pad button {
                        font-size: 10px !important; /* Ukuran font untuk button */
                        line-height: normal !important;
                        padding: 10px 20px; /* Sesuaikan padding */
                        display: inline-block; /* Memastikan button tidak terpotong */
                        text-size-adjust: none !important;
                      }
                        
                    `}
                      clearText="Hapus"
                      confirmText="Simpan"
                    />
                  </View>
                )}
                {Config.todo && (
                  <>
                    <View style={styles.containerTitleLeft}>
                      <Switch
                        value={item.create_todo1}
                        onValueChange={() => dispatch(switchTodo(index))}
                      />
                      <Text style={[styles.titleTodo, styles.switchLabel]}>
                        Aktifkan {Config.labelTodo}
                      </Text>
                    </View>

                    {item.create_todo1 && (
                      <>
                        <View style={styles.containerTanggalPrioritas}>
                          <View style={{ width: "45%" }}>
                            <Text style={styles.titleLabelTodo}>Tanggal</Text>
                            <Button
                              style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                height: 55,
                                borderColor: GlobalStyles.colors.black,
                                borderRadius: 6,
                              }}
                              labelStyle={{
                                fontSize: GlobalStyles.font.sm,
                              }}
                              mode="outlined"
                              textColor="black"
                              onPress={() => {
                                setvisibleDatePicker(!visibleDatePicker);
                              }}
                            >
                              {item.duedate_todo1 != ""
                                ? moment(new Date(item.duedate_todo1)).format(
                                    "DD/MM/YYYY"
                                  )
                                : "Tgl Duedate"}
                            </Button>
                            <DateTimePickerModal
                              isVisible={visibleDatePicker}
                              mode="date"
                              display={
                                Platform.OS == "android" ? "inline" : "spinner"
                              }
                              style={{ width: "100%", height: 300 }}
                              onConfirm={(date) => {
                                dispatch(
                                  setTodoDuedate({
                                    index: index,
                                    duedate_todo1: date.toDateString(),
                                  })
                                );
                                setvisibleDatePicker(false);
                              }}
                              onCancel={() => {
                                setvisibleDatePicker(false);
                              }}
                              minimumDate={new Date()}
                            />
                          </View>
                          <View style={{ width: "47%" }}>
                            <Text style={styles.titleLabelTodo}>Prioritas</Text>
                            <Dropdown
                              style={[
                                styles.dropdown,
                                isFocusPrio && {
                                  borderColor: GlobalStyles.colors.tertiery50,
                                },
                              ]}
                              itemTextStyle={{
                                fontSize: GlobalStyles.font.sm,
                              }}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              // inputSearchStyle={styles.inputSearchStyle}
                              iconStyle={styles.iconStyle}
                              data={priority}
                              // search
                              maxHeight={300}
                              labelField="view"
                              valueField="value"
                              placeholder={
                                !isFocusPrio ? "Pilih Prioritas" : "..."
                              }
                              // searchPlaceholder="Search..."
                              value={item.send_priority_todo1}
                              onFocus={() => setIsFocusPrio(true)}
                              onBlur={() => setIsFocusPrio(false)}
                              onChange={(item) => {
                                dispatch(
                                  setTodoPriority({
                                    index: index,
                                    send_priority_todo1: item,
                                  })
                                );
                                setIsFocusPrio(false);
                              }}
                            />
                          </View>
                        </View>
                        {/* <View style={styles.containerBetween}>
                      <View>
                        <Checkbox.Item
                          style={{ paddingLeft: -12 }}
                          mode="android"
                          label="Remind Todo"
                          status={item.remind_todo1 ? "checked" : "unchecked"}
                          color={GlobalStyles.colors.tertiery}
                          onPress={() => {
                            dispatch(setTodoRemind(index));
                          }}
                          position="leading"
                          labelStyle={styles.labelRemind}
                        />
                        <View
                          style={[
                            styles.containerRemind,
                            { alignItems: "center" },
                          ]}
                        >
                          <TextInput
                            style={{ marginRight: 8 }}
                            mode="outlined"
                            theme={{ roundness: 6 }}
                            keyboardType="numeric"
                            value={item.remind_count_todo1}
                            onChangeText={(text) =>
                              dispatch(
                                setTodoRemindCount({
                                  index: index,
                                  remind_count_todo1: text,
                                })
                              )
                            }
                            disabled={!item.remind_todo1}
                          />
                          <Text>day(s) before</Text>
                        </View>
                      </View>
                    </View> */}
                      </>
                    )}
                  </>
                )}
              </Card>
            ))}
            {/* {btnAdd && (
              <Button
                onPress={addDispo}
                mode="contained"
                style={{
                  marginBottom: 16,
                  backgroundColor: GlobalStyles.colors.tertiery,
                }}
              >
                Add Disposition
              </Button>
            )}*/}
            <Button
              mode="contained"
              style={{ backgroundColor: GlobalStyles.colors.tertiery }}
              onPress={postDisposition}
            >
              Kirim
            </Button>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
}

export default DispositionForm;

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    backgroundColor: GlobalStyles.colors.tertiery20,
  },
  containerCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: GlobalStyles.colors.tertiery10,
  },
  containerTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
  },
  containerLabel: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  title: {
    marginBottom: 6,
    fontSize: GlobalStyles.font.md,
  },
  titleLabel: {
    fontSize: GlobalStyles.font.md,
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  containerTindakanChecked: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: GlobalStyles.colors.textWhite,
    paddingHorizontal: 12,
  },
  containerTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  titleTodo: {
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  containerBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  switchLabel: {
    paddingLeft: 8,
  },
  titleLabelTodo: {
    marginBottom: 12,
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  dropdown: {
    height: 55,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: GlobalStyles.colors.black,
    paddingHorizontal: 12,
  },
  containerTanggalPrioritas: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  containerRemind: {
    flexDirection: "row",
  },
  title: {
    marginBottom: 6,
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  placeholderStyle: {
    fontSize: GlobalStyles.font.sm,
  },
  selectedTextStyle: {
    fontSize: GlobalStyles.font.md,
  },
  labelRemind: {
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  labelCheckbox: {
    width: "95%",
    textAlign: "left",
    fontSize: GlobalStyles.font.md,
  },
});
