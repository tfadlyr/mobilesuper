import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import DatePicker from "react-native-modern-datepicker";
import moment from "moment/min/moment-with-locales";
import { COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "../../components/DropDown";
import { useDispatch, useSelector } from "react-redux";
import * as DocumentPicker from "expo-document-picker";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getEventProgress,
  getEventToday,
  getListCategory,
  getListCompetence,
  getlistKalender,
  postAttachment,
  postEvent,
} from "../../service/api";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getTokenValue } from "../../service/session";

export const PostinganBaru = () => {
  const navigation = useNavigation();

  const [selectedKategori, setSelectedKategori] = useState();
  const [selectedKompetensi, setSelectedKompetensi] = useState();

  const [document, setDocument] = useState([]);
  const richText = useRef(null);
  const [richTextHandle, setRichTextHandle] = useState("");
  const [TanggalMulai, setTanggalMulai] = useState("");
  const [TanggalSelesai, setTanggalSelsai] = useState("");

  const [modalVisiblePicker, setModalVisiblePicker] = useState("");
  const { kalenderLists, attachment, status } = useSelector(
    (state) => state.event
  );

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

  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getListCategory(token));
    }
  }, [token]);

  useEffect(() => {
    if (token !== "") {
      dispatch(getListCompetence(token));
    }
  }, [token]);

  const { kategori } = useSelector((state) => state.pengetahuan);
  const { kompetensi } = useSelector((state) => state.pengetahuan);

  const handleSubmit = () => {
    const payload = {
      calendar_id: kategori.key === undefined ? "" : kategori.key,
      start_date: TanggalMulai,
      end_date: TanggalSelesai,
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postEvent(data));
  };

  const [type, setType] = useState([]);

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

  const dataKategori = () => {
    let valueKategori = [];
    kategori?.lists?.map((item) => {
      valueKategori.push({
        key: item.id,
        value: item.name,
      });
    });
    return valueKategori;
  };

  const dataKompetensi = () => {
    let valueKompetensi = [];
    kompetensi?.lists?.map((item) => {
      valueKompetensi.push({
        key: item.id,
        value: item.name,
      });
    });
    return valueKompetensi;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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
                <TouchableOpacity
                  style={{}}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
                <Text
                  style={{ fontSize: 15, fontWeight: 600, color: COLORS.white }}
                >
                  Postingan Baru
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 20,
                marginBottom: 10,
                marginLeft: 17,
                marginRight: 17,
                flexDirection: "row",
                backgroundColor: COLORS.white,
                borderRadius: 10,
              }}
            >
              <View style={{ padding: 20, gap: 20 }}>
                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Judul
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: COLORS.ExtraDivinder,
                      padding: 1,
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={2}
                      maxLength={50}
                      placeholder="Masukan Judul"
                      style={{ padding: 5, width: 315, height: 40 }}
                      allowFontScaling={false}
                    />
                  </View>
                </View>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Anggota Agenda
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: COLORS.ExtraDivinder,
                      padding: 1,
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={2}
                      maxLength={50}
                      placeholder="Masukan Anggota Agenda"
                      style={{ padding: 5, width: 315, height: 40 }}
                      allowFontScaling={false}
                    />
                  </View>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.light,
                      fontSize: FONTSIZE.H4,
                    }}
                  >
                    Note: Gunakan tanda koma (,) sebagai pemisah jika lebih dari
                    1
                  </Text>
                </View>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Tempat Agenda
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: COLORS.ExtraDivinder,
                      padding: 1,
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={2}
                      maxLength={50}
                      placeholder="Masukan lokasi"
                      style={{ padding: 5, width: 315, height: 40 }}
                      allowFontScaling={false}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <View
                      style={{
                        marginTop: 10,
                        marginBottom: 10,
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: FONTWEIGHT.bold,
                          fontSize: FONTSIZE.H3,
                        }}
                      >
                        Tanggal Mulai
                      </Text>
                      <Text style={{ color: COLORS.danger }}>*</Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        width: 155,
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
                        style={{ padding: 10, height: 40 }}
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
                  </View>

                  <View>
                    <View
                      style={{
                        marginTop: 10,
                        marginBottom: 10,
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: FONTWEIGHT.bold,
                          fontSize: FONTSIZE.H3,
                        }}
                      >
                        Tanggal Selesai
                      </Text>
                      <Text style={{ color: COLORS.danger }}>*</Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        width: 155,
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
                        style={{ padding: 10, height: 40 }}
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
                  <TouchableOpacity />
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
                          mode="calendar"
                          minuteInterval={30}
                          style={{ borderRadius: 10 }}
                          onSelectedChange={(date) => {
                            const [year, month, day] = date
                              .split("/")
                              .map(Number);
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
                            <Text style={{ color: COLORS.white }}>Ok</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Jenis Pengetahuan
                  </Text>
                  <View>
                    <Dropdown
                      data={dataKategori()}
                      setSelected={setSelectedKategori}
                      borderWidth={1}
                      borderColor={COLORS.ExtraDivinder}
                      borderwidthDrop={1}
                      borderColorDrop={COLORS.ExtraDivinder}
                      borderWidthValue={1}
                      borderColorValue={COLORS.ExtraDivinder}
                      placeholder="Pilih"
                    />
                  </View>
                </View>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Kompetensi Pengetahuan
                  </Text>
                  <View>
                    <Dropdown
                      data={dataKompetensi()}
                      setSelected={setSelectedKategori}
                      borderWidth={1}
                      borderColor={COLORS.ExtraDivinder}
                      borderwidthDrop={1}
                      borderColorDrop={COLORS.ExtraDivinder}
                      borderWidthValue={1}
                      borderColorValue={COLORS.ExtraDivinder}
                      placeholder="Pilih"
                    />
                  </View>
                </View>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Tagar
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: COLORS.ExtraDivinder,
                      padding: 1,
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={2}
                      maxLength={50}
                      placeholder="Masukan Tagar #"
                      style={{ padding: 5, width: 315, height: 40 }}
                      allowFontScaling={false}
                    />
                  </View>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.light,
                      fontSize: FONTSIZE.H4,
                    }}
                  >
                    Note: Gunakan tanda koma (,) sebagai pemisah jika lebih dari
                    1
                  </Text>
                </View>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Ringkasan
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: COLORS.ExtraDivinder,
                      padding: 1,
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={2}
                      maxLength={50}
                      placeholder="Masukan Ringkasan Disini"
                      style={{ padding: 5, width: 315, height: 40 }}
                      allowFontScaling={false}
                    />
                  </View>
                </View>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Deskripsi
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: COLORS.ExtraDivinder,
                      padding: 1,
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={2}
                      maxLength={50}
                      placeholder="Tulis Pesan"
                      style={{ padding: 5, width: 315, height: 150 }}
                      allowFontScaling={false}
                    />
                  </View>
                </View>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Foto Cover
                  </Text>
                  <Pressable onPress={pickDocument}>
                    <View
                      style={{
                        borderWidth: 1,
                        width: "100%",
                        borderRadius: 4,
                        borderColor: COLORS.ExtraDivinder,
                        height: 200,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <View style={{ marginBottom: 10 }}>
                        <Ionicons
                          name="md-cloud-upload-outline"
                          size={30}
                          color={"#66656C"}
                        />
                      </View>
                      <Text style={{ color: "#66656C" }}>
                        Klik Untuk Unggah
                      </Text>
                      <Text style={{ color: "#66656C" }}>
                        *jpeg, *jpg, dan *png
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
                          :{" "}
                          {
                            <Image
                              key={doc.uri}
                              source={{ uri: doc.uri }}
                              style={{ width: 97, height: 97, borderRadius: 8 }}
                            />
                          }
                        </>
                      ))}
                    </View>
                  )}
                </View>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Lampiran
                  </Text>
                  <Pressable onPress={pickDocument}>
                    <View
                      style={{
                        borderWidth: 1,
                        width: "100%",
                        borderRadius: 4,
                        borderColor: COLORS.ExtraDivinder,
                        height: 200,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <View style={{ marginBottom: 10 }}>
                        <Ionicons
                          name="md-cloud-upload-outline"
                          size={30}
                          color={"#66656C"}
                        />
                      </View>
                      <Text style={{ color: "#66656C" }}>
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
                </View>
              </View>
            </View>
            <View
              style={{
                marginLeft: 17,
                flexDirection: "row",
                gap: 10,
                paddingBottom: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#D2B48C",
                  padding: 10,
                  borderRadius: 10,
                  width: "46.5%",
                  height: 50,
                  justifyContent: "center",
                }}
              >
                <Text style={{ textAlign: "center", color: COLORS.white }}>
                  Ubah Draft
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#752A2B",
                  padding: 10,
                  borderRadius: 10,
                  width: "46.5%",
                  height: 50,
                  justifyContent: "center",
                }}
              >
                <Text style={{ textAlign: "center", color: COLORS.white }}>
                  Unggah
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </ScrollView>
      </View>
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
