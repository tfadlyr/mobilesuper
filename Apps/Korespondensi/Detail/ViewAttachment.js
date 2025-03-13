import { useEffect, useState } from "react";
import { BackHandler, Dimensions, StyleSheet, View } from "react-native";
import { headerToken } from "../../../utils/http";
// import { WebView } from "react-native-webview";
import PDFReader from "rn-pdf-reader-js-improved";
import { nde_api } from "../../../utils/api.config";
import Pdf from "react-native-pdf";
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { Loading } from "../../../components/Loading";

function ViewAttachment({ route }) {
  const [isLoading, setisLoading] = useState(true);
  const [header, setHeader] = useState();
  const [stylus, setStylus] = useState(route?.params?.stylus);
  const [token, setToken] = useState(route?.params?.token);
  const [id, setId] = useState(route?.params?.id);
  const [title, setTitle] = useState(route?.params?.title);
  const navigation = useNavigation();
  useEffect(() => {
    if (header == undefined) {
      getHeader();
    }
  }, [header]);
  async function getHeader() {
    let response = await headerToken();
    setHeader(response);
  }

  const backAction = () => {
    if (stylus) {
      navigation.goBack();
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  return (
    <>
      {isLoading && <Loading />}
      {header && token && (
        <>
          <View style={{ flex: 1 }}>
            {stylus && (
              <WebView
                originWhitelist={["*"]}
                source={{
                  uri:
                    nde_api.baseurl_kores +
                      "stylus-mobile/" +
                      id +
                      "?stylusToken=" +
                      token || undefined,
                  headers: header,
                }}
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                }}
                onLoadStart={() => {
                  setisLoading(true);
                }}
                onLoadEnd={() => {
                  setisLoading(false);
                }}
                incognito={true}
                allowFileAccess={true}
                androidLayerType={"software"}
                mixedContentMode={"always"}
                allowUniversalAccessFromFileURLs={true}
                scalesPageToFit={false}
              />
            )}
            {!stylus && title != "Edit Surat" && (
              <WebView
                originWhitelist={["*"]}
                source={{
                  uri:
                    nde_api.baseurl_kores +
                      "stylus-mobile/" +
                      id +
                      "?stylusToken=" +
                      token +
                      "&previewPDF=1" || undefined,
                  headers: header,
                }}
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                }}
                onLoadStart={() => {
                  setisLoading(true);
                }}
                onLoadEnd={() => {
                  setisLoading(false);
                }}
                incognito={true}
                allowFileAccess={true}
                androidLayerType={"software"}
                mixedContentMode={"always"}
                allowUniversalAccessFromFileURLs={true}
                scalesPageToFit={false}
              />
            )}
            {!stylus && title == "Edit Surat" && (
              <WebView
                originWhitelist={["*"]}
                source={{
                  uri:
                    nde_api.baseurl_kores +
                      "editor-mobile/" +
                      id +
                      "?editorToken=-" || undefined,
                  headers: header,
                }}
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                }}
                onLoadStart={() => {
                  setisLoading(true);
                }}
                onLoadEnd={() => {
                  setisLoading(false);
                }}
                injectedJavaScriptBeforeContentLoaded={`
                  localStorage.setItem("token",'${token}')
                  `}
                incognito={true}
                allowFileAccess={true}
                androidLayerType={"software"}
                mixedContentMode={"always"}
                allowUniversalAccessFromFileURLs={true}
                scalesPageToFit={true}
              />
            )}
          </View>
        </>
      )}
    </>
  );
}
export default ViewAttachment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
