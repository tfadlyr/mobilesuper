import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  FONTSIZE,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CardListPesertaAddresbook } from "../../components/CardListPesertaAddresbook";
import DatePicker from "react-native-modern-datepicker";
import moment from "moment";
import {
  postAttachmentRepo,
  postDokumenTamplate,
  putDokumenTamplate,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import { Loading } from "../../components/Loading";
import * as DocumentPicker from "expo-document-picker";
import { ModalSubmit } from "../../components/ModalSubmit";
import { setAttachments, setStatus } from "../../store/Repository";

export const TambahDokumenTamplate = ({ route }) => {
  const item = route.params;
  const { device } = useSelector((state) => state.apps);
  const navigation = useNavigation();
  const [stateConfig, setStateConfig] = useState({});
  const [token, setToken] = useState("");
  const [namaTemplate, setNamaTemplate] = useState("");

  const [deskripsi, setDeskripsi] = useState("");

  const [document, setDocument] = useState([]);
  const [type, setType] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
    dispatch(setAttachments([]));
  }, []);

  useEffect(() => {
    if (item?.type === "edit") {
      setNamaTemplate(item.data.title);
      setDeskripsi(item.data.attributes.deskripsi);
    }
  }, [item]);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    // const file = convertFileToObject(result)
    let tipe = result.assets[0].uri.split("/");
    tipe = tipe[tipe.length - 1];
    tipe = tipe.split(".");
    tipe = tipe[tipe.length - 1];
    console.log(result);
    const size = (result.assets[0].size / (1024 * 1024)).toFixed(3);

    if (size <= 100 && (tipe === "ppt" || tipe === "pptx")) {
      setDocument([...document, result.assets]);
      setType([...type, tipe]);
      const data = {
        token: token,
        result: result.assets[0],
      };
      dispatch(postAttachmentRepo(data));
    } else
      Alert.alert(
        "Peringatan",
        "File terlalu besar, maksimal 10MB atau format file bukan ppt/pptx"
      );
  };

  const handleSubmit = (action) => {
    let attachments = [];
    attachment.map((item) => {
      attachments.push(item.id);
    });

    let payloadAttachment = [];
    item?.data?.attachments.map((item) => {
      payloadAttachment.push(item.id);
    });

    const currentDate = new Date(); // Current date and time

    const result = {
      attachments: item?.type === "edit" ? payloadAttachment : attachments,
      attributes: {
        deskripsi: deskripsi,
        send_notification: false,
        tanggal: currentDate,
        tempat: "-",
      },
      title: namaTemplate,
      reviewers_ids: [],
      action: "submit",
      published: action === "publish" ? true : false,
      public: true,
    };

    const datas = {
      token: token,
      result: result,
    };

    const data = {
      token: token,
      result: result,
      id: item?.data?.id,
    };

    if (item?.type === "edit") {
      dispatch(putDokumenTamplate(data));
    } else {
      dispatch(postDokumenTamplate(datas));
    }
  };

  const { attachment, loading, status } = useSelector(
    (state) => state.repository
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ display: "flex", flex: 1 }}
    >
      {loading ? <Loading /> : null}
      <ScrollView style={{ display: "flex", flex: 1 }}>
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
              backgroundColor: "white",
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
          <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: 600,
                color: "white",
              }}
            >
              Tambah Dokumen Tamplate
            </Text>
          </View>
        </View>

        <View
          style={{
            padding: 5,
            backgroundColor: COLORS.white,
            borderRadius: 8,
            margin: 18,
          }}
        >
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
                fontSize: fontSizeResponsive("H3", device),
              }}
            >
              Nama Template
            </Text>
            <Text style={{ color: COLORS.danger }}>*</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              width: device === "tablet" ? "97%" : "90%",
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
              placeholder="Masukan Nama Template"
              style={{
                padding: 10,
                fontSize: fontSizeResponsive("H3", device),
              }}
              onChangeText={setNamaTemplate}
              value={namaTemplate}
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
                fontSize: fontSizeResponsive("H3", device),
              }}
            >
              Deskripsi
            </Text>
            <Text style={{ color: COLORS.danger }}>*</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              width: device === "tablet" ? "97%" : "90%",
              marginLeft: 17,
              borderRadius: 4,
              borderColor: COLORS.ExtraDivinder,
              marginBottom: item?.type === "edit" ? 20 : 0,
            }}
          >
            <TextInput
              editable
              multiline
              numberOfLines={4}
              placeholder="Masukan Deskripsi"
              style={{
                padding: 10,
                height: 100,
                fontSize: fontSizeResponsive("H3", device),
              }}
              onChangeText={setDeskripsi}
              value={deskripsi}
              allowFontScaling={false}
            />
          </View>

          {item?.type === "edit" ? null : (
            <>
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
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Lampiran (file template)
                </Text>
                <Text style={{ color: COLORS.danger }}>*</Text>
              </View>

              <Pressable onPress={pickDocument}>
                <View
                  style={{
                    borderWidth: 1,
                    width: device === "tablet" ? "97%" : "90%",
                    marginLeft: 17,
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    height: 250,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <View>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={device == "tablet" ? 40 : 30}
                      color={"#66656C"}
                    />
                  </View>
                  <Text
                    style={{
                      color: "#66656C",
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Klik Untuk Unggah
                  </Text>
                </View>
              </Pressable>

              <View
                style={{
                  marginHorizontal: 17,
                  marginTop: 5,
                  marginBottom: document.length == 0 ? 20 : 0,
                }}
              >
                <Text
                  style={{
                    color: COLORS.lighter,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  *) Hanya ppt, pptx yang akan diterima dan ukuran file maks 10
                  MB
                </Text>
              </View>
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
                      {type[i] === "pdf" ? (
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
                      ) : type[i] === "ppt" || "pptx" ? (
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
            </>
          )}
        </View>

        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: COLORS.primary,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 18,
            marginTop: 10,
          }}
          onPress={() => {
            handleSubmit("publish");
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            Kirim
          </Text>
        </TouchableOpacity>

        <ModalSubmit
          status={status}
          setStatus={setStatus}
          messageSuccess={"Data Ditambahkan"}
          navigate={"MainRepo"}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
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
