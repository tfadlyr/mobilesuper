import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { Dropdown } from "../../components/DropDown";
import { useDispatch, useSelector } from "react-redux";
import { getParts, postTicket } from "../../service/api";
import { getTokenValue } from "../../service/session";
import * as DocumentPicker from "expo-document-picker";
import { setStatus } from "../../store/HelpDesk";

export const HDFormLaporan = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { parts, status } = useSelector((state) => state.helpDesk);
  const { profile } = useSelector((state) => state.superApps);
  const [aplikasi, setAplikasi] = useState("");
  const [request, setRequest] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    dispatch(getParts());
  }, []);
  const DataAplikasi = () => {
    let app = [];
    parts.data?.map((item) => {
      app.push({
        key: item.id,
        value: item.name,
      });
    });
    return app;
  };
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);
  const handleSubmit = () => {
    const payload = {
      requestor: profile.nip,
      request: request,
      part: aplikasi.key,
      evident: document.uri,
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postTicket(data));
  };

  const [document, setDocument] = useState([]);
  const [type, setType] = useState([]);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
    // const file = convertFileToObject(result)
    let tipe = result.assets[0].uri.split("/");
    tipe = tipe[tipe.length - 1];
    tipe = tipe.split(".");
    tipe = tipe[tipe.length - 1];
    setDocument([...document, result]);
    setType([...type, tipe]);

    const data = {
      // token: token,
      result: result,
    };
  };

  const { device } = useSelector((state) => state.apps);

  return (
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
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H3", device),
              fontWeight: 600,
              color: COLORS.white,
              marginRight: 50,
            }}
          >
            Form Laporan
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
        }}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "90%",
              marginTop: "5%",
              borderRadius: 8,
              padding: "5%",
              alignItems: "center",
              gap: 10,
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
          >
            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Kendala / Permintaan
                </Text>
                <Text style={{ color: COLORS.danger }}>*</Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: COLORS.ExtraDivinder,
                }}
              >
                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholder="Ketikkan Sesuatu"
                  style={{ padding: 10 }}
                  onChangeText={setRequest}
                  value={request}
                  allowFontScaling={false}
                />
              </View>
            </View>

            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Aplikasi
                </Text>
                <Text style={{ color: COLORS.danger }}>*</Text>
              </View>
              <View
                style={{
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: COLORS.ExtraDivinder,
                }}
              >
                <Dropdown
                  placeHolder={"Pilih Aplikasi"}
                  data={DataAplikasi()}
                  setSelected={setAplikasi}
                  selected={aplikasi}
                  borderWidth={1}
                  borderwidthDrop={1}
                  borderWidthValue={1}
                  borderColor={COLORS.ExtraDivinder}
                  borderColorDrop={COLORS.ExtraDivinder}
                  borderColorValue={COLORS.ExtraDivinder}
                  search={true}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: COLORS.white,
              width: "90%",
              marginTop: "5%",
              borderRadius: 8,
              padding: "5%",
              alignItems: "center",
              gap: 10,
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
          >
            <View style={{ width: "100%" }}>
              <View
                style={{
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
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    height: 250,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <View style={{ marginBottom: 10 }}>
                    <Ionicons
                      name="cloud-download-outline"
                      size={device === "tablet" ? 40 : 30}
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
              {document < 1 ? null : (
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
                      {type[i] === "png" || "jpg" || "jpeg" ? (
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
                          {/* <Image
                                source={{uri: doc.uri}}
                              /> */}
                          <Ionicons size={24} name="image-outline"></Ionicons>
                        </View>
                      ) : null}
                    </>
                  ))}
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={{
              width: "90%",
              backgroundColor: COLORS.primary,
              marginTop: "5%",
              borderRadius: 8,
              alignItems: "center",
              paddingVertical: 16,
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
            onPress={() => {
              handleSubmit();
            }}
          >
            <View
              style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
            >
              <Ionicons name="send-outline" size={24} color={COLORS.white} />
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Kirim
              </Text>
            </View>
          </TouchableOpacity>
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
                  <Ionicons name="close-outline" size={24} />
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
                        <Text>Berhasil Ditambahkan!</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(setStatus(""));
                          navigation.navigate("HelpDesk");
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
                          <Text style={{ color: COLORS.white }}>Ok</Text>
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
                      <Text>Terjadi Kesalahan!</Text>
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
                        <Text style={{ color: COLORS.white }}>Ok</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
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
