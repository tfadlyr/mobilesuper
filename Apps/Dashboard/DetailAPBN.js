import React from "react";
import { Dimensions, Platform, View } from "react-native";
import { Text } from "react-native";
import WebView from "react-native-webview";
import { COLORS, PADDING } from "../../config/SuperAppps";

export const DetailAPBN = () => {
  const widthTableu = Dimensions.get("window").width;
  let inject = `
  $('.tableauViz').css({'width': '${widthTableu}'})
  $('.tableauPlaceholder').css({'background-color': 'red', 'width': '900px'})
  `;
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        padding: PADDING.Page,
      }}
    >
      <WebView
        originWhitelist={["*"]}
        source={{
          uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DKeuangan/DAPBNDetail.html",
        }}
        style={{ flex: 1 }}
        allowFileAccess={true}
        androidLayerType={"software"}
        mixedContentMode={"always"}
        allowUniversalAccessFromFileURLs={true}
        scalesPageToFit={false}
      />
      <Text style={{ color: COLORS.primary }}>
        *) Gunakan 2 jari untuk menyesuaikan zoom
      </Text>
    </View>
  );
};
