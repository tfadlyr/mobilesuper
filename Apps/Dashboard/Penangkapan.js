import React from "react";
import { Platform, ScrollView, useWindowDimensions, View } from "react-native";
import { Text } from "react-native";
import WebView from "react-native-webview";
import {
  COLORS,
  PADDING,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export const Penangkapan = () => {
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const injectedJavaScriptBeforeContentLoadedMobile = `setTimeout(function () {
    var met = document.createElement('meta');
    met.content = 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1';
    met.charset = 'UTF-8';
    met.name = 'viewport';
    var head = document.getElementsByTagName("head")[0];
    head.append(met);
  }, 500)`;

  const injectedJavaScriptBeforeContentLoadedIpadPotrait11 = `setTimeout(function () {
    var met = document.createElement('meta');
    met.content = 'width=device-width, initial-scale=0.6, maximum-scale=0.6, minimum-scale=0.6';
    met.charset = 'UTF-8';
    met.name = 'viewport';
    var head = document.getElementsByTagName("head")[0];
    head.append(met);
  }, 500)`;

  const injectedJavaScriptBeforeContentLoadedIpadLandscape11 = `setTimeout(function () {
    var met = document.createElement('meta');
    met.content = 'width=device-width, initial-scale=0.9, maximum-scale=0.9, minimum-scale=0.9';
    met.charset = 'UTF-8';
    met.name = 'viewport';
    var head = document.getElementsByTagName("head")[0];
    head.append(met);
  }, 500)`;

  const injectedJavaScriptBeforeContentLoadedIpadPotrait12 = `setTimeout(function () {
    var met = document.createElement('meta');
    met.content = 'width=device-width, initial-scale=0.7, maximum-scale=0.7, minimum-scale=0.7';
    met.charset = 'UTF-8';
    met.name = 'viewport';
    var head = document.getElementsByTagName("head")[0];
    head.append(met);
  }, 500)`;

  const injectedJavaScriptBeforeContentLoadedIpadLandscape12 = `setTimeout(function () {
    var met = document.createElement('meta');
    met.content = 'width=device-width, initial-scale=0.9, maximum-scale=0.9, minimum-scale=0.9';
    met.charset = 'UTF-8';
    met.name = 'viewport';
    var head = document.getElementsByTagName("head")[0];
    head.append(met);
  }, 500)`;

  const renderWebView = () => {
    if (device === "tablet") {
      if (getOrientation(screenWidth, screenHeight) === "landscape") {
        if (screenWidth <= 1194) {
          console.log("landscape 11");
          return (
            <>
              <Text>&nbsp;</Text>
              <WebView
                originWhitelist={["*"]}
                source={{
                  uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DProduksiTangkap/DProduksiTangkapMobile.html",
                }}
                style={{
                  flex: 1,
                }}
                allowFileAccess={true}
                textZoom={100}
                androidLayerType={"hardware"}
                mixedContentMode={"always"}
                allowUniversalAccessFromFileURLs={true}
                scalesPageToFit={true}
                injectedJavaScriptBeforeContentLoaded={
                  injectedJavaScriptBeforeContentLoadedIpadLandscape11
                }
              />
            </>
          );
        } else {
          console.log("landscape 12");
          return (
            <>
              <Text>&nbsp;</Text>
              <WebView
                originWhitelist={["*"]}
                source={{
                  uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DProduksiTangkap/DProduksiTangkapMobile.html",
                }}
                style={{
                  flex: 1,
                }}
                allowFileAccess={true}
                textZoom={100}
                androidLayerType={"hardware"}
                mixedContentMode={"always"}
                allowUniversalAccessFromFileURLs={true}
                scalesPageToFit={true}
                injectedJavaScriptBeforeContentLoaded={
                  injectedJavaScriptBeforeContentLoadedIpadLandscape12
                }
              />
            </>
          );
        }
      } else {
        if (screenWidth <= 834) {
          console.log("potrait 11");
          return (
            <>
              <WebView
                originWhitelist={["*"]}
                source={{
                  uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DProduksiTangkap/DProduksiTangkapMobile.html",
                }}
                style={{
                  flex: 1,
                }}
                allowFileAccess={true}
                textZoom={100}
                androidLayerType={"hardware"}
                mixedContentMode={"always"}
                allowUniversalAccessFromFileURLs={true}
                scalesPageToFit={true}
                injectedJavaScriptBeforeContentLoaded={
                  injectedJavaScriptBeforeContentLoadedIpadPotrait11
                }
              />
            </>
          );
        } else {
          console.log("potrait 12");
          return (
            <>
              <WebView
                originWhitelist={["*"]}
                source={{
                  uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DProduksiTangkap/DProduksiTangkapMobile.html",
                }}
                style={{
                  flex: 1,
                }}
                allowFileAccess={true}
                textZoom={100}
                androidLayerType={"hardware"}
                mixedContentMode={"always"}
                allowUniversalAccessFromFileURLs={true}
                scalesPageToFit={true}
                injectedJavaScriptBeforeContentLoaded={
                  injectedJavaScriptBeforeContentLoadedIpadPotrait12
                }
              />
            </>
          );
        }
      }
    } else {
      return (
        <WebView
          originWhitelist={["*"]}
          source={{
            uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DProduksiTangkap/DProduksiTangkapMobile.html",
          }}
          style={{
            flex: 1,
          }}
          allowFileAccess={true}
          textZoom={100}
          androidLayerType={"hardware"}
          mixedContentMode={"always"}
          allowUniversalAccessFromFileURLs={true}
          scalesPageToFit={true}
          injectedJavaScriptBeforeContentLoaded={
            injectedJavaScriptBeforeContentLoadedMobile
          }
        />
      );
    }
  };
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View
        style={{
          backgroundColor: COLORS.primary,
          height: "10%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 20,
              width: device === "tablet" ? 46 : 28,
              height: device === "tablet" ? 46 : 28,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 20,
            }}
          >
            <Ionicons
              name="chevron-back"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 40,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: fontSizeResponsive("H3", device),
              fontWeight: 600,
            }}
          >
            Produksi Penangkapan
          </Text>
        </View>
      </View>
      <ScrollView
        style={{
          height: "100%",
          width: "100%",
          padding: PADDING.Page,
        }}
        maximumZoomScale={3}
        minimumZoomScale={1}
        contentContainerStyle={{ flex: 1 }}
      >
        {renderWebView()}
        <Text style={{ color: COLORS.primary }}>
          *) Gunakan 2 jari untuk menyesuaikan zoom
        </Text>
      </ScrollView>
    </View>
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
    height: 193,
    width: 350,
    borderRadius: 16,
  },
  imageAndroid: {
    height: 193,
    width: 369,
    borderRadius: 16,
  },
});
