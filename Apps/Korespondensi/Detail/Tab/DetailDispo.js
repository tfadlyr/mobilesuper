import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { Button, Card, IconButton } from "react-native-paper";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GlobalStyles } from "../../../../constants/styles";
import DetailAgenda from "../../Detail/Tab/DetailAgenda";
import LoadingOverlay from "../../../../components/UI/LoadingOverlay";

import * as FileSystem from "expo-file-system";
const { StorageAccessFramework } = FileSystem;
import { headerToken } from "../../../../utils/http";
import * as Sharing from "expo-sharing";
import { nde_api } from "../../../../utils/api.config";
import { useDispatch, useSelector } from "react-redux";
import { setDataNotif } from "../../../../store/pushnotif";
import WebView from "react-native-webview";

function DetailDispo({ data, noAgenda, preview, title }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );

  const [header, setHeader] = useState();
  const [extensionPdf, setExtensionPdf] = useState(false);
  const [selectedAttach, setSelectedAttach] = useState();
  const [selectedIconAttach, setSelectedIconAttach] = useState();
  const [checkScroll, setCheckScroll] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState();
  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");

  const bottomSheetRefAttach = useRef(null);
  const snapPoint = useMemo(() => [50, 250], []);
  const snapPointPdf = useMemo(() => [50, 300], []);

  useEffect(() => {
    if (header == undefined) {
      getHeader();
    }
    dispatch(setDataNotif({}));
  }, [header]);
  async function getHeader() {
    let response = await headerToken();
    setHeader(response);
  }
  function showBottommSheet(item, icon) {
    let temp = item?.truncate_name?.split(".");
    if (temp?.length != 0) {
      if (temp[temp?.length - 1] == "pdf") {
        setExtensionPdf(true);
      } else {
        setExtensionPdf(false);
      }
    }
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
  const downloadFile = async (item) => {
    // setIsLoading(true);
    let fileUrl = item.file;
    let fileType = item.description;
    let fileName = item.filename;
    if (Platform.OS == "android") {
      const dir = ensureDirAsync(downloadPath);
    }
    fileName = item.filename.split("/")[3];
    //alert(fileName)
    const downloadResumable = FileSystem.createDownloadResumable(
      nde_api.baseurl + fileUrl,
      downloadPath + fileName,
      { headers: header },
      downloadCallback
    );
    try {
      const { uri } = await downloadResumable.downloadAsync();
      if (Platform.OS == "android") saveAndroidFile(uri, fileName, fileType);
      else saveIosFile(uri);
    } catch (e) {
      setIsLoading(false);
    }
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
            bottomSheetRefAttach.current?.dismiss();
            Alert.alert("Success!", "Download Successfully");
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
      const UTI = "public.item";
      const shareResult = await Sharing.shareAsync(fileUri, { UTI });
    } catch (error) {}
  };

  let urlNote = nde_api.baseurl + "crsbe" + data?.attachments[0]?.file;
  let newUrlNote = urlNote.replace("/api/", "/");

  const { device } = useSelector((state) => state.apps);
  const transformData = (data) => {
    return data?.map((section) => {
      const result = [];
      let currentHead = null;
      section.child.forEach((item) => {
        if (item.isHead) {
          // Jika item adalah head, tambahkan ke result sebagai parent baru
          currentHead = { ...item, children: [] };
          result.push(currentHead);
        } else if (currentHead) {
          // Jika item bukan head, tambahkan ke children dari head yang sedang aktif
          currentHead.children.push(item);
        }
      });
      return {
        ...section,
        child: result?.length == 0 ? section.child : result,
      };
    });
  };
  const [receiverDispo, setreceiverDispo] = useState([]);
  const [actionDispo, setactionDispo] = useState([]);

  const findMatchReceivers = (x, receivers_ids) => {
    let matches = [];

    data?.receivers_config?.yth_dispo?.forEach((child) => {
      console.log(child.code);
      if (receivers_ids.includes(child.code)) {
        matches.push({
          code: child.code,
          name: child.display_label,
        });
      }
    });
    const searchInChildren = (children) => {
      children.forEach((child) => {
        if (receivers_ids.includes(child.code)) {
          matches.push({
            code: child.code,
            name: child.display_label + " (" + child?.name + ")",
          });
        }
        if (child.children) {
          searchInChildren(child.children);
        }
      });
    };
    x?.forEach((section) => {
      searchInChildren(section.child);
    });

    return matches;
  };

  useEffect(() => {
    //set matching receivers
    let temp = [];
    data?.receivers_config?.kepada_dispo?.map((item) => {
      temp = temp.concat(transformData(item));
    });
    const matchingCodes = findMatchReceivers(temp, data?.receivers_ids);
    setreceiverDispo(matchingCodes);
    //set matching action
    const actionArray = data?.action.split("\n").map((item) => item.trim());
    const matches = data?.sender?.actions?.filter((actionItem) =>
      actionArray?.some((sender) => sender === actionItem.name)
    );
    setactionDispo(matches);
  }, [data]);

  return (
    <>
      <ScrollView scrollEnabled={checkScroll}>
        {loadingOverlay}
        <View style={styles.screen}>
          {/* <View style={{ marginBottom: 8 }}>
            <Text>Diteruskan Dari</Text>
          </View>
          <Card style={styles.containerCard}>
            <Text style={styles.title}>{data?.sender?.person}</Text>
          </Card>
          <View style={{ marginBottom: 8 }}>
            <Text>Diteruskan Kepada</Text>
          </View>
          <Card style={styles.containerCard}>
            <View style={styles.containerColumn}>
              {receiverDispo?.length == 0 &&
                data?.receivers.length > 0 &&
                data?.receivers.map((item, index) => (
                  <Text key={index} style={styles.title}>
                    {item}
                  </Text>
                ))}
              {receiverDispo?.length != 0 &&
                receiverDispo.map((item, index) => (
                  <Text key={index} style={styles.title}>
                    {item.name}
                  </Text>
                ))}
            </View>
            <View>
              <Text style={styles.title}>Aksi Disposisi</Text>
            </View>
            <View>
              <Text>
                {actionDispo?.length == 0 && data?.action
                  ? data?.action
                  : actionDispo?.map((item) => item.name).join("\n")}
              </Text>
            </View>
            <View>
              <Text style={styles.title}>Catatan Disposisi</Text>
            </View>
            <View>
              <Text>{data?.action_manual ? data?.action_manual : "-"}</Text>
            </View>
            <View>
              <View>
                <Text style={styles.title}>Attachments Disposisi</Text>
              </View>
              {data?.attachments?.length == 0 && <Text>-</Text>}
              {data?.attachments?.length != 0 &&
                data?.attachments?.map((item, index) => (
                  <View
                    key={item.id}
                    onPress={() => {
                      // showBottommSheet(item, getExtensionIcon(item));
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 12,
                        overflow: "hidden", // Ensure the WebView respects the border radius
                        height: device === "tablet" ? 300 : 200,
                        width: "100%",
                      }}
                    >
                      <WebView
                        originWhitelist={["*"]}
                        source={{
                          uri: newUrlNote,
                          headers: header,
                        }}
                        style={{
                          flex: 1,
                        }}
                        allowFileAccess={true}
                        androidLayerType={"software"}
                        mixedContentMode={"always"}
                        allowUniversalAccessFromFileURLs={true}
                        setDisplayZoomControls={true}
                        scalesPageToFit={false}
                        scrollEnabled={true}
                        onTouchStart={() => {
                          setCheckScroll(false);
                        }}
                        onTouchEnd={() => {
                          setCheckScroll(true);
                        }}
                      />
                    </View>
                  </View>
                ))}
            </View>
          </Card> */}
          <View style={{ marginBottom: 8 }}>
            <Text>Informasi Surat</Text>
          </View>
          <Card style={[styles.containerCard, { padding: 0 }]}>
            <DetailAgenda
              style={{
                backgroundColor: GlobalStyles.colors.tertiery20,
                borderRadius: 12,
              }}
              showBody={false}
              noAgenda={noAgenda ? noAgenda : ""}
              data={data?.obj}
              title="Detail Disposisi"
            />
          </Card>
          <Button
            mode="contained"
            style={{ backgroundColor: GlobalStyles.colors.tertiery }}
            onPress={() => {
              navigation.navigate("ViewAttachment", {
                selected: data?.obj?.attachments[0],
                title: "Lihat Surat",
                id: data?.obj?.id,
                token: data?.w_token,
              });
            }}
          >
            Lihat Surat
          </Button>
        </View>
      </ScrollView>

      <BottomSheetModalProvider>
        <SafeAreaView>
          <View>
            <BottomSheetModal
              name="download"
              ref={bottomSheetRefAttach}
              index={1}
              snapPoints={extensionPdf ? snapPointPdf : snapPoint}
              keyboardBehavior={
                Platform?.OS == "android" ? "fillParent" : "interactive"
              }
              keyboardBlurBehavior="restore"
              android_keyboardInputMode="adjust"
            >
              <View style={styles.contentContainer}>
                <View>
                  <Text style={styles.title}>Attachment</Text>
                  <View style={[styles.containerRow, styles.border]}>
                    <IconButton
                      icon={selectedIconAttach}
                      // icon="file"
                      size={18}
                      style={styles.icon}
                    />
                    <View style={styles.containerColumn}>
                      <Text>{selectedAttach?.name}</Text>
                      <Text>{selectedAttach?.size}</Text>
                    </View>
                  </View>
                </View>
                {extensionPdf && (
                  <>
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
                    <Button
                      mode="contained"
                      style={[
                        {
                          marginBottom: 16,
                          backgroundColor: GlobalStyles.colors.blue,
                        },
                      ]}
                      onPress={() => downloadFile(selectedAttach)}
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
                      onPress={() => downloadFile(selectedAttach)}
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
    </>
  );
}

export default DetailDispo;

const styles = StyleSheet.create({
  screen: {
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    margin: 16,
  },
  containerCard: {
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  containerCardTitle: {
    padding: 0,
  },
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
    justifyContent: "flex-start",
    backgroundColor: GlobalStyles.colors.greylight,
  },
  containerColumn: {
    flexDirection: "column",
    marginBottom: 8,
  },
  containerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  title: {
    marginBottom: 6,
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
});
