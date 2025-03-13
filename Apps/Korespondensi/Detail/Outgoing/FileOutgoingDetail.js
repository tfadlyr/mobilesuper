import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
} from "../../../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { ScrollView } from "react-native";

export const FileOutgoingDetail = ({ navigation }) => {
  const [document, setDocument] = useState([]);
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    // const file = convertFileToObject(result)
    let tipe = result.uri.split("/");
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

  return (
    <View style={{ padding: 20 }}>
      <View
        style={{
          backgroundColor: COLORS.white,
          width: 80,
          height: 80,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
        }}
      >
        <Ionicons name="document-outline" size={48} color={COLORS.primary} />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: COLORS.infoDanger,
          height: 50,
          borderRadius: 8,
          flexDirection: "row",
          gap: 20,
          marginVertical: 20,
          justifyContent: "center",
          alignItems: "center",
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
        }}
      >
        <Ionicons name="eye-outline" size={15} color={COLORS.white} />
        <Text style={{ fontSize: 13, fontWeight: 500, color: COLORS.white }}>
          Lihat Surat
        </Text>
      </TouchableOpacity>

      <ScrollView style={{ height: "75%" }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 16,
            padding: 20,
            gap: 20,
          }}
        >
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              Ganti File Surat
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
                          source={require("../../../../assets/superApp/word.png")}
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
                          source={require("../../../../assets/superApp/pdf.png")}
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
                          source={require("../../../../assets/superApp/ppt.png")}
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
                          source={require("../../../../assets/superApp/excel.png")}
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
          <View style={{ gap: 20, marginBottom: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              Ganti File Surat
            </Text>
            <View style={{ gap: 10 }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderWidth: 1,
                  borderColor: "#DBDADE",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  borderRadius: 6,
                }}
              >
                <Image
                  source={require("../../../../assets/superApp/pdf.png")}
                />
              </View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: COLORS.lighter,
                  textAlign: "center",
                }}
              >
                Nama File
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: COLORS.lighter,
                  textAlign: "center",
                }}
              >
                Nama File.pdf
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("DetailSuratUnggahan")}
                style={{
                  backgroundColor: COLORS.infoDanger,
                  height: 50,
                  width: 100,
                  borderRadius: 8,
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center",
                  //shadow ios
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  //shadow android
                  elevation: 2,
                }}
              >
                <Ionicons name="eye-outline" size={15} color={COLORS.white} />
                <Text
                  style={{ fontSize: 13, fontWeight: 500, color: COLORS.white }}
                >
                  Lihat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ gap: 20, marginBottom: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              Ganti File Surat
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: COLORS.lighter,
                textAlign: "center",
              }}
            >
              Tidak ada file yang diunggah
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
