import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dim,
  Alert,
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
import { getTokenValue } from "../../service/session";

const ViewerAnnotation = ({ route }) => {
  const { data, type, id } = route.params;
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);
  const pdfResource = { uri: data.link, chace: true };
  const [pdfLink, setPdfLink] = useState(data?.link);

  const [token, setToken] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      // This function runs when the screen is focused
      return () => {
        // This function runs when the screen is unfocused or back is pressed
        setPdfLink(null);
      };
    }, [])
  );

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1); // Update key to force re-render
  }, [data?.link]);

  const injectJavaScript = `
(function () {
            const iframe = document.getElementById("iframe");

            if (iframe) {
                iframe.src = url;
            }

            window.addEventListener("message", (event) => {
                if (event.data.type === "PDF_BLOB") {
                    const file = event.data.blob;
                    const temp = new File([file], "sampe_pdf.pdf_copy", { type: "application/pdf", path: "sampe_pdf.pdf_copy" });
                    const formData = new FormData();


                    // Pastikan 'temp' adalah objek File yang valid
                    if (temp instanceof File) {
                        formData.append('files', temp);

                        fetch('https://apigw.kubekkp.coofis.com/repository/attachment/${id}/update/', {
                            method: 'PUT',
                            headers: {
                                'Authorization': '${token}',
                            },
                            body: formData,
                        })
                            .then(response => {
                                if (!response.ok) {
                                    // Jika response status bukan 2xx, buang error
                                    throw new Error('Network response was not ok.');
                                }
                                return response.json();
                            })
                            .then(data => {
                                if (data.success) {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: "berhasil" }));
                                } else {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: "gagal", error: data.message }));
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                window.ReactNativeWebView.postMessage(JSON.stringify({ type: "gagal", error: error.message }));
                            });
                    } else {
                        console.error('Error: temp is not a valid File object');
                    }
                } else {
                 window.ReactNativeWebView.postMessage(JSON.stringify({ type: "kosong", error: 'kosong' }));
                }
            });
        })();
`;

  const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <title>PDF.js Viewer with Annotations</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
        overflow: auto;
        background-color: #f0f0f0;
      }
      #pdfContainer {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
      canvas {
        margin-bottom: 10px;
        border: 1px solid #ddd;
        display: block;
        cursor: crosshair;
      }
      .annotation {
        position: absolute;
        background-color: rgba(255, 255, 0, 0.7);
        color: black;
        font-size: 12px;
        padding: 2px 4px;
        border: 1px solid #000;
        border-radius: 3px;
      }
      .controls {
        display: flex;
        justify-content: space-around;
        padding: 10px;
        background-color: #333;
        color: white;
      }
      .controls input[type="color"] {
        width: 30px;
        height: 30px;
      }
    </style>
  </head>
  <body>
    <div class="controls">
      <input type="color" id="colorPicker" value="#ff0000">
      <button id="clearAnnotations">Clear Annotations</button>
    </div>
    <div id="pdfContainer"></div>
    <script>
      const url = "${data}";
      const container = document.getElementById("pdfContainer");
      const colorPicker = document.getElementById("colorPicker");
      const clearAnnotationsBtn = document.getElementById("clearAnnotations");
      const annotations = [];

      // Fungsi untuk membuat anotasi coret-coret
      const startAnnotation = (event) => {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = 0;
        canvas.height = 0;
        canvas.style.position = "absolute";
        canvas.style.left = (x) + 'px';  // Menggunakan concatenation
        canvas.style.top = (y) + 'px';    // Menggunakan concatenation
        container.appendChild(canvas);

        let drawing = false;

        const onMouseMove = (e) => {
          if (!drawing) return;

          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          context.lineTo(x, y);
          context.stroke();
        };

        const onMouseUp = () => {
          drawing = false;
          canvas.removeEventListener("mousemove", onMouseMove);
          canvas.removeEventListener("mouseup", onMouseUp);
          annotations.push({ canvas, color: context.strokeStyle });
        };

        drawing = true;
        context.lineWidth = 2;
        context.strokeStyle = colorPicker.value;
        context.lineCap = "round";

        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseup", onMouseUp);
      };

      pdfjsLib.getDocument(url).promise.then((pdf) => {
        const totalPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          pdf.getPage(pageNum).then((page) => {
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            container.appendChild(canvas);

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            page.render(renderContext);

            // Menambahkan event untuk coret-coret
            canvas.addEventListener("mousedown", startAnnotation);
          });
        }
      }).catch(error => {
        console.error("Error loading PDF:", error);
      });

      // Clear all annotations
      clearAnnotationsBtn.addEventListener("click", () => {
        container.querySelectorAll('canvas').forEach(canvas => {
          canvas.remove();
        });
        annotations.length = 0;
      });

      // Change annotation color
      colorPicker.addEventListener("input", (event) => {
        annotations.forEach(annotation => {
          annotation.canvas.getContext('2d').strokeStyle = event.target.value;
        });
      });
    </script>
  </body>
</html>
`;

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
              uri: `https://portal.kkp.go.id/assets/mobileStylus/index.html?file=${encodeURIComponent(
                data
              )}`,
            }}
            // source={{ html: htmlContent }}
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
              console.log(event);
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === "berhasil") {
                  Alert.alert("PERHATIAN!", "Data berhasil diubah");
                  navigation.navigate("DetailTinjauan");
                } else if (data.type === "gagal") {
                  Alert.alert("PERHATIAN!", "Data gagal diubah");
                } else {
                  Alert.alert("PERHATIAN!", "Tidak boleh kosong");
                }
              } catch (error) {
                console.error("Error parsing message:", error);
              }
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

export default ViewerAnnotation;

const styles = StyleSheet.create({
  pdf: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#000",
  },
});
