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
import {} from "react-native-safe-area-context";
import { COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";
import WebView from "react-native-webview";
import Pdf from "react-native-pdf";

export const FileViewer = ({ route }) => {
  const navigation = useNavigation();
  const { lampiran, type } = route.params;
  const pdfResource = { uri: lampiran, chace: true };
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
            width: 28,
            height: 28,
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
