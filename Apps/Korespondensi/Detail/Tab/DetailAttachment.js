import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Button, Dialog, IconButton, ProgressBar } from "react-native-paper";
import { GlobalStyles } from "../../../../constants/styles";
import { getExtensionIcon, initDownload } from "../../../../utils/agenda";

import * as FileSystem from "expo-file-system";
import { headerToken } from "../../../../utils/http";
const { StorageAccessFramework } = FileSystem;
import * as Sharing from "expo-sharing";
import LoadingOverlay from "../../../../components/UI/LoadingOverlay";
import { nde_api } from "../../../../utils/api.config";
import { useDispatch } from "react-redux";
import { setPrevAgenda } from "../../../../store/referensi";
import { COLORS } from "../../../../config/SuperAppps";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// import * as MediaLibrary from "expo-media-library";
// import * as FileSystem from "expo-file-system";
// import * as Permissions from "expo-permissions";

function DetailAttachment({ data, id, tipeRef }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const [header, setHeader] = useState();
  const [extensionPdf, setExtensionPdf] = useState(false);
  const [selectedAttach, setSelectedAttach] = useState();
  const [selectedIconAttach, setSelectedIconAttach] = useState();

  const [downloadProgress, setDownloadProgress] = useState(0);
  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");

  const bottomSheetRefAttach = useRef(null);
  const snapPoint = useMemo(() => [50, 250], []);
  const snapPointPdf = useMemo(() => [50, 320], []);
  let attachment = [];
  useEffect(() => {
    if (header == undefined) {
      getHeader();
    }
  }, [header]);
  async function getHeader() {
    let response = await headerToken();
    setHeader(response);
  }
  function showBottommSheet(item, icon, tipe) {
    let temp;
    if (tipe == "attach") {
      temp = item?.filename?.split(".");
    } else {
      temp = item?.description?.split(".");
    }
    if (temp?.length != 0) {
      if (temp[temp?.length - 1] == "pdf") {
        setExtensionPdf(true);
      } else {
        setExtensionPdf(false);
      }
    }
    item.tipe = tipe;
    setSelectedIconAttach(icon);
    setSelectedAttach(item);
    bottomSheetRefAttach.current.present();
  }
  const ensureDirAsync = async (dir, intermediates = true) => {
    const props = await FileSystem.getInfoAsync(dir);
    if (props.exist && props.isDirectory) {
      return props;
    }
    let _ = await FileSystem.makeDirectoryAsync(dir, { intermediates });
    return await ensureDirAsync(dir, intermediates);
  };
  const downloadCallback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };
  const downloadAll = async () => {
    //alert(fileName)
    data?.attachments?.map(async (item, index) => {
      // setIsLoading(true);
      let fileUrl = item.file;
      let fileType = item.description;
      let fileName = item.filename;
      if (Platform.OS == "android") {
        const dir = ensureDirAsync(downloadPath);
      }
      fileName = item.filename.split("/")[3];

      const downloadResumable = FileSystem.createDownloadResumable(
        nde_api.baseurl + fileUrl,
        downloadPath + fileName,
        { headers: header },
        downloadCallback
      );

      try {
        const { uri } = await downloadResumable.downloadAsync();
        if (Platform.OS == "android") {
          attachment.push({ uri: uri, filename: fileName, filetype: fileType });
          if (index == data?.attachments.length - 1) {
            saveAllAndroidFile();
          }
        } else saveIosFile(uri);
      } catch (e) {
        setIsLoading(false);
        console.error("download error:", e);
      }
    });
  };

  const saveAllAndroidFile = async () => {
    try {
      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        return;
      }

      try {
        attachment.map(async (e, i) => {
          const fileString = await FileSystem.readAsStringAsync(e.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          await StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            e.filename,
            e.filetype
          )
            .then(async (uri) => {
              setIsLoading(true);
              await FileSystem.writeAsStringAsync(uri, fileString, {
                encoding: FileSystem.EncodingType.Base64,
              });
              setIsLoading(false);
              if (i == attachment.length - 1) {
                Alert.alert("Success!", "Download Successfully");
              }
            })
            .catch((e) => {
              setIsLoading(false);
            });
        });
      } catch (e) {
        setIsLoading(false);
        throw new Error(e);
      }
    } catch (err) {}
  };
  // const initDownload = (item) => {
  //   let fileUrl, fileType, fileName;
  //   if (item.tipe == "sign") {
  //     bottomSheetRefAttach?.current?.dismiss();
  //     // setIsLoading(true);
  //     fileUrl = item.link;
  //     fileType = "application/pdf";
  //     if (item.tipe == "attach") {
  //       fileName = item.filename;
  //     } else {
  //       fileName = item.description;
  //     }
  //   } else {
  //     bottomSheetRefAttach?.current?.dismiss();
  //     // setIsLoading(true);
  //     fileUrl = item.file;
  //     fileType = item.description;
  //     fileName = item.filename;
  //     fileName = item.filename.split("/")[3];
  //   }
  //   downloadFile(fileUrl, fileType, fileName);
  // };
  // const downloadFile = async (fileUrl, fileType, fileName) => {
  //   if (Platform.OS == "android") {
  //     const dir = ensureDirAsync(downloadPath);
  //   }
  //   //alert(fileName)
  //   const downloadResumable = FileSystem.createDownloadResumable(
  //     nde_api.baseurl + fileUrl,
  //     downloadPath + fileName,
  //     { headers: header },
  //     downloadCallback
  //   );
  //   try {
  //     const { uri } = await downloadResumable.downloadAsync();
  //     if (Platform.OS == "android") saveAndroidFile(uri, fileName, fileType);
  //     else saveIosFile(uri);
  //   } catch (e) {
  //     setIsLoading(false);
  //     console.error("download error:", e);
  //   }
  // };
  // const saveAndroidFile = async (fileUri, fileName, fileType) => {
  //   try {
  //     const fileString = await FileSystem.readAsStringAsync(fileUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     const permissions =
  //       await StorageAccessFramework.requestDirectoryPermissionsAsync();
  //     if (!permissions.granted) {
  //       return;
  //     }

  //     try {
  //       await StorageAccessFramework.createFileAsync(
  //         permissions.directoryUri,
  //         fileName,
  //         fileType
  //       )
  //         .then(async (uri) => {
  //           await FileSystem.writeAsStringAsync(uri, fileString, {
  //             encoding: FileSystem.EncodingType.Base64,
  //           });
  //           bottomSheetRefAttach.current?.dismiss();
  //           Alert.alert("Success!", "Download Successfully.");
  //         })
  //         .catch((e) => {
  //           Alert.alert(
  //             "Failed!",
  //             "Download Unsuccessful. Please choose another folder to download file."
  //           );
  //         });
  //     } catch (e) {
  //       throw new Error(e);
  //     }
  //   } catch (err) {}
  // };

  // const saveIosFile = async (fileUri) => {
  //   try {
  //     const UTI = "public.item";
  //     const shareResult = await Sharing.shareAsync(fileUri, { UTI });
  //   } catch (error) {}
  // };
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.screen}>
          {loadingOverlay}
          {data?.attachments?.length > 1 && data?.is_editable == "1" && (
            <View style={[styles.container, { marginBottom: 12 }]}>
              <Text style={styles.titleLabel}>
                Daftar Lampiran Sudah Diupload
              </Text>
              {/* <View
              style={[styles.containerRow, { justifyContent: "space-between" }]}
            >
              <Text style={styles.titleLabel}>Attachments</Text>
              {data?.attachments?.length != 0 && Platform.OS == "android" && (
              <TouchableOpacity onPress={downloadAll}>
                <Text style={styles.linkText}>Download All</Text>
              </TouchableOpacity>
            )}
            </View> */}
              {data?.attachments?.length <= 1 && <Text>-</Text>}
              {data?.attachments?.length > 1 &&
                data?.attachments?.map((item, index) => (
                  <>
                    {item.description != "editor-generated" && (
                      <TouchableOpacity
                        key={index}
                        style={styles.containerContent}
                        onPress={() => {
                          initDownload(item);
                        }}
                      >
                        <IconButton
                          icon={getExtensionIcon(item)}
                          size={18}
                          style={styles.iconContent}
                        />
                        <View style={{ width: "85%" }}>
                          <Text style={styles.textContent}>{item?.name}</Text>
                          <Text style={styles.subtextContent}>
                            {item?.size}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </>
                  // <>
                  //   {item.description != "editor-generated" && (
                  //     <View
                  //       key={index}
                  //       style={{
                  //         flexDirection: "column",
                  //         justifyContent: "center",
                  //         alignItems: "center",
                  //       }}
                  //     >
                  //       <View
                  //         style={{
                  //           backgroundColor: COLORS.white,
                  //           borderRadius: 16,
                  //           padding: 20,
                  //           width: 90,
                  //           elevation: 1,
                  //         }}
                  //       >
                  //         {item?.description?.includes("pdf") && (
                  //           <Image
                  //             source={require("../../../../assets/superApp/pdf.png")}
                  //             style={{ width: 50, height: 50 }}
                  //           />
                  //         )}
                  //         {item?.description?.includes("word") && (
                  //           <Image
                  //             source={require("../../../../assets/superApp/word.png")}
                  //             style={{ width: 50, height: 50 }}
                  //           />
                  //         )}
                  //         {item?.description?.includes("presentation") && (
                  //           <Image
                  //             source={require("../../../../assets/superApp/ppt.png")}
                  //             style={{ width: 50, height: 50 }}
                  //           />
                  //         )}
                  //         {item?.description?.includes("compress") && (
                  //           <Image
                  //             source={require("../../../../assets/superApp/rar.png")}
                  //             style={{ width: 50, height: 50 }}
                  //           />
                  //         )}
                  //         {item?.description?.includes("png") && (
                  //           <Image
                  //             source={require("../../../../assets/superApp/png.png")}
                  //             style={{ width: 50, height: 50 }}
                  //           />
                  //         )}
                  //       </View>
                  //       <View
                  //         style={{
                  //           flexDirection: "column",
                  //           alignItems: "center",
                  //           marginBottom: 20,
                  //         }}
                  //       >
                  //         <Text
                  //           style={[styles.textContent, { textAlign: "center" }]}
                  //         >
                  //           {item?.name}
                  //         </Text>
                  //         <Text style={styles.subtextContent}>{item?.size}</Text>
                  //       </View>
                  //       <Button
                  //         mode="contained"
                  //         style={[
                  //           {
                  //             width: "100%",
                  //             backgroundColor: GlobalStyles.colors.primary,
                  //             marginBottom: 16,
                  //           },
                  //         ]}
                  //         onPress={() => {
                  //           initDownload(item);
                  //           // navigation.navigate("ViewAttachment", {
                  //           //   selected: item,
                  //           //   title: "Lihat Surat",
                  //           // });
                  //         }}
                  //         icon={() => (
                  //           <Ionicons
                  //             name="share-social"
                  //             size={20}
                  //             color={COLORS.white}
                  //           />
                  //         )}
                  //       >
                  //         Share
                  //       </Button>
                  //       {/* <Button
                  //   onPress={() => initDownload(item)}
                  //   mode="contained"
                  //   style={[
                  //     {
                  //       width: "100%",
                  //       backgroundColor: GlobalStyles.colors.blue,
                  //       marginBottom: 16,
                  //     },
                  //   ]}
                  //   icon={() => (
                  //     <Ionicons
                  //       name="download-outline"
                  //       size={20}
                  //       color={COLORS.white}
                  //     />
                  //   )}
                  // >
                  //   Unduh Surat
                  // </Button> */}
                  //     </View>
                  //   )}
                  // </>
                ))}
            </View>
          )}
          {/* {downloadProgress != 1 && (
            <Dialog visible={downloadProgress != 1 && downloadProgress != 0}>
              <Dialog.Content>
                <ProgressBar progress={downloadProgress} />
                <Text>{downloadProgress.toFixed(2) * 100} %</Text>
              </Dialog.Content>
            </Dialog>
          )} */}
          <View style={[styles.container, { marginBottom: 12 }]}>
            {data?.references && (
              <Text style={styles.titleLabel}>Referensi</Text>
            )}
            <View>
              {data?.references?.length == 0 && <Text>-</Text>}
              {data?.references?.length != 0 &&
                data?.references?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (item.new_url?.split("/")[3] == "0") {
                        Alert.alert("Peringatan!", "Dokumen tidak ditemukan");
                      } else {
                        if (tipeRef == "in") {
                          dispatch(setPrevAgenda({ id: id, tipe: "m" }));
                        } else if (tipeRef == "disposition") {
                          dispatch(setPrevAgenda({ id: id, tipe: "d" }));
                        } else if (tipeRef == "out") {
                          dispatch(setPrevAgenda({ id: id, tipe: "k" }));
                        } else if (tipeRef == "scanlog") {
                          dispatch(setPrevAgenda({ id: id, tipe: "m" }));
                        } else if (
                          tipeRef == "TrackingDetail" ||
                          tipeRef == "NeedFollowUpDetail" ||
                          tipeRef == "ReferenceDetail"
                        ) {
                          dispatch(
                            setPrevAgenda({ id: item?.notadinas, tipe: "s" })
                          );
                        }
                        navigation.navigate("ReferenceDetail", {
                          id: item?.new_url?.split("/")[3],
                          title: "Detail Referensi",
                        });
                      }
                    }}
                  >
                    <View style={[styles.containerContent, { width: "100%" }]}>
                      <IconButton
                        icon="file"
                        size={18}
                        style={styles.iconContent}
                      />
                      <Text style={[styles.textContent, { width: "85%" }]}>
                        {item.subject}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          {/* {data?.template?.name == "nota_external" && (
          <View style={styles.container}>
            <Text style={styles.titleLabel}>Digital Signed</Text>
            <View>
              {data?.attachments_signed?.length == 0 && <Text>-</Text>}
              {data?.attachments_signed?.length != 0 &&
                data?.attachments_signed?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      showBottommSheet(item, getExtensionIcon(item), "sign");
                    }}
                  >
                    <View style={styles.containerContent}>
                      <IconButton
                        icon={getExtensionIcon(item)}
                        size={18}
                        style={styles.iconContent}
                      />
                      <View style={{ width: "60%" }}>
                        <Text>{item?.description}</Text>
                        <Text>{item?.signed_by}</Text>
                      </View>
                      <View style={{ width: "25%" }}>
                        <Text style={{ textAlign: "right" }}>
                          {item?.created_date}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )} */}
        </ScrollView>
        <BottomSheetModalProvider>
          <SafeAreaView>
            <View>
              <BottomSheetModal
                name="download"
                ref={bottomSheetRefAttach}
                index={1}
                snapPoints={
                  extensionPdf && selectedAttach?.tipe != "sign"
                    ? snapPointPdf
                    : snapPoint
                }
                keyboardBehavior={
                  Platform?.OS == "android" ? "fillParent" : "interactive"
                }
                keyboardBlurBehavior="restore"
                android_keyboardInputMode="adjust"
              >
                <View style={styles.contentContainer}>
                  <View>
                    <Text style={styles.title}>
                      {selectedAttach?.tipe == "sign"
                        ? "Digital Signed"
                        : "Attachment"}
                    </Text>
                    <View style={[styles.containerRow, styles.border]}>
                      <IconButton
                        icon={selectedIconAttach}
                        // icon="file"
                        size={18}
                        style={styles.icon}
                      />
                      {selectedAttach && (
                        <View style={styles.containerColumn}>
                          <Text>
                            {selectedAttach.name
                              ? selectedAttach.name
                              : selectedAttach?.tipe == "sign"
                              ? selectedAttach.description
                              : selectedAttach.filename}
                          </Text>
                          <Text>
                            {selectedAttach.size
                              ? selectedAttach.size
                              : selectedAttach.signed_by}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  {extensionPdf && (
                    <>
                      {selectedAttach?.tipe != "sign" && (
                        <Button
                          mode="contained"
                          style={[
                            {
                              marginBottom: 16,
                              backgroundColor: GlobalStyles.colors.green,
                            },
                          ]}
                          onPress={() => {
                            navigation.navigate("ViewAttachment", {
                              selected: selectedAttach,
                              title: "View Attachment",
                            });
                          }}
                        >
                          View
                        </Button>
                      )}
                      <Button
                        mode="contained"
                        style={[
                          {
                            marginBottom: 16,
                            backgroundColor: GlobalStyles.colors.blue,
                          },
                        ]}
                        onPress={() => initDownload(selectedAttach)}
                      >
                        Download
                      </Button>
                    </>
                  )}
                  {!extensionPdf && (
                    <>
                      <Button
                        mode="contained"
                        style={[
                          {
                            marginBottom: 16,
                            backgroundColor: GlobalStyles.colors.blue,
                          },
                        ]}
                        onPress={() => initDownload(selectedAttach)}
                      >
                        Download
                      </Button>
                    </>
                  )}
                  <Button
                    mode="contained"
                    style={[
                      {
                        backgroundColor: GlobalStyles.colors.gray500,
                        marginBottom: 16,
                      },
                    ]}
                    onPress={() => {
                      bottomSheetRefAttach.current?.dismiss();
                    }}
                  >
                    Cancel
                  </Button>
                </View>
              </BottomSheetModal>
            </View>
          </SafeAreaView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}
export default DetailAttachment;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalStyles.colors.tertiery20,
  },
  button: {
    width: "49%",
    marginBottom: 16,
  },
  container: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  titleLabel: {
    fontWeight: "bold",
    fontSize: GlobalStyles.font.md,
    marginBottom: 12,
  },
  containerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    margin: 16,
  },
  containerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  containerColumn: {
    width: "85%",
    marginBottom: 8,
  },
  border: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
  },
  iconContent: {
    alignItems: "center",
  },
  textContent: {
    fontSize: GlobalStyles.font.md,
    color: GlobalStyles.colors.blue,
    fontWeight: "bold",
    paddingRight: 8,
    flexWrap: "wrap",
  },
  subtextContent: {
    fontSize: GlobalStyles.font.sm,
    color: GlobalStyles.colors.tertiery50,
    fontWeight: "bold",
    paddingRight: 8,
  },
  title: {
    marginBottom: 6,
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  linkText: {
    borderBottomWidth: 1,
    borderColor: GlobalStyles.colors.blue,
    color: GlobalStyles.colors.blue,
  },
});
