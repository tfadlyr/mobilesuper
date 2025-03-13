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
import { AVATAR, COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";
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

const kategories = [
  { key: "q", value: "satu" },
  { key: "e", value: "dua" },
  { key: "r", value: "tiga" },
  { key: "t", value: "empat" },
];

export const TambahAgendaEvent = () => {
  const navigation = useNavigation();
  const richText = useRef(null);
  const [richTextHandle, setRichTextHandle] = useState("");
  const [value, onChangeValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisiblePicker, setModalVisiblePicker] = useState(false);
  const [modalVisibleTimePicker, setModalVisibleTimePicker] = useState(false);

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

  const [kategori, setKategori] = useState("");

  const [document, setDocument] = useState([]);
  const [type, setType] = useState([]);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    let tipe = result.uri.split("/");
    tipe = tipe[tipe.length - 1];
    tipe = tipe.split(".");
    tipe = tipe[tipe.length - 1];
    setDocument([...document, result]);
    setType([...type, tipe]);
  };

  const [time, setTime] = useState("");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                      fontSize: 15,
                      fontWeight: 600,
                      color: COLORS.white,
                    }}
                  >
                    Agenda Baru
                  </Text>
                </View>
              </View>

              <View style={styles.Card}>
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
                    Event
                  </Text>
                </View>
                <View style={{ marginHorizontal: 17 }}>
                  <Dropdown
                    data={kategories}
                    setSelected={setKategori}
                    placeHolder={"Pilih Status"}
                    borderWidth={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderwidthDrop={1}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderWidthValue={1}
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
                    Judul Agenda
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
                    placeholder="Masukan Judul"
                    style={{ padding: 10 }}
                    onChangeText={onChangeValue}
                    value={value}
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
                    PIC
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
                    onChangeText={onChangeValue}
                    value={value}
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
                    <TouchableOpacity onPress={bottomSheetMember}>
                      <Ionicons
                        name="people-outline"
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
                    flexDirection: "row",
                    marginHorizontal: 17,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: FONTSIZE.H3,
                    }}
                  >
                    Tanggal
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    flexDirection: "row",
                    marginHorizontal: 17,
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Masukan Tanggal"
                    style={{ padding: 10 }}
                    onChangeText={onChangeValue}
                    value={value}
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
                        size={24}
                        color={COLORS.grey}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 17,
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
                        Waktu Mulai
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
                        style={{ padding: 10 }}
                        onChangeText={onChangeValue}
                        value={value}
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
                          onPress={() => setModalVisibleTimePicker(true)}
                        >
                          <Ionicons
                            name="time-outline"
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
                        Waktu Selesai
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
                        style={{ padding: 10 }}
                        onChangeText={onChangeValue}
                        value={value}
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
                          onPress={() => setModalVisibleTimePicker(true)}
                        >
                          <Ionicons
                            name="time-outline"
                            size={24}
                            color={COLORS.grey}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                {/* datepicker */}
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
                        backgroundColor: COLORS.white,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "90%",
                        height: 500,
                        borderRadius: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setModalVisiblePicker(false)}
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
                          current={moment(Date.now())
                            .locale("id")
                            .format("YYYY-MM-DD")}
                          mode="calendar"
                          minuteInterval={30}
                          style={{ borderRadius: 10 }}
                        />
                        <TouchableOpacity
                          onPress={() => setModalVisiblePicker(false)}
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

                {/* timePicker */}
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisibleTimePicker}
                  onRequestClose={() => {
                    setModalVisibleTimePicker(!modalVisibleTimePicker);
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
                        onPress={() => setModalVisibleTimePicker(false)}
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
                          mode="time"
                          minuteInterval={3}
                          onTimeChange={(selectedTime) => {
                            setTime(selectedTime),
                              setModalVisibleTimePicker(false);
                          }}
                        />
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
                    Peserta
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
                    onChangeText={onChangeValue}
                    value={value}
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
                    <TouchableOpacity onPress={bottomSheetMember}>
                      <Ionicons
                        name="people-outline"
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
                    Tamu
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
                    onChangeText={onChangeValue}
                    value={value}
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
                    <TouchableOpacity onPress={bottomSheetMember}>
                      <Ionicons
                        name="people-outline"
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
                    Tampat Agenda
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
                    onChangeText={onChangeValue}
                    value={value}
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
                  }}
                >
                  <KeyboardAvoidingView style={{ flex: 1 }}>
                    {/* <RichToolbar
                                            editor={richText}
                                            selectedIconTint="#873c1e"
                                            iconTint="#312921"
                                        /> */}
                    <RichEditor
                      ref={richText}
                      onChange={setRichTextHandle}
                      placeholder="Tulis Pesan..."
                      androidHardwareAccelerationDisabled={true}
                      initialHeight={250}
                    />
                  </KeyboardAvoidingView>
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
                    Lampiran
                  </Text>
                </View>
                <Pressable onPress={pickDocument}>
                  <View
                    style={{
                      borderWidth: 1,
                      width: "90%",
                      marginLeft: 17,
                      borderRadius: 4,
                      borderColor: COLORS.ExtraDivinder,
                      height: 250,
                      marginBottom: 20,
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
                    <Text style={{ color: "#66656C" }}>Klik Untuk Unggah</Text>
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
                <View style={{ marginVertical: 10, marginHorizontal: 17 }}>
                  <Text style={{ color: COLORS.lighter }}>
                    *) Hanya png, jpg, jpeg, pdf, doc, docx, ppt, pptx, xls,
                    xlsx yang akan diterima dan ukuran file maks 100 MB
                  </Text>
                </View>
              </View>
            </Pressable>
          </ScrollView>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={{ position: "absolute", right: 30, bottom: 100 }}>
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
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={{ fontWeight: 500 }}>Pilih Member</Text>
                </View>
                <View
                  style={{
                    width: "90%",
                    marginHorizontal: 20,
                    marginVertical: 20,
                  }}
                >
                  <Search placeholder={"Cari"} />
                </View>
                <View>
                  <FlatList
                    data={dataFilter}
                    horizontal={true}
                    renderItem={({ item }) => (
                      <CardPilihMember
                        nama={item.nama}
                        avatar={item.avatar}
                        id={item.id}
                        handleClickItem={handleClickItem}
                        filter={true}
                      />
                    )}
                  />
                </View>
                <View>
                  <FlatList
                    data={items}
                    renderItem={({ item }) => (
                      <CardPilihMember
                        nama={item.nama}
                        avatar={item.avatar}
                        id={item.id}
                        handleClickItem={handleClickItem}
                        filter={false}
                      />
                    )}
                  />
                </View>
              </View>
            </BottomSheetView>
          </BottomSheetModal>

          {value === "" ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
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
                    onPress={() => setModalVisible(false)}
                    style={{ marginTop: 5, paddingRight: "80%" }}
                  >
                    <Ionicons name="close-outline" size={24} />
                  </TouchableOpacity>
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
                      <Text>Terjadi Kesalahan!</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
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
                        <Text style={{ color: COLORS.white }}>Ok</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          ) : (
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
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
                    onPress={() => setModalVisible(false)}
                    style={{ marginTop: 5, paddingRight: "80%" }}
                  >
                    <Ionicons name="close-outline" size={24} />
                  </TouchableOpacity>
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
                      <Text>Berhasil Ditambahkan!</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
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
                        <Text style={{ color: COLORS.white }}>Ok</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
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
