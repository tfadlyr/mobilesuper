import { Fragment, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
  Linking,
  Alert,
  Image,
} from "react-native";
import ActionInprogress from "./ActionInprogress";
import RenderHTML, {
  HTMLContentModel,
  HTMLElementModel,
} from "react-native-render-html";
import { getHTTP } from "../../../../utils/http";
import { nde_api } from "../../../../utils/api.config";
import moment from "moment";
import { Config } from "../../../../constants/config";
import { Button, IconButton, List } from "react-native-paper";
import { GlobalStyles } from "../../../../constants/styles";
import { WebView } from "react-native-webview";
import ActionDigisign from "./ActionDigisign";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { getWatermarkHTML } from "../../../../utils/print";
import { useDispatch, useSelector } from "react-redux";
const { StorageAccessFramework } = FileSystem;
import { shareAsync } from "expo-sharing";
import { setDataNotif } from "../../../../store/pushnotif";
import * as Clipboard from "expo-clipboard";
import { setClipboard, setFAB } from "../../../../store/snackbar";

import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

import { LinearGradient } from "expo-linear-gradient";
import { COLORS, DATETIME } from "../../../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

//untuk detail agenda yang isi suratnya langsung terbaca tanpa view document
function DetailAgendaInpro({
  id,
  noAgenda,
  data,
  style,
  tipe,
  showBody,
  preview,
  sign,
}) {
  const profile = useSelector((state) => state.profile.profile);
  const { width } = useWindowDimensions();
  const [body, setBody] = useState();
  const [openKepada, setOpenKepada] = useState(false);
  const [openTembusan, setOpenTembusan] = useState(false);
  const [view, setView] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const { device } = useSelector((state) => state.apps);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  });

  const zoomInOutAndroid = `
                    const meta = document.createElement('meta');
                    meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0');
                    meta.setAttribute('name', 'viewport');
                    document.getElementsByTagName('head')[0].appendChild(meta);
                    `;
  const zoomInOutIos = `const meta = document.createElement('meta'); " +
                    "meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1'); " +
                    "meta.setAttribute('name', 'viewport'); " +
                    "document.getElementsByTagName('head')[0].appendChild(meta); " +
                    "true; `;
  const customHTMLElementModels = {
    label: HTMLElementModel.fromCustomModel({
      tagName: "label",
      mixedUAStyles: {
        width: 70,
      },
      contentModel: HTMLContentModel.block,
    }),
  };
  const tagsStyles = {
    // ol: { listStyleType: "decimal" },
  };
  const dispatch = useDispatch();

  useEffect(() => {
    setView(preview);
    getHTMLnotaBG();
    dispatch(setDataNotif({}));
  }, [preview]);

  function getBG() {
    // if (
    //   data?.template.name != "nota_internal" &&
    //   data?.template.name != "nota_external" &&
    //   data?.template.name != "undangan" &&
    //   data?.template.name != "poh"
    // ) {
    getHTMLnotaBG();
    // }
  }

  async function getHTMLnotaBG() {
    //agenda in out dispoc
    if (view != "") {
      try {
        let response = await getHTTP(nde_api.baseurl + preview);
        // data.references = response?.data?.references;
        getHTML(response.data);
      } catch (error) {
        // handlerError(error, "Warning!", "Preview Letter not working!");
      }
      // } else if (view == "") {
      //   //inprogress
      //   try {
      //     if (id) {
      //       let response = await getHTTP(nde_api.preview.replace("{id}", id));
      //       data.references = response?.data?.references;

      //       getHTML(response.data);
      //     }
      //   } catch (error) {
      //     // handlerError(error, "Warning!", "Preview Letter not working!");
      //   }
    }
  }
  async function getHTML(item) {
    try {
      let response = await getHTTP(nde_api.baseurl + item.letters.raw);
      if (response.data.status == "Error") {
        setBody(response.data.msg);
      } else {
        setBody(
          `<style>ol{list-style-type: decimal;} ol ol{list-style-type: lower-alpha;} ol ol ol{list-style-type: lower-roman;}</style> ${response?.data}`
        );
      }
    } catch (error) {
      // handlerError(error, "Warning!", "Preview Letter not working!");
    }
  }
  async function printHTMLtoPDF() {
    let html = getWatermarkHTML(profile, data, body);
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      width: 595,
      height: 842,
      // printerUrl: selectedPrinter?.url, // iOS only
    });
  }

  // const printToFile = async () => {
  //   let html = getWatermarkHTML(profile, data, body);
  //   // On iOS/android prints the given html. On web prints the HTML from the current page.
  //   await Print.printToFileAsync({
  //     html,
  //     width: 595,
  //     height: 842,
  //   }).then(
  //     async ({ uri }) => {
  //       // this changes the bit after the last slash of the uri (the document's name) to "invoice_<date of transaction"

  //       const pdfName = `${uri?.slice(0, uri?.lastIndexOf("/") + 1)}${
  //         Platform.OS == "android"
  //           ? data.subject
  //           : data.subject.slice(0, 55).replaceAll(" ", "_")
  //       }.pdf`;
  //       try {
  //         await FileSystem.moveAsync({
  //           from: uri,
  //           to: pdfName,
  //         }).then(async () => {
  //           if (Platform.OS == "android") {
  //             saveAndroidFile(
  //               pdfName,
  //               data.subject + ".pdf",
  //               "application/pdf"
  //             );
  //           } else {
  //             await shareAsync(pdfName, {
  //               UTI: ".pdf",
  //               mimeType: "application/pdf",
  //             });
  //           }
  //         });
  //       } catch (error) {}
  //     },
  //     (error) => {}
  //   );
  // };

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
  const copyToClipboard = async (text) => {
    Clipboard.setStringAsync(text);
    dispatch(setClipboard(true));
    setTimeout(() => {
      dispatch(setClipboard(false));
    }, 1500);
  };
  return (
    <GestureHandlerRootView>
      <ScrollView overScrollMode="never" keyboardShouldPersistTaps="handled">
        <View style={{ padding: 20, gap: 10 }}>
          {tipe == "TrackingDetail" ? (
            <Text style={{ fontSize: 15, fontWeight: 600 }}>
              Informasi Surat
            </Text>
          ) : (
            <Text style={{ fontSize: 15, fontWeight: 600 }}>
              Form {data?.type_letter}
            </Text>
          )}
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 16,
            }}
          >
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
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                No Surat
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data?.ref_number}
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
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Tanggal Surat
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data?.letter_date}
              </Text>
            </View>

            <View
              style={
                tipe == "TrackingDetail"
                  ? {
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      paddingVertical: 10,
                    }
                  : { flexDirection: "row", paddingVertical: 10 }
              }
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Penanda Tangan
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data && data?.senders[0].title
                  ? data?.senders[0].title
                  : data?.senders[0].name}
              </Text>
            </View>
            {tipe == "TrackingDetail" && (
              <>
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
                      fontSize: 13,
                      fontWeight: 600,
                      width: "40%",
                      paddingRight: 20,
                    }}
                  >
                    Jenis Surat
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      width: "60%",
                      paddingRight: 20,
                    }}
                  >
                    {data?.type_letter ? data?.type_letter : "-"}
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
                      fontSize: 13,
                      fontWeight: 600,
                      width: "40%",
                      paddingRight: 20,
                    }}
                  >
                    Kode Derajat
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      width: "60%",
                      paddingRight: 20,
                    }}
                  >
                    {data?.type ? data?.type : "-"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", paddingVertical: 10 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      width: "40%",
                      paddingRight: 20,
                    }}
                  >
                    Sifat
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      width: "60%",
                      paddingRight: 20,
                    }}
                  >
                    {data?.priority ? data?.priority : data?.prio}
                  </Text>
                </View>
              </>
            )}
          </View>
          <Text style={{ fontSize: 15, fontWeight: 600 }}>Perihal</Text>
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 16,
            }}
          >
            <Text>{data?.subject}</Text>
          </View>
          {tipe == "TrackingDetail" && (
            <>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>
                Posisi Surat
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <Text style={{ fontSize: 13 }}>{data?.position}</Text>
              </View>
            </>
          )}
          {data?.template?.name != "nota_external" && (
            <>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 15, fontWeight: 600 }}>Kepada</Text>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                {data && (
                  <>
                    {data && data?.receivers?.length == 0 && <Text>-</Text>}
                    {data && data?.receivers?.length == 1 && (
                      <Text>{data?.receivers[0]}</Text>
                    )}
                    {data && data?.receivers?.length > 1 && (
                      <View
                        style={[
                          openKepada
                            ? {
                                borderBottomLeftRadius: 12,
                                borderBottomRightRadius: 12,
                              }
                            : {},
                        ]}
                      >
                        {data?.receivers.map((item, index) => (
                          <Text key={index}>
                            {index + 1}. {item}
                          </Text>
                        ))}
                      </View>
                    )}
                  </>
                )}
                {data?.receivers_display?.length != 0 && (
                  <>
                    <View style={{ flexDirection: "row", paddingTop: 10 }}>
                      <Text style={{ fontSize: 15, fontWeight: 600 }}>
                        Tampilan Kepada
                      </Text>
                    </View>
                    {data && data?.receivers_display?.length == 1 && (
                      <Text>{data?.receivers_display[0]}</Text>
                    )}

                    {data && data?.receivers_display?.length > 1 && (
                      <View>
                        <RenderHTML
                          contentWidth={width}
                          source={{ html: data?.receivers_display }}
                          defaultTextProps={{ allowFontScaling: false }}
                        />
                      </View>
                    )}
                  </>
                )}
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 15, fontWeight: 600 }}>Tembusan</Text>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                {data && data.copytos_display?.length == 0 && (
                  <>
                    {data && data.copytos?.length == 0 && <Text>-</Text>}
                    {data && data.copytos?.length == 1 && (
                      <Text>{data.copytos[0]}</Text>
                    )}
                    {data && data.copytos?.length > 1 && (
                      <View
                        style={[
                          openTembusan
                            ? {
                                borderBottomLeftRadius: 12,
                                borderBottomRightRadius: 12,
                              }
                            : {},
                        ]}
                      >
                        {data.copytos.map((item, index) => (
                          <Text key={index}>
                            {index + 1}. {item}
                          </Text>
                        ))}
                      </View>
                    )}
                  </>
                )}
                {data && data.copytos_display?.length != 0 && (
                  <>
                    {data && data.copytos_display?.length == 0 && (
                      <Text>-</Text>
                    )}
                    {data && data.copytos_display?.length == 1 && (
                      <RenderHTML
                        contentWidth={width}
                        source={{ html: data?.copytos_display[0] }}
                        defaultTextProps={{ allowFontScaling: false }}
                      />
                    )}
                    {data && data.copytos_display?.length > 1 && (
                      <RenderHTML
                        contentWidth={width}
                        source={{ html: data?.copytos_display.join("\n") }}
                        defaultTextProps={{ allowFontScaling: false }}
                      />
                    )}
                  </>
                )}
              </View>
              {data?.jenis_surat == "Memorandum" && (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 15, fontWeight: 600 }}>
                      Internal Satker
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      padding: 20,
                      borderRadius: 16,
                    }}
                  >
                    {data && data.internal_satker?.length == 0 && (
                      <Text style={{ fontSize: 13 }}>-</Text>
                    )}
                    {data && data.internal_satker?.length !== 0 && (
                      <Text style={{ fontSize: 13 }}>
                        {data.internal_satker}
                      </Text>
                    )}
                  </View>
                </>
              )}
            </>
          )}
          {data?.template?.name == "nota_external" && (
            <>
              {data?.tipe_penerima == "int" && (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Kepada
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      padding: 20,
                      borderRadius: 16,
                    }}
                  >
                    {data &&
                      data?.receivers_display?.length == 0 &&
                      data?.kepada_bank?.length == 0 && (
                        <>
                          {(data && data?.receivers?.length == 0) ||
                            (data?.kepada_addressbook?.length == 0 && (
                              <Text style={{ fontSize: 13 }}>-</Text>
                            ))}
                          {data && data?.kepada_addressbook?.length == 1 && (
                            <Text style={{ fontSize: 13 }}>
                              {data?.kepada_addressbook[0]}
                            </Text>
                          )}
                          {data && data?.kepada_addressbook?.length > 1 && (
                            <>
                              {data?.kepada_addressbook?.map((item, index) => (
                                <Text key={index} style={{ fontSize: 13 }}>
                                  {index + 1}. {item}
                                </Text>
                              ))}
                            </>
                          )}
                          {data && data?.receivers?.length == 1 && (
                            <>
                              {data?.template.name != "nota_external" &&
                              !loading ? (
                                <Text style={{ fontSize: 13 }}>
                                  {data?.receivers[0]}
                                </Text>
                              ) : null}
                            </>
                          )}
                          {data && data?.receivers?.length > 1 && (
                            <>
                              {data?.template.name != "nota_external" && (
                                <View>
                                  {data?.receivers.map((item, index) => (
                                    <Text key={index} style={{ fontSize: 13 }}>
                                      {index + 1}. {item}
                                    </Text>
                                  ))}
                                </View>
                              )}
                            </>
                          )}
                        </>
                      )}
                    {data &&
                      data.receivers_display?.length != 0 &&
                      data.kepada_bank?.length == 0 && (
                        <>
                          {data && data.receivers_display?.length == 1 && (
                            <RenderHTML
                              style={{ fontSize: 13 }}
                              contentWidth={width}
                              source={{ html: data?.receivers_display[0] }}
                              defaultTextProps={{ allowFontScaling: false }}
                            />
                          )}
                          {data &&
                            data.receivers_display?.length > 1 &&
                            data.template.name != "nota_external" &&
                            data.receivers_display.map((item, index) => (
                              <Text key={index} style={{ fontSize: 13 }}>
                                {index + 1}. {item}
                              </Text>
                            ))}
                          {data &&
                            data.receivers_display?.length > 1 &&
                            data.template.name == "nota_external" &&
                            data.receivers_display.map((item, index) => (
                              <Text key={index} style={{ fontSize: 13 }}>
                                {item}
                              </Text>
                            ))}
                        </>
                      )}
                  </View>
                </>
              )}

              {data?.tipe_penerima == "eks" && (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Kepada
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      padding: 20,
                      borderRadius: 16,
                    }}
                  >
                    {data &&
                      data?.receivers_display?.length == 0 &&
                      data?.kepada_bank?.length == 0 && (
                        <>
                          {data && data?.receivers?.length == 0 && (
                            <Text style={{ fontSize: 13 }}>-</Text>
                          )}
                          {data && data?.receivers?.length == 1 && (
                            <>
                              {data?.template.name == "nota_external" && (
                                <RenderHTML
                                  style={{ fontSize: 13 }}
                                  contentWidth={width}
                                  source={{
                                    html: data?.receivers[0],
                                  }}
                                  defaultTextProps={{ allowFontScaling: false }}
                                />
                              )}
                            </>
                          )}
                          {data && data?.receivers?.length > 1 && (
                            <>
                              {data?.template.name == "nota_external" && (
                                <>
                                  {data?.receivers?.map((item, index) => (
                                    <Text key={index} style={{ fontSize: 13 }}>
                                      {index + 1}. {item}
                                    </Text>
                                  ))}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    {data &&
                      data.receivers_display?.length != 0 &&
                      data.kepada_bank?.length == 0 && (
                        <>
                          {data.receivers_display?.length == 0 && (
                            <Text style={{ fontSize: 13 }}>-</Text>
                          )}
                          {data && data.receivers_display?.length == 1 && (
                            <RenderHTML
                              style={{ fontSize: 13 }}
                              contentWidth={width}
                              source={{ html: data?.receivers_display[0] }}
                              defaultTextProps={{ allowFontScaling: false }}
                            />
                          )}
                          {data &&
                            data.receivers_display?.length > 1 &&
                            data.template.name != "nota_external" &&
                            data.receivers_display.map((item, index) => (
                              <Text key={index} style={{ fontSize: 13 }}>
                                {index + 1}. {item}
                              </Text>
                            ))}
                          {data &&
                            data.receivers_display?.length > 1 &&
                            data.template.name == "nota_external" &&
                            data.receivers_display.map((item, index) => (
                              <Text key={index} style={{ fontSize: 13 }}>
                                {item}
                              </Text>
                            ))}
                        </>
                      )}
                  </View>
                </>
              )}
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 15, fontWeight: 600 }}>
                  Tembusan Internal
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                {data && data.copytos_display?.length == 0 && (
                  <>
                    {data && data.copytos?.length == 0 && (
                      <Text style={{ fontSize: 13 }}>-</Text>
                    )}
                    {data && data.copytos?.length == 1 && (
                      <Text style={{ fontSize: 13 }}>{data.copytos[0]}</Text>
                    )}
                    {data && data.copytos?.length > 1 && (
                      <View>
                        {data.copytos.map((item, index) => (
                          <Text key={index} style={{ fontSize: 13 }}>
                            {index + 1}. {item}
                          </Text>
                        ))}
                      </View>
                    )}
                  </>
                )}
                {data && data.copytos_display?.length != 0 && (
                  <>
                    {data && data.copytos_display?.length == 0 && (
                      <Text style={{ fontSize: 13 }}>-</Text>
                    )}
                    {data && data.copytos_display?.length == 1 && (
                      <RenderHTML
                        style={{ fontSize: 13 }}
                        contentWidth={width}
                        source={{ html: data?.copytos_display[0] }}
                        defaultTextProps={{ allowFontScaling: false }}
                      />
                    )}
                    {data && data.copytos_display?.length > 1 && (
                      <RenderHTML
                        style={{ fontSize: 13 }}
                        contentWidth={width}
                        source={{ html: data?.copytos_display.join("\n") }}
                        defaultTextProps={{ allowFontScaling: false }}
                      />
                    )}
                  </>
                )}
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 15, fontWeight: 600 }}>
                  Tembusan Eksternal
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                {data && data.tembusan_external?.length == 0 && (
                  <Text style={{ fontSize: 13 }}>-</Text>
                )}
                {data && data.tembusan_external?.length !== 0 && (
                  <Text style={{ fontSize: 13 }}>{data.tembusan_external}</Text>
                )}
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 15, fontWeight: 600 }}>
                  Internal Satker
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                {data && data.internal_satker?.length == 0 && (
                  <Text style={{ fontSize: 13 }}>-</Text>
                )}
                {data && data.internal_satker?.length !== 0 && (
                  <Text style={{ fontSize: 13 }}>{data.internal_satker}</Text>
                )}
              </View>
              {data.jenis_surat == "Surat Undangan" && (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 15, fontWeight: 600 }}>
                      Informasi Tambahan
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      padding: 20,
                      borderRadius: 16,
                    }}
                  >
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
                          fontSize: 13,
                          fontWeight: 600,
                          width: "40%",
                          paddingRight: 20,
                        }}
                      >
                        Agenda Kegiatan
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          width: "60%",
                          paddingRight: 20,
                        }}
                      >
                        {data?.agenda?.length == 0 ? "-" : data?.agenda}
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
                          fontSize: 13,
                          fontWeight: 600,
                          width: "40%",
                          paddingRight: 20,
                        }}
                      >
                        Tanggal Kegiatan
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          width: "60%",
                          paddingRight: 20,
                        }}
                      >
                        {moment(data?.start_date)
                          .locale("id")
                          .format(DATETIME.LONG_DATE)}{" "}
                        -{" "}
                        {moment(data?.end_date)
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
                          fontSize: 13,
                          fontWeight: 600,
                          width: "40%",
                          paddingRight: 20,
                        }}
                      >
                        Waktu Kegiatan
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          width: "60%",
                          paddingRight: 20,
                        }}
                      >
                        {data?.start_time}{" "}
                        {data?.end_time == "Selesai" ? data?.timezone : null} -{" "}
                        {data?.end_time}{" "}
                        {data?.end_time != "Selesai" ? data?.timezone : null}
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
                          fontSize: 13,
                          fontWeight: 600,
                          width: "40%",
                          paddingRight: 20,
                        }}
                      >
                        Lokasi
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          width: "60%",
                          paddingRight: 20,
                        }}
                      >
                        {data?.location == "" ? "-" : data?.location}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#DBDADE",
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          width: "40%",
                          paddingRight: 20,
                        }}
                      >
                        Catatan
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          width: "60%",
                          paddingRight: 20,
                        }}
                      >
                        {data?.notes == "" ? "-" : data?.notes}
                      </Text>
                    </View>
                  </View>
                </>
              )}
              {data?.kegiatan[0]?.start_date &&
                (data.jenis_surat == "Surat Perintah" ||
                  data.jenis_surat == "Surat Tugas") && (
                  <>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ fontSize: 15, fontWeight: 600 }}>
                        Informasi Tambahan
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: COLORS.white,
                        padding: 20,
                        borderRadius: 16,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            width: "40%",
                            paddingRight: 20,
                          }}
                        >
                          Kota Awal
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: 400,
                            width: "60%",
                            paddingRight: 20,
                          }}
                        >
                          {data?.from_city == "" ? "-" : data?.from_city}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            width: "40%",
                            paddingRight: 20,
                          }}
                        >
                          Catatan
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: 400,
                            width: "60%",
                            paddingRight: 20,
                          }}
                        >
                          {data?.notes == "" ? "-" : data?.notes}
                        </Text>
                      </View>
                      {data?.kegiatan?.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            paddingTop: 10,
                          }}
                        >
                          <View
                            style={{ flexDirection: "row", paddingVertical: 5 }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: "#8f8b99",
                                fontWeight: 600,
                              }}
                            >
                              Tujuan {index + 1}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              paddingVertical: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                width: "40%",
                                paddingRight: 20,
                              }}
                            >
                              Tanggal Kegiatan
                            </Text>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 400,
                                width: "60%",
                                paddingRight: 20,
                              }}
                            >
                              {moment(item?.start_date)
                                .locale("id")
                                .format(DATETIME.LONG_DATE)}{" "}
                              -{" "}
                              {moment(item?.end_date)
                                .locale("id")
                                .format(DATETIME.LONG_DATE)}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              paddingVertical: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                width: "40%",
                                paddingRight: 20,
                              }}
                            >
                              Kota
                            </Text>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 400,
                                width: "60%",
                                paddingRight: 20,
                              }}
                            >
                              {item?.city == "" ? "-" : item?.city}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              paddingVertical: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                width: "40%",
                                paddingRight: 20,
                              }}
                            >
                              Lokasi
                            </Text>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 400,
                                width: "60%",
                                paddingRight: 20,
                              }}
                            >
                              {item?.location == "" ? "-" : item?.location}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              paddingVertical: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                width: "40%",
                                paddingRight: 20,
                              }}
                            >
                              Transportasi
                            </Text>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 400,
                                width: "60%",
                                paddingRight: 20,
                              }}
                            >
                              {item?.transportation == ""
                                ? "-"
                                : item?.transportation}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}
            </>
          )}
          {data?.is_editable != "1" && data?.attachments?.length == 1 && (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 16,
                  padding: 20,
                  width: 90,
                  elevation: 1,
                }}
              >
                <Image
                  source={require("../../../../assets/superApp/pdf.png")}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text style={[styles.textContent, { textAlign: "center" }]}>
                  {data?.attachments[0]?.name}
                </Text>
                <Text style={styles.subtextContent}>
                  {data?.attachments[0]?.size}
                </Text>
              </View>
              <View style={{ width: "100%" }}>
                <Button
                  mode="contained"
                  style={[
                    {
                      width: "100%",
                      backgroundColor: GlobalStyles.colors.primary,
                      marginBottom: 16,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate("ViewAttachment", {
                      selected: data?.attachments[0],
                      title: "Lihat Surat",
                      tipe: tipe,
                      token: data?.w_token,
                      id: data?.id,
                      stylus:
                        tipe == "NeedFollowUpDetail" &&
                        profile?.is_pass == "true" &&
                        data?.is_signer
                          ? true
                          : false,
                    });
                    dispatch(setFAB(false));
                  }}
                  icon={() => (
                    <Ionicons
                      name="eye-outline"
                      size={20}
                      color={COLORS.white}
                    />
                  )}
                >
                  Lihat Surat
                </Button>
              </View>
            </View>
          )}
          {data?.is_editable != "1" &&
            data?.attachments?.length > 1 &&
            data?.attachments?.map((item, index) => (
              <Fragment key={index}>
                {item?.description == "editor-generated" && (
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.white,
                        borderRadius: 16,
                        padding: 20,
                        width: 90,
                        elevation: 1,
                      }}
                    >
                      <Image
                        source={require("../../../../assets/superApp/pdf.png")}
                        style={{ width: 50, height: 50 }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: 20,
                      }}
                    >
                      <Text
                        style={[styles.textContent, { textAlign: "center" }]}
                      >
                        {item?.name}
                      </Text>
                      <Text style={styles.subtextContent}>{item?.size}</Text>
                    </View>
                    <View style={{ width: "100%" }}>
                      <Button
                        mode="contained"
                        style={[
                          {
                            width: "100%",
                            backgroundColor: GlobalStyles.colors.primary,
                            marginBottom: 16,
                          },
                        ]}
                        onPress={() => {
                          navigation.navigate("ViewAttachment", {
                            selected: item,
                            title: "Lihat Surat",
                            tipe: tipe,
                          });
                          dispatch(setFAB(false));
                        }}
                        icon={() => (
                          <Ionicons
                            name="eye-outline"
                            size={20}
                            color={COLORS.white}
                          />
                        )}
                      >
                        Lihat Surat
                      </Button>
                    </View>
                  </View>
                )}
              </Fragment>
            ))}
          {/* edit surat */}
          {tipe !== "TrackingDetail" &&
            data?.is_editable == "1" &&
            !sign && (
              <View style={{ width: "100%" }}>
                <Button
                  mode="contained"
                  style={[
                    {
                      width: "100%",
                      backgroundColor: GlobalStyles.colors.primary,
                      marginBottom: 16,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate("ViewAttachment", {
                      id: data?.id,
                      title: "Edit Surat",
                      tipe: tipe,
                      token: data?.w_token,
                    });
                    dispatch(setFAB(false));
                  }}
                  icon={() => (
                    <Ionicons
                      name="pencil-outline"
                      size={20}
                      color={COLORS.white}
                    />
                  )}
                >
                  Edit Surat
                </Button>
              </View>
            )}
          {tipe !== "TrackingDetail" &&
            data?.state !== "rns" &&
            data?.state !== "finish" && (
              <ActionInprogress id={data?.id} data={data} />
            )}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

export default DetailAgendaInpro;

const styles = StyleSheet.create({
  screen: {
    margin: 16,
    backgroundColor: GlobalStyles.colors.white,
  },
  containerLabel: {
    flexDirection: "row",
    marginBottom: 6,
    justifyContent: "space-between",
  },
  titleLabel: {
    fontWeight: "bold",
    fontSize: GlobalStyles.font.md,
    marginBottom: 4,
  },
  subtitleLabel: {
    fontSize: GlobalStyles.font.md,
  },
  subtitleCopy: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
  },
  titleDropdown: {
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  listAccordion: {
    backgroundColor: GlobalStyles.colors.tertiery20,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  subtitleDropdown: {
    fontSize: GlobalStyles.font.md,
    paddingVertical: 4,
  },
  errorText: {
    color: GlobalStyles.colors.error500,
  },
  textContent: {
    fontSize: GlobalStyles.font.md,
    color: GlobalStyles.colors.blue,
    fontWeight: "bold",
    paddingRight: 8,
    flexWrap: "wrap",
  },
});
