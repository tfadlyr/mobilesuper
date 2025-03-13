import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-native";
import { Divider } from "react-native-paper";
import { Loading } from "../../components/Loading";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
const { StorageAccessFramework } = FileSystem;
import { getTokenValue } from "../../service/session";
import { getDownloadLampiran } from "../../service/api";
import { Portal } from "react-native-portalize";
import { ResizeMode, Video } from "expo-av";
import { getOrientation } from "../../config/SuperAppps";

const DataLampiran = ({
  lampiran,
  nama,
  size,
  onClick,
  type,
  bottomSheetAttach,
  device,
}) => {
  const navigation = useNavigation();

  // Check if the name contains "copy"
  if (nama.toLowerCase().includes("copy")) {
    return null; // Do not render anything if "copy" is found in the name
  }

  return (
    <>
      {type === "png" || type === "jpg" || type === "jpeg" ? (
        <TouchableOpacity
          onPress={() => {
            bottomSheetAttach();
            onClick();
          }}
        >
          <Image
            source={{ uri: lampiran }}
            style={{ width: 150, height: 150, borderRadius: 6, marginTop: 10 }}
          />
        </TouchableOpacity>
      ) : type === "mp4" ? (
        <TouchableOpacity
          onPress={() => {
            bottomSheetAttach();
            onClick();
          }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 6,
            marginTop: 10,
            backgroundColor: COLORS.secondaryLighter,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/superApp/mp4.png")}
            style={{ width: 70, height: 70 }}
          />
        </TouchableOpacity>
      ) : type === "doc" ||
        type === "docx" ||
        type === "xls" ||
        type === "xlsx" ||
        type === "pdf" ||
        type === "ppt" ||
        type === "pptx" ? (
        <TouchableOpacity
          onPress={() => {
            bottomSheetAttach();
            onClick();
          }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 6,
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS.white,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          {type === "doc" || type === "docx" ? (
            <Image
              source={require("../../assets/superApp/word.png")}
              style={{ width: 70, height: 70 }}
            />
          ) : type === "xls" || type === "xlsx" ? (
            <Image
              source={require("../../assets/superApp/excel.png")}
              style={{ width: 70, height: 70 }}
            />
          ) : type === "pdf" ? (
            <Image
              source={require("../../assets/superApp/pdf.png")}
              style={{ width: 70, height: 70 }}
            />
          ) : type === "ppt" || type === "pptx" ? (
            <Image
              source={require("../../assets/superApp/ppt.png")}
              style={{ width: 70, height: 70 }}
            />
          ) : null}
          <View
            style={{
              marginTop: 10,
              rowGap: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                fontWeight: FONTWEIGHT.bold,
                maxWidth: 130,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              numberOfLines={1}
            >
              {nama}
            </Text>
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {Math.floor(size / 1024)} MB
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export const Lampiran = () => {
  const navigation = useNavigation();

  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  // useEffect(() => {
  //   const param = {
  //     token: token,
  //     id: fileDetail.id
  //   };
  //   if (token !== "") {
  //     dispatch(getDownloadLampiran(param))
  //   }
  // }, [token, id])

  const { dokumen, loading } = useSelector((state) => state.repository);
  const detail = dokumen.detail;

  const [visibleModal, setVisibleModal] = useState(false);
  const [lampiranById, setLampiranById] = useState(null);

  const [document, setDocument] = useState([]);

  const getFileExtension = (type) => {
    let jenis = type.split(".");
    jenis = jenis[jenis.length - 1];
    return jenis;
  };
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const bottomSheetModalRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const [file, setFile] = useState("");
  const [jenis, setJenis] = useState("");
  const [fileDetail, setFileDetail] = useState(null);

  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS === "android" ? "" : "");

  const downloadFile = async (fileUrl, fileType, type) => {
    // const namafile =
    //   type === "employe"
    //     ? exportLaporan?.employee?.file.split("/")
    //     : exportLaporan?.quarter?.file.split("/");
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        downloadPath + fileDetail.name,
        { headers: { Authorization: token } }
      );
      try {
        // if (Platform.OS === "android") {
        //   const { uri } = await downloadResumable.downloadAsync();
        //   saveAndroidFile(uri, namafile[namafile?.length - 1], fileType);
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
        mimeType: "application/vnd.openxmlformats-",
        dialogTitle: "Share Excel",
      });
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const getDetailLampiran = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDownloadLampiran(params));
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const { download } = useSelector((state) => state.repository);

  const { device } = useSelector((state) => state.apps);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {loading ? <Loading /> : null}
        <View style={{ flex: 1 }}>
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
                backgroundColor: "white",
                borderRadius: 20,
                width: device === "tablet" ? 40 : 28,
                height: device === "tablet" ? 40 : 28,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("MainRepo")}>
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
                  fontSize: fontSizeResponsive("H1", device),
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.white,
                }}
              >
                Lampiran
              </Text>
            </View>
          </View>
          {/* <FlatList
            key={"#"}
            data={dummyAtt}
            renderItem={({ item }) => (
              <View key={item.id}>
                <DataLampiran
                  lampiran={item.files}
                  nama={item.name}
                  size={item.file_size}
                  type={getFileExtension(item.name)}
                  onClick={() => {
                    setFile(item.files);
                    setJenis(getFileExtension(item.name));
                    setFileDetail(item);
                  }}
                  bottomSheetAttach={bottomSheetAttach}
                  device={device}
                />
              </View>
            )}
            scrollEnabled={false}
            style={{
              marginTop: 10,
              marginHorizontal: "5%",
            }}
            // columnWrapperStyle={{
            //   justifyContent: "space-between",
            //   marginHorizontal: 15,
            //   gap: 15,
            // }}
            // numColumns={numColumns}
            keyExtractor={(item) => "#" + item.id}
          /> */}
          <View
            style={{
              paddingHorizontal: 20,
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                paddingHorizontal:
                  device === "tablet" && orientation === "potrait" ? 60 : 0,
                flex: 1,
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 16,
                justifyContent: device === "tablet" ? "flex-start" : "center",
              }}
            >
              {detail.attachments.map((item, index) => (
                <DataLampiran
                  lampiran={item.files}
                  nama={item.name}
                  size={item.file_size}
                  type={getFileExtension(item.files)}
                  onClick={() => {
                    setFile(item.files);
                    setJenis(getFileExtension(item.name));
                    setFileDetail(item);
                  }}
                  bottomSheetAttach={bottomSheetAttach}
                  device={device}
                />
              ))}
            </View>
          </View>
          {lampiranById !== null ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={visibleModal}
              onRequestClose={() => {
                setVisibleModal(false);
                setLampiranById(null);
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
                  alignItems: "center",
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setVisibleModal(false);
                    // setGaleriById(galeri.lists.id);
                  }}
                  style={{ position: "absolute", top: "15%", left: 20 }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.primary,
                      width: 51,
                      height: 51,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 50,
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      color={COLORS.white}
                      size={24}
                    />
                  </View>
                </TouchableOpacity>
                {getFileExtension(lampiranById.name) === "png" ||
                getFileExtension(lampiranById.name) === "jpg" ||
                getFileExtension(lampiranById.name) === "jpeg" ? (
                  <View>
                    <Image
                      source={{ uri: lampiranById.files }}
                      style={{ width: 390, height: 283 }}
                    />
                  </View>
                ) : getFileExtension(lampiranById.name) === "mp4" ? (
                  <Video
                    ref={video}
                    style={{ width: 390, height: 283 }}
                    source={lampiranById.gambar}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                  />
                ) : (
                  <></>
                )}
              </View>
            </Modal>
          ) : null}
          <Portal>
            <BottomSheetModalProvider>
              <BottomSheetModal
                ref={bottomSheetModalRef}
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
                  <View style={{ marginVertical: 20 }}>
                    <View
                      style={{
                        marginLeft: 30,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Ionicons
                        name="attach-outline"
                        size={32}
                        color={COLORS.primary}
                      />
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H2", device),
                          fontWeight: FONTWEIGHT.normal,
                          width: 230,
                        }}
                      >
                        {fileDetail?.name}
                        {/* Lampiran */}
                      </Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                      <Divider bold />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        downloadFile(fileDetail?.files);
                        bottomSheetAttachClose();
                      }}
                    >
                      <View
                        style={{
                          marginLeft: 30,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                          marginTop: 20,
                        }}
                      >
                        <Ionicons
                          name="share-social-outline"
                          size={32}
                          color={"#6B7280"}
                        />
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H2", device),
                            fontWeight: FONTWEIGHT.normal,
                          }}
                        >
                          Bagikan
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {jenis === "png" || jenis === "jpg" || jenis === "jpeg" ? (
                      <TouchableOpacity
                        onPress={() => {
                          setVisibleModal(true);
                          setLampiranById(fileDetail);
                          bottomSheetAttachClose();
                        }}
                      >
                        <View
                          style={{
                            marginLeft: 30,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            marginTop: 20,
                          }}
                        >
                          <Ionicons
                            name="eye-outline"
                            size={32}
                            color={"#6B7280"}
                          />
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H2", device),
                              fontWeight: FONTWEIGHT.normal,
                            }}
                          >
                            Preview
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : jenis === "doc" ||
                      jenis === "docx" ||
                      jenis === "xls" ||
                      jenis === "xlsx" ||
                      jenis === "pdf" ||
                      jenis === "ppt" ||
                      jenis === "pptx" ? (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("FileViewerRepo", {
                            lampiran: file,
                            type: jenis,
                          });
                          bottomSheetAttachClose();
                        }}
                      >
                        <View
                          style={{
                            marginLeft: 30,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            marginTop: 20,
                          }}
                        >
                          <Ionicons
                            name="eye-outline"
                            size={32}
                            color={"#6B7280"}
                          />
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H2", device),
                              fontWeight: FONTWEIGHT.normal,
                            }}
                          >
                            Preview
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}
                    {/* <TouchableOpacity
                // onPress={() => {
                //   navigation.navigate("FileViewer", {
                //     lampiran: detail.attachments[0].files,
                //     type: getFileExtension(detail.attachments[0].name),
                //   });
                //   bottomSheetAttachClose();
                // }}
                onPress={() => {
                }}
                onClick={() => {
                  setVisibleModal(true);
                  setLampiranById(item);
                }}
              >
                <View
                  style={{
                    marginLeft: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 20,
                  }}
                >
                  <Ionicons
                    name="eye-outline"
                    size={32}
                    color={"#6B7280"}
                  />
                  <Text
                    style={{
                      fontSize: FONTSIZE.H2,
                      fontWeight: FONTWEIGHT.normal,
                    }}
                  >
                    Test
                  </Text>
                </View>
              </TouchableOpacity> */}
                  </View>
                </BottomSheetView>
              </BottomSheetModal>
            </BottomSheetModalProvider>
          </Portal>
        </View>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "white",
    height: 28,
    width: 28,
    borderRadius: 50,
  },
  imageIos: {
    width: 390,
    height: 260,
    resizeMode: "cover",
  },
  imageAndroid: {
    width: 420,
    height: 260,
    resizeMode: "cover",
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.7,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.7,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
