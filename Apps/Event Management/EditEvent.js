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
  getOrientation,
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
  updateEvent,
} from "../../service/api";
import { setAddressbookSelected } from "../../store/AddressbookKKP";
import { setAttachment, setStatus } from "../../store/Event";
import { Loading } from "../../components/Loading";

// const Input = () => {
//     return (
//         <View style={{ marginHorizontal: "5%", marginTop: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
//             <View style={{ width: '90%' }}>
//                 <TextInput
//                     editable
//                     multiline
//                     numberOfLines={4}
//                     maxLength={40}
//                     placeholder='Ketikan sesuatu'
//                     style={{
//                         padding: 10,
//                         borderWidth: 1,
//                         flex: 1,
//                         borderRadius: 4,
//                         borderColor: COLORS.ExtraDivinder,
//                     }}
//                 />
//                 <TextInput
//                     editable
//                     multiline
//                     numberOfLines={4}
//                     maxLength={40}
//                     placeholder='Ketikan sesuatu'
//                     style={{
//                         padding: 10,
//                         borderWidth: 1,
//                         flex: 1,
//                         borderRadius: 4,
//                         borderColor: COLORS.ExtraDivinder,
//                         marginTop: 10
//                     }}
//                 />
//             </View>
//             <Ionicons name='remove-circle-outline' size={device === "tablet" ? 36 : 24}/>
//         </View>
//     )

// };

