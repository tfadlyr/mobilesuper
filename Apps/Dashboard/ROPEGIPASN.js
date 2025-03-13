import React from "react";
import { Platform, Text, View } from "react-native";
import WebView from "react-native-webview";
import { COLORS, PADDING } from "../../config/SuperAppps";

export const ROPEGIPASN = () => {
  return (
    <View style={{ height: "90%", width: "100%", padding: PADDING.Page }}>
      <WebView
        originWhitelist={["*"]}
        source={{
          uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DKepegawaian/DRopegIPASN.html",
        }}
        style={{ flex: 1 }}
        allowFileAccess={true}
        textZoom={100}
        androidLayerType={"hardware"}
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
