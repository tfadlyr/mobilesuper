import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";
import { useSelector } from "react-redux";
import WebView from "react-native-webview";
import Pdf from "react-native-pdf";

export const FileViewerRepo = ({ route }) => {
  const navigation = useNavigation();
  const { lampiran, type } = route.params;
  const { device } = useSelector((state) => state.apps);
  const pdfResource = { uri: lampiran, chace: true };

  const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
    pdfResource.uri
  )}`;

  const injectedHtml = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF.js Viewer</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        #sendAnnotations {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 1000;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <iframe id="pdfIframe" src="https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
      pdfResource.uri
    )}"></iframe>
    <button id="sendAnnotations">Send Annotations</button>

    <script>
        // Pastikan iframe sudah ter-load sebelum mengambil anotasi
        document.getElementById('pdfIframe').addEventListener('load', function () {
          // Kirim pesan untuk mengambil anotasi
          window.postMessage('getAnnotations', '*');
          });
          
          // Menangkap pesan dari React Native WebView
          window.addEventListener('message', function (event) {
            if (event.data === 'getAnnotations') {
              // Ambil data anotasi dari PDF.js
              alert(PDFViewerApplication)
              const annotations = [];
              const annotationStorage = PDFViewerApplication?.pdfDocument?.annotationStorage?._storage || {};
              window.ReactNativeWebView.postMessage(PDFViewerApplication);

                // Ambil semua anotasi yang ada
                for (const key in annotationStorage) {
                    annotations.push({
                        id: key,
                        data: annotationStorage[key],
                    });
                }

                // Kirim anotasi ke React Native WebView
                window.ReactNativeWebView.postMessage(JSON.stringify(annotations));
            }
        });
    </script>
</body>
</html>

`;

  const handleMessage = async (event) => {
    const base64PDF = event.nativeEvent.data;

    // Simpan file PDF ke perangkat
    const fileUri = `${FileSystem.documentDirectory}annotated.pdf`;
    try {
      const cleanBase64 = base64PDF.replace(
        /^data:application\/pdf;base64,/,
        ""
      );
      await FileSystem.writeAsStringAsync(fileUri, cleanBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      Alert.alert("File Saved", `PDF saved at: ${fileUri}`);
    } catch (error) {
      Alert.alert("Error", "Failed to save PDF");
    }
  };

  console.log(pdfResource.uri);
  return (
    <>
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
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        {/* <View style={{ flex: 1, alignItems: 'center', marginRight: 50 }}>
                  <Text style={{ fontSize: FONTSIZE.H1, fontWeight: FONTWEIGHT.bold, color: COLORS.white }}>Detail</Text>
              </View> */}
      </View>
      <View style={{ width: "100%", height: "90%" }}>
        {type === "ppt" ||
        type === "pptx" ||
        type === "xls" ||
        type === "xlsx" ||
        type === "doc" ||
        type === "docx" ? (
          <WebView
            source={{
              uri: `https://view.officeapps.live.com/op/embed.aspx?src=${lampiran}`,
            }}
            style={{ flex: 1 }}
          />
        ) : type === "pdf" ? (
          <Pdf
            trustAllCerts={false}
            source={pdfResource}
            style={{
              flex: 1,
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
          />
        ) : null}
      </View>
    </>
  );
};
