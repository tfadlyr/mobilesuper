import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import {} from "react-native-safe-area-context";
import {
  AVATAR,
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../components/Loading";
import moment from "moment/min/moment-with-locales";
import { getTokenValue } from "../../service/session";
import {
  getDocumentAttachmentSPPD,
  getDocumentCetakSPPD,
  getDocumentDetailPersonalSPPD,
} from "../../service/api";
import * as FileSystem from "expo-file-system";
const { StorageAccessFramework } = FileSystem;
import * as Sharing from "expo-sharing";

export const DetailDokumenSPPD = ({ route }) => {
  const { data } = route.params;
  const navigation = useNavigation();

  const [collapse, setCollapse] = useState({
    id: 0,
    toggle: false,
  });

  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const { dokumen } = useSelector((state) => state.sppd);
  const { device } = useSelector((state) => state.apps);

  const hari = dokumen.detail?.days?.toString();

  // const downloadAndSaveFile = async (base64Data, fileName) => {
  //   try {
  //     // Decode base64 ke blob
  //     const pdfBlob = base64Data.split(",")[1];

  //     // Mendapatkan direktori dokumen
  //     const directory = `${FileSystem.documentDirectory}${fileName}`;

  //     // Menyimpan file PDF ke direktori dokumen
  //     await FileSystem.writeAsStringAsync(directory, pdfBlob, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     // Sekarang Anda dapat menggunakan file URL untuk merujuk ke file PDF
  //     // Misalnya, membuka file menggunakan expo-document-viewer
  //     // (pastikan untuk menginstal expo-document-viewer terlebih dahulu)

  //     // Contoh membuka file PDF dengan expo-document-viewer
  //     // import { openFileAsync } from 'expo-document-viewer';
  //     // await openFileAsync({ url: directory, fileName });
  //   } catch (error) {
  //     console.error("Gagal mengonversi base64 ke URL:", error);
  //   }
  // };

  const downloadFile = async (fileUrl, fileType, fileName) => {
    //alert(fileName)

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        downloadPath + "cek.pdf",
        { headers: { Authorization: token } }
      );
      try {
        // if (Platform.OS === "android") {
        //   const { uri } = await downloadResumable.downloadAsync();
        //   saveAndroidFile(uri, fileName, fileType);
        // } else {
        const { uri } = await downloadResumable.downloadAsync();
        saveIosFile(uri);
        // }
      } catch (e) {
        // setIsLoading(false);
        console.error("download error:", e);
      }
    } catch (e) {}
  };
  const saveAndroidFile = async (fileUri, fileName, fileType) => {
    try {
      const fileString = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        return;
      }

      try {
        await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          fileType
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, fileString, {
              encoding: FileSystem.EncodingType.Base64,
            });
            Alert.alert("Success!", "Download Successfully.");
          })
          .catch((e) => {
            Alert.alert(
              "Failed!",
              "Download Unsuccessful. Please choose another folder to download file."
            );
          });
      } catch (e) {
        throw new Error(e);
      }
    } catch (err) {}
  };
  const saveIosFile = async (fileUri) => {
    try {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
      });
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  // const openFile = async () => {
  // let remoteUrl = surat;
  // let localPath = `${FileSystem.documentDirectory}/samplee.pdf`;
  // FileSystem.downloadAsync(remoteUrl, localPath).then(async ({ uri }) => {
  //   const contentURL = await FileSystem.getContentUriAsync(uri);
  //   try {
  //     if (Platform.OS == "android") {
  //       // open with android intent
  //       await IntentLauncher.startActivityAsync(
  //         "android.intent.action.VIEW",
  //         {
  //           data: contentURL,
  //           flags: 1,
  //           type: "application/pdf",
  //           // change this with any type of file you want
  //           // excel sample type
  //           // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //         }
  //       );
  //       // or
  //       // Sharing.shareAsync(localPath);
  //     } else if (Platform.OS == "ios") {
  //       Sharing.shareAsync(localPath);
  //     }
  //   } catch (error) {
  //     Alert.alert("INFO", JSON.stringify(error));
  //   }
  // });
  // };

  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDocumentDetailPersonalSPPD(params));
  };
  return (
    <>
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
          <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
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
              color: COLORS.white,
            }}
          >
            Detail Dokumen
          </Text>
        </View>
      </View>

      <View style={{ paddingVertical: 20, marginHorizontal: "5%" }}>
        <ScrollView style={{ height: "90%" }}>
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                fontSize: device === "tablet" ? 30 : 20,
                fontWeight: 600,
                marginVertical: 10,
              }}
            >
              {data}
            </Text>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Tanggal Mulai
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {moment(dokumen.detail?.start_date, "DD-MM-YYYY")
                  .locale("id")
                  .format(DATETIME.LONG_DATE)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Tanggal Selesai
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {moment(dokumen.detail?.end_date, "DD-MM-YYYY")
                  .locale("id")
                  .format(DATETIME.LONG_DATE)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Jumlah Hari
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {hari}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Tujuan
              </Text>

              <View style={{ gap: 10, width: "60%", paddingRight: 20 }}>
                {/* <Text style={{ fontSize: 13, fontWeight: 400 }}>
                  KABUPATEN MANGGARAI BARAT - Labuan Bajo
                </Text>
                <Text style={{ fontSize: 13, fontWeight: 400 }}>
                  KOTA KUPANG - Hotel Nusantara
                </Text>
                <Text style={{ fontSize: 13, fontWeight: 400 }}>
                  KOTA DENPASAR - Hotel Kempinsky
                </Text> */}
                {dokumen.detail?.venue?.map((item) => {
                  return (
                    <Text
                      style={{ fontSize: fontSizeResponsive("H2", device) }}
                    >
                      {item.locations}
                    </Text>
                  );
                })}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Tujuan Provinsi
              </Text>
              <View style={{ gap: 10, width: "60%", paddingRight: 20 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 400,
                  }}
                >
                  {dokumen.detail?.province}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Penanggung Jawab
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {dokumen.detail?.officer?.name} / {dokumen.detail?.officer?.nip}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Penanggung Jawab Unit Kerja
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {dokumen.detail?.officer_unker?.name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Satker Penanggung Jawab
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {dokumen.detail?.officer_satker}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginVertical: 10,
              gap: 10,
              alignItems: "center",
            }}
          >
            <Ionicons name="people-outline" size={24} />
            <Text
              style={{
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: 600,
              }}
            >
              Daftar Pelaksana
            </Text>
          </View>

          {dokumen.detail?.participant?.map((item) => {
            return (
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 8,
                  //shadow ios
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  //shadow android
                  elevation: 2,
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => setCollapse({ id: item.id, toggle: true })}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 10,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H2", device),
                          fontWeight: 600,
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H2", device),
                          fontWeight: 400,
                        }}
                      >
                        {item.nip}
                      </Text>
                    </View>
                    {collapse.toggle === true && collapse.id === item.id ? (
                      <TouchableOpacity
                        onPress={() => setCollapse({ toggle: false })}
                      >
                        <Ionicons name="chevron-up-outline" size={24} />
                      </TouchableOpacity>
                    ) : (
                      <Ionicons name="chevron-down-outline" size={24} />
                    )}
                  </View>
                </TouchableOpacity>

                {collapse.toggle === true && collapse.id === item.id ? (
                  <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                    <TouchableOpacity
                      onPress={() => setCollapse({ toggle: false })}
                    >
                      <View style={{ gap: 10 }}>
                        <View>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H2", device),
                              fontWeight: 400,
                              paddingHorizontal: 10,
                            }}
                          >
                            Golongan
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H2", device),
                              fontWeight: 600,
                              paddingHorizontal: 10,
                            }}
                          >
                            {item.tier}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H2", device),
                              fontWeight: 400,
                              paddingHorizontal: 10,
                            }}
                          >
                            Tempat Kedudukan
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H2", device),
                              fontWeight: 600,
                              paddingHorizontal: 10,
                            }}
                          >
                            {item.office_city}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{
                            backgroundColor: COLORS.info,
                            height: 50,
                            borderRadius: 8,
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            getDetail(item.id);
                            navigation.navigate("DetailDokumenPersonal");
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              fontSize: fontSizeResponsive("H2", device),
                              fontWeight: 500,
                              color: COLORS.white,
                            }}
                          >
                            Detail Dokumen Personal
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};
