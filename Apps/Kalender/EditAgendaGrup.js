import React, { useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  AVATAR,
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { KeyboardAvoidingView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CardPilihMember } from "../../components/CardPilihMember";
import { Search } from "../../components/Search";
import { FlatList } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import {} from "react-native-safe-area-context";
import { Dropdown } from "../../components/DropDown";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import { setStatus } from "../../store/GrupKalender";
import Checkbox from "expo-checkbox";
import { postAgendaAcara, putEditAgendaGrup } from "../../service/api";
import { useEffect } from "react";
import { ModalSubmit } from "../../components/ModalSubmit";
import { CardListDataPeserta } from "../../components/CardListDataPeserta";
import { Loading } from "../../components/Loading";

export const EditAgendaGrup = ({ route }) => {
  const { idKategori } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisiblePicker, setModalVisiblePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [TanggalMulai, setTanggalMulai] = useState(new Date());
  const [TanggalSelesai, setTanggalSelsai] = useState(new Date());
  const [picAcara, setPicAcara] = useState("");
  const [pengingat, setPengingat] = useState("");
  const [judulAcara, setJudulAcara] = useState("");
  const [ketentuan, setKetentuan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [catatan, setCatatan] = useState("");
  const [modalVisibleMember, setModalVisibleMember] = useState(false);
  const [memberIsChecked, setMemberIsChecked] = useState([]);
  const [token, setToken] = useState("");

  const bottomSheetModalMemberRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetMember = () => {
    bottomSheetModalMemberRef.current?.present();
  };

  const [dataFilter, setDataFilter] = useState([]);
  const handleClickItem = (id, toggle) => {
    if (toggle) {
      const result = items.find((item) => item.id === id);
      setDataFilter([...dataFilter, result]);
    } else {
      const index = dataFilter.findIndex((item) => item.id === id);
      dataFilter.splice(index, 1);
      let result = dataFilter;
      setDataFilter(result);
    }
  };

  const { detailGrup, status, acara, loading } = useSelector(
    (state) => state.grupKalender
  );
  const editAgenda = acara.detail;
  const [anggotaAcara, setAnggotaAcara] = useState(detailGrup.members);

  const dispatch = useDispatch();
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
    setJudulAcara(editAgenda.name);
    setTanggalMulai(
      moment(editAgenda.start_date).format(DATETIME.LONG_DATETIME)
    );
    setTanggalSelsai(
      moment(editAgenda.end_date).format(DATETIME.LONG_DATETIME)
    );
    setPicAcara({
      key: editAgenda.pic[0].nip,
      value: editAgenda.pic[0].nama,
    });
    setMemberIsChecked(detailGrup.members);
    setPengingat({
      key: editAgenda.reminder,
      value: editAgenda.reminder,
    });
    setKetentuan(editAgenda.dresscode);
    setLokasi(editAgenda.location);
    setCatatan(editAgenda.extra_attributes.catatan);
  }, []);

  const dataPIC = () => {
    let arr = [];
    detailGrup?.editors?.map((item) => {
      arr.push({
        key: item.nip,
        value: item.nama,
      });
    });
    return arr;
  };

  // const dataAnggota = () => {
  //     let arr = []
  //     detailGrup?.members?.map(item => {
  //         arr.push({
  //             key: item.nip,
  //             value: item.nama
  //         })
  //     })
  //     return arr
  // }

  const dataPengingat = [
    {
      key: "15 menit",
      value: "15 Menit",
    },
    {
      key: "30 menit",
      value: "30 Menit",
    },
    {
      key: "1 jam",
      value: "1 Jam",
    },
    {
      key: "1 hari",
      value: "1 Hari",
    },
  ];

  const handleChangeChecked = (item) => {
    const index = memberIsChecked.map((e) => e.nip).indexOf(item.nip);
    const isChecked = index > -1;
    const arr = [...memberIsChecked];
    if (isChecked) {
      arr.splice(index, 1);
    } else {
      arr.push(item);
    }
    setMemberIsChecked(arr);
  };

  const handleSubmit = () => {
    const pilihAnggota = [];
    memberIsChecked?.map((item) => {
      if (item?.code) {
        pilihAnggota.push(item?.code);
      } else {
        pilihAnggota.push(item.nip);
      }
    });

    const payload = {
      id_calendar: idKategori,
      name: judulAcara,
      members_list: pilihAnggota,
      pic_objid: picAcara.key,
      reminder: pengingat.key,
      start_date: moment(TanggalMulai, "DD MMMM YYYY HH:mm:ss").format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      end_date: moment(TanggalSelesai, "DD MMMM YYYY HH:mm:ss").format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      dresscode: ketentuan,
      location: lokasi,
      catatan: catatan,
    };
    const data = {
      token: token,
      id: editAgenda.id,
      payload: payload,
    };
    dispatch(putEditAgendaGrup(data));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? <Loading /> : null}
      <>
        <BottomSheetModalProvider>
          <ScrollView>
            <Pressable>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  backgroundColor: COLORS.primary,
                  height: 80,
                  paddingBottom: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    borderRadius: 20,
                    width: 28,
                    height: 28,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 20,
                  }}
                >
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="chevron-back-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{ flex: 1, alignItems: "center", marginRight: 50 }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: COLORS.white,
                    }}
                  >
                    Edit Agenda Acara
                  </Text>
                </View>
              </View>

              <View style={styles.Card}>
                <View style={{ marginTop: 20, marginLeft: 17 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Kalender Grup: {detailGrup.name}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 20,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Judul Agenda Baru
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginLeft: 17,
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Ketikan Sesuatu"
                    style={{ padding: 10 }}
                    onChangeText={setJudulAcara}
                    value={judulAcara}
                    allowFontScaling={false}
                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Waktu Mulai
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginLeft: 17,
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Pilih member"
                    style={{ padding: 10 }}
                    value={TanggalMulai}
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
                    <TouchableOpacity
                      onPress={() => setModalVisiblePicker("mulai")}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={24}
                        color={COLORS.grey}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Waktu Selesai
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginLeft: 17,
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Pilih member"
                    style={{ padding: 10 }}
                    value={TanggalSelesai}
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
                    <TouchableOpacity
                      onPress={() => setModalVisiblePicker("selesai")}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={24}
                        color={COLORS.grey}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={
                    modalVisiblePicker === "mulai" ||
                    modalVisiblePicker === "selesai"
                      ? true
                      : false
                  }
                  onRequestClose={() => {
                    setModalVisiblePicker(!modalVisiblePicker);
                  }}
                >
                  <TouchableOpacity
                    style={[
                      Platform.OS === "ios"
                        ? styles.iOSBackdrop
                        : styles.androidBackdrop,
                      styles.backdrop,
                    ]}
                  />
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.white,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "90%",
                        height: 500,
                        borderRadius: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setModalVisiblePicker("")}
                        style={{
                          paddingRight: "85%",
                          marginBottom: 3,
                          marginLeft: 20,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: COLORS.primary,
                            borderRadius: 50,
                            width: 35,
                            height: 35,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons
                            name="close-outline"
                            size={24}
                            color={COLORS.white}
                          />
                        </View>
                      </TouchableOpacity>
                      <View style={{ width: "100%" }}>
                        <DatePicker
                          options={{
                            backgroundColor: COLORS.white,
                            textHeaderColor: COLORS.primary,
                            textDefaultColor: COLORS.primary,
                            selectedTextColor: "#fff",
                            mainColor: COLORS.primary,
                            textSecondaryColor: COLORS.primary,
                            borderColor: "rgba(122, 146, 165, 0.1)",
                          }}
                          current={moment(Date.now()).format("YYYY-MM-DD")}
                          minuteInterval={5}
                          style={{ borderRadius: 10 }}
                          onSelectedChange={(date) => {
                            // const [year, month, day] = date.split('/')?.map(Number)
                            // const formattedDate = new Date(year, month - 1, day)
                            if (modalVisiblePicker === "mulai") {
                              setTanggalMulai(
                                moment(date, "YYYY/MM/DD HH:mm").format(
                                  DATETIME.LONG_DATETIME
                                )
                              );
                            } else if (modalVisiblePicker === "selesai") {
                              setTanggalSelsai(
                                moment(date, "YYYY/MM/DD HH:mm").format(
                                  DATETIME.LONG_DATETIME
                                )
                              );
                            }
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => setModalVisiblePicker("")}
                          style={{
                            marginTop: 20,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: COLORS.primary,
                              width: 217,
                              height: 39,
                              borderRadius: 8,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text style={{ color: COLORS.white }}>Ok</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>

                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    PIC
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>

                {/* <TextInput
                                        editable
                                        multiline
                                        numberOfLines={4}
                                        maxLength={40}
                                        placeholder='Pilih member'
                                        style={{ padding: 10 }}
                                        onChangeText={onChangeValue}
                                        value={value}
                                    /> */}
                <View style={{ width: "90%", marginHorizontal: 20 }}>
                  <Dropdown
                    data={dataPIC()}
                    setSelected={setPicAcara}
                    selected={picAcara}
                    borderWidth={1}
                    borderWidthValue={1}
                    borderwidthDrop={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Anggota
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    flexDirection: "row",
                    marginHorizontal: 20,
                  }}
                  onPress={() => setModalVisibleMember(true)}
                >
                  <TextInput
                    editable={false}
                    multiline
                    placeholder="Pilih Anggota"
                    style={{ padding: 10 }}
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
                    <Ionicons
                      name="people-outline"
                      size={24}
                      color={COLORS.grey}
                    />
                  </View>
                </TouchableOpacity>
                <FlatList
                  data={memberIsChecked}
                  renderItem={({ item }) => (
                    <CardListDataPeserta
                      item={item}
                      addressbook={memberIsChecked}
                      persetaSubAgenda={true}
                      setPilihanPeserta={setMemberIsChecked}
                    />
                  )}
                  scrollEnabled={false}
                  keyExtractor={(index) => index}
                />

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisibleMember}
                  onRequestClose={() => {
                    setModalVisibleMember(false);
                  }}
                >
                  <TouchableOpacity
                    style={[
                      Platform.OS === "ios"
                        ? styles.iOSBackdrop
                        : styles.androidBackdrop,
                      styles.backdrop,
                    ]}
                  />
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.white,
                        width: "90%",
                        height: "70%",
                        borderRadius: 8,
                        padding: 20,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setModalVisibleMember(false)}
                        >
                          <Ionicons name="close-outline" size={24} />
                        </TouchableOpacity>
                        <Text style={{ fontWeight: FONTWEIGHT.bold }}>
                          Pilih Anggota
                        </Text>
                      </View>
                      {/* custom divider */}
                      <View
                        style={{
                          height: 1,
                          width: "100%",
                          backgroundColor: "#DBDADE",
                          marginTop: 10,
                        }}
                      />
                      <View>
                        <View style={{ marginVertical: 20 }}>
                          <Search
                            onSearch={(e) => {
                              const data = detailGrup.members.filter((item) =>
                                item.nama
                                  .toLowerCase()
                                  .includes(e.toLowerCase())
                              );
                              if (e !== "" || data.length > 0) {
                                setAnggotaAcara(data);
                              } else {
                                setAnggotaAcara(detailGrup?.members);
                              }
                            }}
                            placeholder={"Cari Berdasarkan Nama"}
                          />
                        </View>
                        <ScrollView>
                          {anggotaAcara?.map((item) => {
                            return (
                              <View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Ionicons
                                      name="person-circle-outline"
                                      size={24}
                                    />
                                    <Text>{item.nama}</Text>
                                  </View>
                                  <Checkbox
                                    value={
                                      memberIsChecked
                                        .map((e) => e.nip)
                                        .indexOf(item.nip) > -1
                                    }
                                    onValueChange={() =>
                                      handleChangeChecked(item)
                                    }
                                  />
                                </View>
                                {/* custom divider */}
                                <View
                                  style={{
                                    height: 1,
                                    width: "100%",
                                    backgroundColor: "#DBDADE",
                                    marginVertical: 10,
                                  }}
                                />
                              </View>
                            );
                          })}
                        </ScrollView>
                      </View>
                    </View>
                  </View>
                </Modal>
                {/* <View style={{ width: '90%', marginHorizontal: 20 }}>
                                    <Dropdown
                                        data={dataAnggota()}
                                        setSelected={setAnggotaAcara}
                                        borderWidth={1}
                                        borderWidthValue={1}
                                        borderwidthDrop={1}
                                        borderColor={COLORS.ExtraDivinder}
                                        borderColorDrop={COLORS.ExtraDivinder}
                                        borderColorValue={COLORS.ExtraDivinder}
                                    />
                                </View> */}

                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Pengingat
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>
                <View style={{ width: "90%", marginHorizontal: 20 }}>
                  <Dropdown
                    data={dataPengingat}
                    setSelected={setPengingat}
                    selected={pengingat}
                    borderWidth={1}
                    borderWidthValue={1}
                    borderwidthDrop={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Ketentuan Busana
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginLeft: 17,
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Ketikan sesuatu"
                    style={{ padding: 10 }}
                    onChangeText={setKetentuan}
                    value={ketentuan}
                    allowFontScaling={false}
                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Lokasi
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginLeft: 17,
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Ketikan sesuatu"
                    style={{ padding: 10 }}
                    onChangeText={setLokasi}
                    value={lokasi}
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Catatan
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginLeft: 17,
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    flexDirection: "row",
                    marginBottom: 20,
                  }}
                >
                  <KeyboardAvoidingView style={{ flex: 1 }}>
                    <TextInput
                      editable
                      multiline
                      placeholder="Ketikan sesuatu"
                      style={{ padding: 10, height: 200 }}
                      onChangeText={setCatatan}
                      value={catatan}
                      allowFontScaling={false}
                    />
                  </KeyboardAvoidingView>
                </View>
              </View>
            </Pressable>
            <TouchableOpacity
              onPress={() => {
                handleSubmit();
              }}
            >
              <View
                style={{
                  alignItems: "flex-end",
                  marginRight: 40,
                  marginBottom: 40,
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.infoDanger,
                    borderRadius: 50,
                    width: 44,
                    height: 44,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="checkmark-outline"
                    size={24}
                    color={COLORS.white}
                  />
                </View>
              </View>
            </TouchableOpacity>

            {/* <BottomSheetModal
                            ref={bottomSheetModalMemberRef}
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
                            <BottomSheetView onLayout={handleContentLayout}>
                                <View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 500 }}>Pilih Member</Text>
                                    </View>
                                    <View style={{ width: '90%', marginHorizontal: 20, marginVertical: 20 }}>
                                        <Search
                                            placeholder={'Cari'}
                                        />
                                    </View>
                                    <View>
                                        <FlatList
                                            data={dataFilter}
                                            horizontal={true}
                                            renderItem={({ item }) => <CardPilihMember
                                                nama={item.nama}
                                                avatar={item.avatar}
                                                id={item.id}
                                                handleClickItem={handleClickItem}
                                                filter={true}
                                            />
                                            }
                                        />
                                    </View>
                                    <View>
                                        <FlatList
                                            data={items}
                                            renderItem={({ item }) => <CardPilihMember
                                                nama={item.nama}
                                                avatar={item.avatar}
                                                id={item.id}
                                                handleClickItem={handleClickItem}
                                                filter={false}
                                            />
                                            }
                                        />
                                    </View>
                                </View>
                            </BottomSheetView>
                        </BottomSheetModal> */}
            <ModalSubmit
              status={status}
              setStatus={setStatus}
              messageSuccess={"Data Ditambahkan"}
              navigate={"GrupKalender"}
            />
            {/* <Modal
                            animationType="fade"
                            transparent={true}
                            visible={status === '' ? false : true}
                            onRequestClose={() => {
                                dispatch(setStatus(''))
                            }}
                        >
                            <TouchableOpacity style={[Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop, styles.backdrop]} />
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <View style={{ backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', width: 325, height: 350 }}>
                                    <TouchableOpacity onPress={() => dispatch(setStatus(''))} style={{ marginTop: 5, paddingRight: '80%' }}>
                                        <Ionicons name='close-outline' size={24} />
                                    </TouchableOpacity>
                                    {
                                        status === 'berhasil' ? (
                                            <>
                                                <View style={{ marginBottom: 40 }}>
                                                    <Image source={require('../../assets/superApp/alertBerhasil.png')} />
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                                        <Text >Berhasil Ditambahkan!</Text>
                                                    </View>
                                                    <TouchableOpacity onPress={() => {
                                                        dispatch(setStatus(''))
                                                        navigation.navigate('GrupKalender')
                                                    }} style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', }}>
                                                        <View style={{ backgroundColor: COLORS.success, width: 217, height: 39, borderRadius: 8, justifyContent: 'center', alignItems: 'center', }}>
                                                            <Text style={{ color: COLORS.white }}>Ok</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        ) : (
                                            <View style={{ marginBottom: 40 }}>
                                                <Image source={require('../../assets/superApp/alertGagal.png')} />
                                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                                    <Text >Terjadi Kesalahan!</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => dispatch(setStatus(''))} style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', }}>
                                                    <View style={{ backgroundColor: COLORS.danger, width: 217, height: 39, borderRadius: 8, justifyContent: 'center', alignItems: 'center', }}>
                                                        <Text style={{ color: COLORS.white }}>Ok</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }
                                </View>
                            </View>
                        </Modal> */}
          </ScrollView>
        </BottomSheetModalProvider>
      </>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  Card: {
    backgroundColor: COLORS.white,
    width: "90%",
    marginVertical: 20,
    marginLeft: 20,
    borderRadius: 16,
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
