import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dim,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {} from "react-native-safe-area-context";
import { COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";
import { useSelector } from "react-redux";
import Pdf from "react-native-pdf";
import WebView from "react-native-webview";
import * as FileSystem from "expo-file-system";
import PdfRendererView from "react-native-pdf-renderer";

const PdfViewer = ({ route }) => {
  const { data, type } = route.params;
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);
  const pdfResource = { uri: data.link, chace: true };
  const [pdfLink, setPdfLink] = useState(data?.link);

  useFocusEffect(
    React.useCallback(() => {
      // This function runs when the screen is focused
      return () => {
        // This function runs when the screen is unfocused or back is pressed
        setPdfLink(null);
      };
    }, [])
  );

  console.log(data);

  const inject = `
    (async function () {
        var { pdfjsLib } = globalThis;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';

        var pdfDoc = null,
            pageNum = 1,
            pageRendering = false,
            pageNumPending = null,
            scale = 0.8,
            canvas = document.getElementById('the-canvas'),
            ctx = canvas.getContext('2d');

        /**
    * Get page info from document, resize canvas accordingly, and render page.
    * @param num Page number.
    */
        function renderPage(num) {
            pageRendering = true;
            // Using promise to fetch the page
            pdfDoc.getPage(num).then(function (page) {
                var viewport = page.getViewport({ scale: scale });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);

                if (num <= pdfDoc.numPages) {
                      canvas = document.createElement("canvas");
                      ctx = canvas.getContext('2d');

                      document.body.appendChild(canvas);

                      // onNextPage()
                }

                // Wait for rendering to finish
                renderTask.promise.then(function () {
                    pageRendering = false;
                    if(num <= pdfDoc.numPages){
                      num++;
                      renderPage(num);
                    }
                });
            });

            // Update page counters
            document.getElementById('page_num').textContent = num;
        }

        /**
         * If another page rendering in progress, waits until the rendering is
         * finised. Otherwise, executes rendering immediately.
         */
        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }

        /**
         * Displays next page.
         */
        function onNextPage() {
          if (pageNum >= pdfDoc.numPages) {
            return;
          }else{
              pageNum++;
            queueRenderPage(pageNum);
          }
        }

        try {
        alert('${data}')
            const response = await fetch('${data}');
            const blob = await response.blob();

            pdfjsLib.getDocument(URL.createObjectURL(blob)).promise.then(function (pdfDoc_) {
                pdfDoc = pdfDoc_;

                // Initial/first page rendering
                renderPage(pageNum)
            });

        } catch (error) {
         alert(error)
            console.error('Error loading PDF:', error);
            window.ReactNativeWebView.postMessage('Error loading PDF: ' + error.message);
        }
    })();
  `;
  let pdfUrl = data; // Your PDF URL
  let url = `./web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;

  injectJavaScript = `
        (function () {
          const iframe = document.getElementById("iframe");
          if (iframe) {
            iframe.src = "${url}";
            iframe.onload = function () {
              if (iframe.contentWindow && iframe.contentWindow.PDFViewerApplication) {
                iframe.contentWindow.PDFViewerApplication.open('${pdfUrl}');
                } else {
                  console.log('PDFViewerApplication is not available.');
                  }
                };
            }
        })();
  `;

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1); // Update key to force re-render
  }, [data?.link]);

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
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        {/* <View style={{ flex: 1, alignItems: 'center', marginRight: 50 }}>
                    <Text style={{ fontSize: FONTSIZE.H1, fontWeight: FONTWEIGHT.bold, color: COLORS.white }}>Detail</Text>
                </View> */}
      </View>
      <View style={{ flex: 1 }}>
        {type !== undefined ? (
          <WebView
            originWhitelist={["*"]}
            source={{
              uri: "https://portal.kkp.go.id/assets/mobileViewer/index.html",
            }}
            style={{ flex: 1 }}
            allowFileAccess={true}
            androidLayerType={"software"}
            mixedContentMode={"always"}
            allowUniversalAccessFromFileURLs={true}
            scalesPageToFit={true}
            injectedJavaScript={injectJavaScript}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={(event) => {
              console.log(
                "Received message from WebView:",
                event.nativeEvent.data
              );
            }}
          />
        ) : (
          <Pdf
            trustAllCerts={false}
            key={key}
            source={{ uri: data }}
            style={{
              flex: 1,
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
          />
        )}
      </View>
    </>
  );
};

export default PdfViewer;

const styles = StyleSheet.create({
  pdf: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#000",
  },
});