const CardListPeserta = ({ item, addressbook, device }) => {
  const dispatch = useDispatch();
  const deleteItem = (id, state) => {
    let data;
    if (state === "jabatan") {
      data = addressbook?.selected.filter((data) => {
        let nip = data.nip || data.officer.official.split("/")[1];
        return nip !== id;
      });
      dispatch(setAddressbookSelected(data));
    } else {
      data = addressbook?.selected.filter((data) => data.nip !== id);
      dispatch(setAddressbookSelected(data));
    }
  };
  return (
    <View key={item.nip || item.id}>
      {item.code !== undefined ||
      (item.title !== undefined && item.title?.name !== "") ? (
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
              {item.title?.name !== undefined ? item.title?.name : item.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              deleteItem(
                item.nip || item.officer.official.split("/")[1],
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

export const EditEvent = () => {
  const { kalenderLists, attachment, status, event, loading } = useSelector(
    (state) => state.event
  );
  const data = event.detailEvent;
  const navigation = useNavigation();
  const richText = useRef(null);
  const [richTextHandle, setRichTextHandle] = useState("");
  const [value, onChangeValue] = useState("");
  const [Judul, setJudul] = useState("");
  const [TanggalMulai, setTanggalMulai] = useState("");
  const [TanggalSelesai, setTanggalSelsai] = useState("");
  const [Tempat, setTempat] = useState("");
  const [Note, setNote] = useState("");
  const [Tamu, setTamu] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisiblePicker, setModalVisiblePicker] = useState("");

  const [modal, setModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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

  const [kategori, setKategori] = useState("");

  const [document, setDocument] = useState([]);
  const [type, setType] = useState([]);

  const [pilihanPimpinanEvent, setPilihanPimpinanEvent] = useState([]);
  const [pilihanPesertaEvent, setPilihanPesertaEvent] = useState([]);
  const [pilihanNotulenEvent, setPilihanNotulenEvent] = useState([]);
  const [pilihanPetugasAbsenEvent, setPilihanPetugasAbsenEvent] = useState([]);

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
    setJudul(data.title);
    setTanggalMulai(moment(data.start_date).locale("id").format("YYYY-MM-DD"));
    setTanggalSelsai(moment(data.end_date).locale("id").format("YYYY-MM-DD"));
    setTempat(data.location);
    setPilihanPimpinanEvent([data.pic]);
    setPilihanPesertaEvent(data.members);
    setPilihanNotulenEvent(data.extra_attrs?.notulen);
    setPilihanPetugasAbsenEvent(data.extra_attrs.presensi);
    setNote(data.note);
    setTamu(
      data.extra_attrs?.guest_external ? data.extra_attrs?.guest_external : []
    );
    setDocument(data.attachments);
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
    if (stateConfig.title === "Pimpinan Event") {
      setPilihanPimpinanEvent(addressbook?.selected);
    } else if (stateConfig.title === "Peserta Event") {
      setPilihanPesertaEvent(addressbook?.selected);
    } else if (stateConfig.title === "Notulen Event") {
      setPilihanNotulenEvent(addressbook?.selected);
    } else if (stateConfig.title === "Petugas Absen Event") {
      setPilihanPetugasAbsenEvent(addressbook?.selected);
    }
  }, [addressbook]);

  // useEffect(() => {
  //     if (status === 'berhasil') {
  //         dispatch(getEventToday(token))
  //         dispatch(getEventProgress(token))
  //     }
  // }, [status])

  // const onAddBtnClick = event => {
  //     setInputList(inputList.concat(<Input key={inputList.length} />));
  // };

  const handleSubmit = () => {
    const pilihNotulen = [];
    pilihanNotulenEvent?.map((item) => {
      if (item?.code) {
        pilihNotulen.push(item?.code);
      } else {
        pilihNotulen.push(item.nip);
      }
    });

    const pilihPeserta = [];
    pilihanPesertaEvent?.map((item) => {
      if (item?.code) {
        pilihPeserta.push(item?.code);
      } else {
        pilihPeserta.push(item.nip);
      }
    });

    const pilihAbsen = [];
    pilihanPetugasAbsenEvent?.map((item) => {
      if (item?.code) {
        pilihAbsen.push(item?.code);
      } else {
        pilihAbsen.push(item.nip);
      }
    });

    const idAtt = [];
    if (attachment.length > 0) {
      attachment?.map((item) => {
        idAtt.push(item.id);
      });
    }

    const payload = {
      calendar_id: kategori.key === undefined ? "" : kategori.key,
      title: Judul,
      note: Note,
      start_date: TanggalMulai,
      end_date: TanggalSelesai,
      location: Tempat,
      pic_objid: pilihanPimpinanEvent[0]?.code
        ? pilihanPimpinanEvent[0]?.code
        : pilihanPimpinanEvent[0]?.title.objid,
      notulen_list: pilihNotulen,
      members_list: pilihPeserta,
      presensi_list: pilihAbsen,
      status: "persiapan",
      id_attachment: idAtt,
    };
    const datas = {
      token: token,
      payload: payload,
      id: data.id,
    };
    dispatch(updateEvent(datas));
  };

  const { device } = useSelector((state) => state.apps);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? <Loading /> : null}
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
                    width: device === "tablet" ? 40 : 28,
                    height: device === "tablet" ? 40 : 28,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 20,
                  }}
                >
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="chevron-back-outline"
                      size={device === "tablet" ? 40 : 24}
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
                    Edit Event
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
                    Group Kalender
                  </Text>
                </View>
                <View style={{ marginHorizontal: "5%" }}>
                  <Dropdown
                    data={kalenderLists}
                    setSelected={setKategori}
                    borderWidth={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderwidthDrop={1}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderWidthValue={1}
                    borderColorValue={COLORS.ExtraDivinder}
                    placeHolder={data.calendar?.name}
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
                    Judul Event
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
                          fontSize: fontSizeResponsive("H4", device),
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
                          onPress={() => setModalVisiblePicker("mulai")}
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
                        Tanggal Selesai
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
                        }}
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
                            size={device === "tablet" ? 36 : 24}
                            color={COLORS.grey}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
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
                          current={moment(Date.now())
                            .locale("id")
                            .format("YYYY-MM-DD")}
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
                            if (modalVisiblePicker === "mulai") {
                              setTanggalMulai(
                                moment(formattedDate)
                                  .locale("id")
                                  .format("YYYY-MM-DD")
                              );
                            } else if (modalVisiblePicker === "selesai") {
                              setTanggalSelsai(
                                moment(formattedDate)
                                  .locale("id")
                                  .format("YYYY-MM-DD")
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
                    Pimpinan Event
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
                      width: "80%",
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                    value={
                      pilihanPimpinanEvent[0]?.title?.name ||
                      pilihanPimpinanEvent[0]?.title
                    }
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
                          title: "Pimpinan Event",
                          tabs: {
                            jabatan: true,
                            pegawai: false,
                          },
                          multiselect: false,
                          payload: pilihanPimpinanEvent,
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

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={visible}
                  onRequestClose={() => {
                    setVisible(!visible);
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
                      {/* <TouchableOpacity onPress={() => setVisible(false)} style={{ paddingRight: '85%', marginBottom: 3, marginLeft: 20 }}>
                                                <View style={{ backgroundColor: COLORS.primary, borderRadius: 50, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Ionicons name='close-outline' size={device === "tablet" ? 36 : 24}color={COLORS.white} />
                                                </View>
                                            </TouchableOpacity> */}
                      <View
                        style={{ width: "100%", height: "100%", padding: 16 }}
                      >
                        {/* <Addressbook /> */}

                        {/* <TouchableOpacity onPress={() => setVisible(false)} style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', }}>
                                                    <View style={{ backgroundColor: COLORS.primary, width: 217, height: 39, borderRadius: 8, justifyContent: 'center', alignItems: 'center', }}>
                                                        <Text style={{ color: COLORS.white }}>Ok</Text>
                                                    </View>
                                                </TouchableOpacity> */}
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
                    Peserta
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
                    value={pilihanPesertaEvent}
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
                          title: "Peserta Event",
                          tabs: {
                            jabatan: true,
                            pegawai: true,
                          },
                          multiselect: true,
                          payload: pilihanPesertaEvent,
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
                  data={pilihanPesertaEvent}
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
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Notulen
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
                        const config = {
                          title: "Notulen Event",
                          tabs: {
                            jabatan: true,
                            pegawai: true,
                          },
                          multiselect: true,
                          payload: pilihanNotulenEvent,
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
                  data={pilihanNotulenEvent}
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
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Petugas Absen
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
                        const config = {
                          title: "Petugas Absen Event",
                          tabs: {
                            jabatan: true,
                            pegawai: true,
                          },
                          multiselect: true,
                          payload: pilihanPetugasAbsenEvent,
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
                  data={pilihanPetugasAbsenEvent}
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
                      numberOfLines={3}
                      placeholder="Ketikan Sesuatu"
                      style={{
                        padding: 10,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                      onChangeText={setNote}
                      value={Note}
                      allowFontScaling={false}
                    />
                  </KeyboardAvoidingView>
                </View>

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
                    Tamu Eksternal
                  </Text>
                  {/* <TouchableOpacity style={{ width: 50, height: 24, backgroundColor: COLORS.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => {
                                                bottomSheetMember()
                                            }}
                                        >
                                            <Ionicons name='add-outline' size={device === "tablet" ? 36 : 24}color={COLORS.white} />
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
                      setTamu((prev) => [...prev, value]);
                      onChangeValue("");
                    }}
                  >
                    <Ionicons
                      name="send-outline"
                      size={device === "tablet" ? 36 : 24}
                      color={COLORS.primary}
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
                          marginHorizontal: "5%",
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
                            {item.name}
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
                            size={20}
                            color={COLORS.infoDanger}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
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

                      <View style={{ marginHorizontal: "5%" }}>
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
                      marginHorizontal: 20,
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
                    height: 50,
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
