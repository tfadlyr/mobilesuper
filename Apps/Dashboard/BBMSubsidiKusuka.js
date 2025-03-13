import React from "react";
import {
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import WebView from "react-native-webview";
import { COLORS, getOrientation, PADDING } from "../../config/SuperAppps";
import { useSelector } from "react-redux";

export const BBMSubsidiKusuka = () => {
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
    met.content = 'width=device-width, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5';
    met.charset = 'UTF-8';
    met.name = 'viewport';
    var head = document.getElementsByTagName("head")[0];
    head.append(met);
  }, 500)`;

  const injectedJavaScriptBeforeContentLoadedIpadLandscape11 = `setTimeout(function () {
    var met = document.createElement('meta');
    met.content = 'width=device-width, initial-scale=0.7, maximum-scale=0.7, minimum-scale=0.7';
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
                  uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DKusuka/DBBMSubsidi.html",
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
                  uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DKusuka/DBBMSubsidi.html",
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
                  uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DKusuka/DBBMSubsidi.html",
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
                  uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DKusuka/DBBMSubsidi.html",
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
            uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DKusuka/DBBMSubsidi.html",
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
  );
};
