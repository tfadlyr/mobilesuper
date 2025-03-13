import React, { useEffect, useMemo, useRef, useState } from "react";
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
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
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
import { Image } from "react-native";
import { Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CardPilihMember } from "../../components/CardPilihMember";
import { Search } from "../../components/Search";
import { FlatList } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import moment from "moment/min/moment-with-locales";
import {} from "react-native-safe-area-context";
import { Dropdown } from "../../components/DropDown";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import {
  getEventProgress,
  getEventToday,
  getlistKalender,
  postAttachment,
  postEvent,
  postSubAgenda,
  updateSubAgenda,
} from "../../service/api";
import { setAddressbookSelected } from "../../store/AddressbookKKP";
import { setAttachment, setStatus } from "../../store/Event";
import Checkbox from "expo-checkbox";
import { Loading } from "../../components/Loading";

const CardListPeserta = ({
  item,
  addressbook,
  persetaSubAgenda = false,
  setPilihanPeserta,
  device,
}) => {
  const dispatch = useDispatch();
  const deleteItem = (id, state) => {
    let data;
    let datas = persetaSubAgenda ? addressbook : addressbook.selected;
    if (state === "jabatan") {
      data = datas.filter((data) => {
        let nip = data.nip || data.officer.official?.split("/")[1];
        return nip !== id;
      });
      if (persetaSubAgenda) {
        setPilihanPeserta(data);
      } else {
        dispatch(setAddressbookSelected(data));
      }
    } else {
      data = datas.filter((data) => data.nip !== id);
      if (persetaSubAgenda) {
        setPilihanPeserta(data);
      } else {
        dispatch(setAddressbookSelected(data));
      }
    }
  };
  return (
    <View key={item.nip || item.id}>
      {item.code !== undefined ||
      (item.title !== undefined && item.title.name !== "") ? (
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: "5%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              -
            </Text>
            <Text
              style={{
                width: "80%",
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {item.title.name !== undefined ? item.title.name : item.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              deleteItem(
                item.nip || item.officer.official?.split("/")[1],
                "jabatan"
              );
            }}
          >
            <Ionicons
              name="trash-outline"
              size={device === "tablet" ? 36 : 24}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: "5%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              -
            </Text>
            <Text
              style={{
                width: "80%",
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {item.nama || item.fullname}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              deleteItem(item.nip, "pegawai");
            }}
          >
            <Ionicons
              name="trash-outline"
              size={device === "tablet" ? 36 : 24}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const EditSubAgenda = () => {
  const navigation = useNavigation();
  const richText = useRef(null);
  const [pilihanPIC, setPilihanPIC] = useState([]);
  const [pilihanPeserta, setPilihanPeserta] = useState([]);
  const [value, onChangeValue] = useState("");
  const [Judul, setJudul] = useState("");
  const [TanggalMulai, setTanggalMulai] = useState("");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [Tempat, setTempat] = useState("");
  const [Note, setNote] = useState("");
  const [Tamu, setTamu] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisiblePicker, setModalVisiblePicker] = useState(false);
  const [arrIsChecked, setArrIsChecked] = useState([]);
  const [modalVisibleTimePicker, setModalVisibleTimePicker] = useState("");

  const bottomSheetModalMemberRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["90%", "CONTENT_HEIGHT"], []);
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

  const { attachment, status, event, agenda, loading } = useSelector(
    (state) => state.event
  );
  const agendaDetail = agenda.detail;
  const [kategori, setKategori] = useState("");

  const [document, setDocument] = useState([]);
  const [type, setType] = useState([]);

  const [pilihanPesertaTambahanInternal, setPilihanPesertaTambahanInternal] =
    useState([]);

  const [token, setToken] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getlistKalender(token));
    }
    dispatch(setAttachment([]));
    let pic = [];
    event.detailEvent?.extra_attrs?.members.map((item) => {
      pic.push({
        key: item.is_employee ? item.nip : item.title.objid,
        value: item.is_employee ? item.nama : item.title.name,
      });
    });
    pic.push({
      key: event.detailEvent?.extra_attrs.pic.is_employee
        ? event.detailEvent?.extra_attrs.pic.nip
        : event.detailEvent?.extra_attrs.pic.title.objid,
      value: event.detailEvent?.extra_attrs.pic.is_employee
        ? event.detailEvent?.extra_attrs.pic.nama
        : event.detailEvent?.extra_attrs.pic.title.name,
    });
    setJudul(agendaDetail.title);
    setKategori({
      key: agendaDetail.extra_attrs?.pic.is_employee
        ? agendaDetail.extra_attrs?.pic.nip
        : agendaDetail.extra_attrs?.pic.title.objid,
      value: agendaDetail.extra_attrs?.pic.is_employee
        ? agendaDetail.extra_attrs?.pic.nama
        : agendaDetail.extra_attrs?.pic.title.name,
    });
    setTanggalMulai(agendaDetail.date);
    setWaktuMulai(agendaDetail.start_time);
    setWaktuSelesai(agendaDetail.end_time);
    setPilihanPIC(pic);
    setPilihanPeserta(event.detailEvent.extra_attrs?.members);
    setArrIsChecked(agendaDetail.extra_attrs?.members);
    setPilihanPesertaTambahanInternal(agendaDetail.extra_attrs?.guests);
    setTempat(agendaDetail.location);
    setNote(agendaDetail.note);
    agendaDetail?.attachments?.map((item) => {
      const data = document?.some((doc) => doc.id === item.id);
      if (!data) {
        let tipe = item.file.split("/");
        tipe = tipe[tipe.length - 1];
        tipe = tipe.split(".");
        tipe = tipe[tipe.length - 1];
        setDocument([...document, item]);
        setType([...type, tipe]);
      }
    });
    dispatch(setAttachment(agendaDetail.attachments));
  }, [token]);
  // const convertFileToObject = async (result) => {
  //     try {
  //         const filePath = result.uri
  //         const fileData = await fetch(filePath)
  //         const blob = await fileData.blob()

  //         const newFile = new File([blob], result.name, { type: result.mimetype })

  //         return newFile
  //     } catch (error) {
  //         console.error(error)
  //     }
  // }

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    // const file = convertFileToObject(result)
    let tipe = result.assets[0].uri.split("/");
    tipe = tipe[tipe.length - 1];
    tipe = tipe.split(".");
    tipe = tipe[tipe.length - 1];
    setDocument([...document, result]);
    setType([...type, tipe]);
    const data = {
      token: token,
      result: result,
    };
    dispatch(postAttachment(data));
  };

  const [stateConfig, setStateConfig] = useState({});

  const { addressbook } = useSelector((state) => state.addressBookKKP);

  useEffect(() => {
    if (stateConfig.title === "Peserta Internal") {
      setPilihanPesertaTambahanInternal(addressbook.selected);
    }
  }, [addressbook]);

  useEffect(() => {
    if (status === "berhasil") {
      dispatch(getEventToday(token));
      dispatch(getEventProgress(token));
    }
  }, [status]);

  const handleSubmit = () => {
    const pilihanInternal = [];
    pilihanPesertaTambahanInternal?.map((item) => {
      if (item.code) {
        pilihanInternal.push(item.code);
      } else {
        pilihanInternal.push(item.nip);
      }
    });

    const idAtt = [];
    attachment?.map((item) => {
      idAtt.push(item.id);
    });

    const members = [];
    arrIsChecked?.map((item) => {
      if (item.is_employee) {
        members.push(item.nip);
      } else {
        members.push(item.title.objid);
      }
    });

    const payload = {
      event_id: event.detailEvent.id,
      title: Judul,
      note: Note,
      date: TanggalMulai,
      start_time: waktuMulai,
      end_time: waktuSelesai,
      location: Tempat,
      pic_objid: kategori?.key,
      members_list: members,
      guests_list: pilihanInternal,
      extra_attrs: {
        guest_external: Tamu,
      },
      id_attachment: idAtt,
    };
    const data = {
      token: token,
      id: agendaDetail.id,
      payload: payload,
    };
    dispatch(updateSubAgenda(data));
  };

  const handleChangeChecked = (item, index) => {
    const isChecked = arrIsChecked?.some((data) => data.nip === item.nip);
    const arr = [...arrIsChecked];
    if (isChecked) {
      arr.splice(index, 1);
    } else {
      arr.push(item);
    }
    setArrIsChecked(arr);
  };

  const { device } = useSelector((state) => state.apps);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading === true && agendaDetail === null ? <Loading /> : null}
      <>
        <BottomSheetModalProvider>
          <ScrollView>
            <Pressable onPress={() => richText.current?.dismissKeyboard()}>
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
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: 600,
                      color: COLORS.white,
                    }}
                  >
                    Edit Sub Agenda
                  </Text>
                </View>
              </View>

              <View style={styles.Card}>
                <View
                  style={{
                    marginTop: 20,
                    marginBottom: 10,
                    marginHorizontal: "5%",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Judul Sub Agenda
                  </Text>
                  <Text
                    style={{
                      color: COLORS.danger,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    *
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginHorizontal: "5%",
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Masukan Judul"
                    style={{
                      padding: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                    onChangeText={setJudul}
                    value={Judul}
                    allowFontScaling={false}
                  />
                </View>

                <View
                  style={{
                    marginTop: device === "tablet" ? 20 : 10,
                    marginBottom: 10,
                    marginHorizontal: "5%",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    PIC
                  </Text>
                  <Text
                    style={{
                      color: COLORS.danger,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    *
                  </Text>
                </View>
                <View style={{ marginHorizontal: "5%" }}>
                  <Dropdown
                    data={pilihanPIC}
                    setSelected={setKategori}
                    selected={kategori}
                    borderWidth={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderwidthDrop={1}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderWidthValue={1}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                </View>

                <View style={{ marginHorizontal: "5%" }}>
                  <View>
                    <View
                      style={{
                        marginTop: device === "tablet" ? 20 : 10,
                        marginBottom: 10,
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: FONTWEIGHT.bold,
                          fontSize: fontSizeResponsive("H3", device),
                        }}
                      >
                        Tanggal Mulai
                      </Text>
                      <Text
                        style={{
                          color: COLORS.danger,
                          fontSize: fontSizeResponsive("H3", device),
                        }}
                      >
                        *
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
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
                        placeholder="Mulai"
                        style={{
                          padding: 10,
                          fontSize: fontSizeResponsive("H3", device),
                        }}
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
                          onPress={() => setModalVisiblePicker(true)}
                        >
                          <Ionicons
                            name="calendar-outline"
                            size={device === "tablet" ? 36 : 24}
                            color={COLORS.grey}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: "5%",
                  }}
                >
                  <View style={{ width: "49%" }}>
                    <View
                      style={{
                        marginTop: device === "tablet" ? 20 : 10,
                        marginBottom: 10,
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: FONTWEIGHT.bold,
                          fontSize: fontSizeResponsive("H3", device),
                        }}
                      >
                        Waktu Mulai
                      </Text>
                      <Text
                        style={{
                          color: COLORS.danger,
                          fontSize: fontSizeResponsive("H3", device),
                        }}
                      >
                        *
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: COLORS.ExtraDivinder,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        editable
                        multiline
                        numberOfLines={4}
                        maxLength={40}
                        placeholder="Mulai"
                        style={{
                          padding: 10,
                          fontSize: fontSizeResponsive("H4", device),
                          width: "49%",
                        }}
                        value={waktuMulai}
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
                          onPress={() => setModalVisibleTimePicker("mulai")}
                        >
                          <Ionicons
                            name="time-outline"
                            size={device === "tablet" ? 36 : 24}
                            color={COLORS.grey}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={{ width: "49%" }}>
                    <View
                      style={{
                        marginTop: device === "tablet" ? 20 : 10,
                        marginBottom: 10,
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: FONTWEIGHT.bold,
                          fontSize: fontSizeResponsive("H3", device),
                        }}
                      >
                        Waktu Selesai
                      </Text>
                      <Text
                        style={{
                          color: COLORS.danger,
                          fontSize: fontSizeResponsive("H3", device),
                        }}
                      >
                        *
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
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
                        placeholder="Selesai"
                        style={{
                          padding: 10,
                          fontSize: fontSizeResponsive("H4", device),
                          width: "49%",
                        }}
                        value={waktuSelesai}
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
                          onPress={() => setModalVisibleTimePicker("selesai")}
                        >
                          <Ionicons
                            name="time-outline"
                            size={device === "tablet" ? 36 : 24}
                            color={COLORS.grey}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                {/* timePicker */}
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={
                    modalVisibleTimePicker === "mulai" ||
                    modalVisibleTimePicker === "selesai"
                      ? true
                      : false
                  }
                  onRequestClose={() => {
                    setModalVisibleTimePicker("");
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
                        alignItems: "center",
                        justifyContent: "center",
                        width: "90%",
                        borderRadius: 10,
                      }}
                    >
                      <View style={{ marginVertical: 20, width: "100%" }}>
                        <TouchableOpacity
                          onPress={() => setModalVisibleTimePicker("")}
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
                              size={device === "tablet" ? 36 : 24}
                              color={COLORS.white}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
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
                          mode="time"
                          style={{
                            borderRadius: 10,
                            width: device === "tablet" ? 600 : 300,
                          }}
                          minuteInterval={3}
                          onTimeChange={(selectedTime) => {
                            if (modalVisibleTimePicker === "mulai") {
                              setWaktuMulai(selectedTime);
                            } else if (modalVisibleTimePicker === "selesai") {
                              if (waktuMulai && waktuMulai < selectedTime)
                                setWaktuSelesai(selectedTime);
                              else if (waktuMulai && waktuMulai > selectedTime)
                                alert("waktu selesai kurang dari waktu mulai");
                            }
                            setModalVisibleTimePicker("");
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </Modal>

                {/* tanggal mulai */}
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisiblePicker}
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
                        alignItems: "center",
                        justifyContent: "center",
                        width: "90%",
                        borderRadius: 10,
                        flex: 1,
                      }}
                    >
                      <View style={{ marginVertical: 20, width: "100%" }}>
                        <TouchableOpacity
                          onPress={() => setModalVisiblePicker("")}
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
                              size={device === "tablet" ? 36 : 24}
                              color={COLORS.white}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
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
                          minimumDate={
                            event.detailEvent?.start_date.split("T")[0]
                          }
                          maximumDate={
                            event.detailEvent?.end_date.split("T")[0]
                          }
                          current={event.detailEvent?.start_date.split("T")[0]}
                          mode="calendar"
                          minuteInterval={30}
                          style={{
                            borderRadius: 10,
                            width: device === "tablet" ? 600 : 300,
                          }}
                          onSelectedChange={(date) => {
                            const [year, month, day] = date
                              .split("/")
                              ?.map(Number);
                            const formattedDate = new Date(
                              year,
                              month - 1,
                              day
                            );
                            setTanggalMulai(
                              moment(formattedDate)
                                .locale("id")
                                .format("YYYY-MM-DD")
                            );
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
                            <Text
                              style={{
                                color: COLORS.white,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              Ok
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>

                <View
                  style={{
                    marginTop: device === "tablet" ? 20 : 10,
                    marginBottom: 10,
                    marginHorizontal: "5%",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Pilih dan lihat Peserta
                  </Text>
                  <Text
                    style={{
                      color: COLORS.danger,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    *
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginHorizontal: "5%",
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
                    style={{
                      padding: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
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
                      onPress={() => {
                        setModalVisible(true);
                      }}
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={device === "tablet" ? 36 : 24}
                        color={COLORS.grey}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <FlatList
                  data={arrIsChecked}
                  renderItem={({ item }) => (
                    <CardListPeserta
                      item={item}
                      addressbook={arrIsChecked}
                      persetaSubAgenda={true}
                      setPilihanPeserta={setArrIsChecked}
                      device={device}
                    />
                  )}
                  scrollEnabled={false}
                  keyExtractor={(index) => index}
                />

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(false);
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
                          onPress={() => setModalVisible(false)}
                        >
                          <Ionicons
                            name="close-outline"
                            size={device === "tablet" ? 36 : 24}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Peserta Sub Agenda
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
                              const data =
                                event.detailEvent?.extra_attrs.members.filter(
                                  (item) =>
                                    item.nama
                                      .toLowerCase()
                                      .includes(e.toLowerCase())
                                );
                              if (e !== "" || data.length > 0) {
                                setPilihanPeserta(data);
                              } else {
                                setPilihanPeserta(
                                  event.detailEvent?.extra_attrs.members
                                );
                              }
                            }}
                            placeholder={"Cari Berdasarkan Nama"}
                          />
                        </View>
                        <ScrollView>
                          {pilihanPeserta?.map((item, index) => {
                            return item.is_employee ? (
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
                                      gap: 10,
                                    }}
                                  >
                                    <Ionicons
                                      name="person-circle-outline"
                                      size={device === "tablet" ? 36 : 24}
                                    />
                                    <Text
                                      style={{
                                        width: 250,
                                        fontSize: fontSizeResponsive(
                                          "H4",
                                          device
                                        ),
                                      }}
                                    >
                                      {item.nama}
                                    </Text>
                                  </View>
                                  <Checkbox
                                    value={arrIsChecked?.some(
                                      (data) => data.nip === item.nip
                                    )}
                                    onValueChange={() =>
                                      handleChangeChecked(item, index)
                                    }
                                    // color={isChecked ? '#4630EB' : undefined}
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
                            ) : (
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
                                      gap: 10,
                                    }}
                                  >
                                    <Ionicons
                                      name="person-circle-outline"
                                      size={device === "tablet" ? 36 : 24}
                                    />
                                    <Text
                                      style={{
                                        width: 250,
                                        fontSize: fontSizeResponsive(
                                          "H4",
                                          device
                                        ),
                                      }}
                                    >
                                      {item.title.name}
                                    </Text>
                                  </View>
                                  <Checkbox
                                    value={arrIsChecked?.some(
                                      (data) => data.nip === item.nip
                                    )}
                                    onValueChange={() =>
                                      handleChangeChecked(item, index)
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

                <View
                  style={{
                    marginTop: device === "tablet" ? 20 : 10,
                    marginBottom: 10,
                    marginHorizontal: "5%",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Peserta Tambahan Internal
                  </Text>
                  <Text
                    style={{
                      color: COLORS.danger,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    *
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginHorizontal: "5%",
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
                    style={{
                      padding: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                    value={pilihanPesertaTambahanInternal}
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
                      onPress={() => {
                        const config = {
                          title: "Peserta Internal",
                          tabs: {
                            jabatan: true,
                            pegawai: true,
                          },
                          multiselect: true,
                          payload: pilihanPesertaTambahanInternal,
                        };
                        setStateConfig(config);
                        navigation.navigate("AddressBook", { config: config });
                      }}
                    >
                      <Ionicons
                        name="people-outline"
                        size={device === "tablet" ? 36 : 24}
                        color={COLORS.grey}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <FlatList
                  data={pilihanPesertaTambahanInternal}
                  renderItem={({ item }) => (
                    <CardListPeserta
                      item={item}
                      addressbook={addressbook}
                      device={device}
                    />
                  )}
                  scrollEnabled={false}
                  keyExtractor={(index) => index}
                />

                <View
                  style={{
                    marginTop: device === "tablet" ? 20 : 10,
                    marginBottom: 10,
                    marginHorizontal: "5%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Pilih dan Lihat Tamu Eksternal
                  </Text>
                  {/* <TouchableOpacity style={{ width: 50, height: 24, backgroundColor: COLORS.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => {
                                                bottomSheetMember()
                                            }}
                                        >
                                            <Ionicons name='add-outline' size={24} color={COLORS.white} />
                                        </TouchableOpacity> */}
                </View>
                <View
                  style={{
                    marginHorizontal: "5%",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      flex: 1,
                      borderRadius: 4,
                      borderColor: COLORS.ExtraDivinder,
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      placeholder="Nama Tamu"
                      style={{
                        padding: 10,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                      onChangeText={onChangeValue}
                      value={value}
                      allowFontScaling={false}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setTamu((prev) => [...prev, { nama: value }]);
                      onChangeValue("");
                    }}
                  >
                    <Ionicons
                      name="send-outline"
                      size={device === "tablet" ? 36 : 24}
                      color={COLORS.infoDanger}
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  {Tamu?.map((item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginHorizontal: 17,
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            marginTop: 10,
                            backgroundColor: COLORS.white,
                            borderRadius: 8,
                            //shadow ios
                            shadowOffset: { width: -2, height: 4 },
                            shadowColor: "#171717",
                            shadowOpacity: 0.2,
                            //shadow android
                            elevation: 2,
                            padding: 10,
                            width: "89%",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {item.nama}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: COLORS.infoDanger,
                            borderRadius: 2,
                          }}
                          onPress={() => {
                            const newArr = Tamu.filter((item, i) => i != index);
                            setTamu(newArr);
                          }}
                        >
                          <Ionicons
                            name="remove-sharp"
                            size={device === "tablet" ? 36 : 20}
                            color={COLORS.infoDanger}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>

                <View
                  style={{
                    marginTop: device === "tablet" ? 20 : 10,
                    marginBottom: 10,
                    marginHorizontal: "5%",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Tempat
                  </Text>
                  <Text
                    style={{
                      color: COLORS.danger,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    *
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginHorizontal: "5%",
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
                    style={{
                      padding: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                    onChangeText={setTempat}
                    value={Tempat}
                    allowFontScaling={false}
                  />
                </View>

                <View
                  style={{
                    marginTop: device === "tablet" ? 20 : 10,
                    marginBottom: 10,
                    marginHorizontal: "5%",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Catatan
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    marginHorizontal: "5%",
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    flexDirection: "row",
                  }}
                >
                  <KeyboardAvoidingView style={{ flex: 1 }}>
                    {/* <RichToolbar
                                            editor={richText}
                                            selectedIconTint="#873c1e"
                                            iconTint="#312921"
                                        /> */}
                    {/* <RichEditor
                                            ref={richText}
                                            onChange={setRichTextHandle}
                                            placeholder="Tulis Pesan..."
                                            androidHardwareAccelerationDisabled={true}
                                            initialHeight={250}
                                        /> */}
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      placeholder="Ketikan Sesuatu"
                      style={{
                        padding: 10,
                        height: 150,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                      onChangeText={setNote}
                      value={Note}
                      allowFontScaling={false}
                    />
                  </KeyboardAvoidingView>
                </View>

                {/* {inputList} */}
                <BottomSheetModal
                  ref={bottomSheetModalMemberRef}
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
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 500,
                            marginBottom: 50,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Tambah Tamu Eksternal
                        </Text>
                      </View>

                      <View style={{ marginHorizontal: 17 }}>
                        <View
                          style={{
                            borderWidth: 1,
                            flex: 1,
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
                            placeholder="Nama Tamu"
                            style={{
                              padding: 10,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                            onChangeText={onChangeValue}
                            value={value}
                            allowFontScaling={false}
                          />
                        </View>

                        <View
                          style={{
                            borderWidth: 1,
                            flex: 1,
                            borderRadius: 4,
                            borderColor: COLORS.ExtraDivinder,
                            flexDirection: "row",
                            marginTop: 10,
                          }}
                        >
                          <TextInput
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={40}
                            placeholder="Email Tamu"
                            style={{
                              padding: 10,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                            onChangeText={onChangeValue}
                            value={value}
                            allowFontScaling={false}
                          />
                        </View>
                      </View>
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>

                <View
                  style={{
                    marginTop: device === "tablet" ? 20 : 10,
                    marginBottom: 10,
                    marginHorizontal: "5%",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Lampiran
                  </Text>
                </View>
                <Pressable onPress={pickDocument}>
                  <View
                    style={{
                      width: "90%",
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 10,
                      flex: 1,
                      backgroundColor: COLORS.grey,
                      padding: 10,
                      marginHorizontal: "5%",
                    }}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={30}
                      color={COLORS.white}
                    />
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Klik Untuk Unggah
                    </Text>
                  </View>
                </Pressable>
                {/* ) : null} */}
                {document.length < 1 ? null : (
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: "5%",
                      marginVertical: 10,
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    {document?.map((doc, i) => (
                      <>
                        {type[i] === "doc" || type[i] === "docx" ? (
                          <View
                            style={{
                              width: 97,
                              height: 97,
                              justifyContent: "center",
                              alignItems: "center",
                              borderWidth: 1,
                              borderRadius: 8,
                              borderColor: COLORS.ExtraDivinder,
                            }}
                          >
                            <Image
                              source={require("../../assets/superApp/word.png")}
                            />
                          </View>
                        ) : type[i] === "pdf" ? (
                          <View
                            style={{
                              width: 97,
                              height: 97,
                              justifyContent: "center",
                              alignItems: "center",
                              borderWidth: 1,
                              borderRadius: 8,
                              borderColor: COLORS.ExtraDivinder,
                            }}
                          >
                            <Image
                              source={require("../../assets/superApp/pdf.png")}
                            />
                          </View>
                        ) : type[i] === "ppt" || type[i] === "pptx" ? (
                          <View
                            style={{
                              width: 97,
                              height: 97,
                              justifyContent: "center",
                              alignItems: "center",
                              borderWidth: 1,
                              borderRadius: 8,
                              borderColor: COLORS.ExtraDivinder,
                            }}
                          >
                            <Image
                              source={require("../../assets/superApp/ppt.png")}
                            />
                          </View>
                        ) : type[i] === "xls" || type[i] === "xlsx" ? (
                          <View
                            style={{
                              width: 97,
                              height: 97,
                              justifyContent: "center",
                              alignItems: "center",
                              borderWidth: 1,
                              borderRadius: 8,
                              borderColor: COLORS.ExtraDivinder,
                            }}
                          >
                            <Image
                              source={require("../../assets/superApp/excel.png")}
                            />
                          </View>
                        ) : (
                          <Image
                            key={doc.uri}
                            source={{ uri: doc.uri }}
                            style={{ width: 97, height: 97, borderRadius: 8 }}
                          />
                        )}
                      </>
                    ))}
                  </View>
                )}
                <View style={{ marginVertical: 10, marginHorizontal: "5%" }}>
                  <Text
                    style={{
                      color: COLORS.lighter,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    *) Hanya png, jpg, jpeg, pdf, doc, docx, ppt, pptx, xls,
                    xlsx yang akan diterima dan ukuran file maks 100 MB
                  </Text>
                </View>
              </View>
            </Pressable>

            <TouchableOpacity
              onPress={() => {
                // setModalVisible(true)
                handleSubmit();
              }}
            >
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  paddingBottom: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.primary,
                    flexDirection: "row",
                    width: "90%",
                    paddingVertical: 10,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Simpan
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>

          <Modal
            animationType="fade"
            transparent={true}
            visible={status === "" ? false : true}
            onRequestClose={() => {
              dispatch(setStatus(""));
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
                  width: 325,
                  height: 350,
                }}
              >
                <TouchableOpacity
                  onPress={() => dispatch(setStatus(""))}
                  style={{ marginTop: 5, paddingRight: "80%" }}
                >
                  <Ionicons
                    name="close-outline"
                    size={device === "tablet" ? 36 : 24}
                  />
                </TouchableOpacity>
                {status === "berhasil" ? (
                  <>
                    <View style={{ marginBottom: 40 }}>
                      <Image
                        source={require("../../assets/superApp/alertBerhasil.png")}
                      />
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 20,
                        }}
                      >
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          Berhasil Diubah!
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(setStatus(""));
                          navigation.navigate("HalamanUtama");
                        }}
                        style={{
                          marginTop: 20,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: COLORS.success,
                            width: 217,
                            height: 39,
                            borderRadius: 8,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.white,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            Ok
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <View style={{ marginBottom: 40 }}>
                    <Image
                      source={require("../../assets/superApp/alertGagal.png")}
                    />
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        Terjadi Kesalahan!
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => dispatch(setStatus(""))}
                      style={{
                        marginTop: 20,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.danger,
                          width: 217,
                          height: 39,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Ok
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
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
    marginHorizontal: "5%",
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
