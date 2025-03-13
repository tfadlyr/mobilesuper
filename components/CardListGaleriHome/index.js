import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Platform } from "react-native";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { Text } from "react-native";
import { useSelector } from "react-redux";

export const CardListGaleriHome = ({ image, deskripsi, onclick }) => {
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);
  return (
    <View
      style={{
        flex: 0.5,
      }}
    >
      <TouchableOpacity onPress={onclick}>
        <View
          style={{
            backgroundColor: "#fff",
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: {
              height: 0,
              width: 0,
            },
            borderRadius: 16,
            marginHorizontal: 8,
            marginBottom: 16,
          }}
        >
          <Image
            source={{ uri: image }}
            style={{
              height: device === "tablet" ? 350 : 193,
              borderRadius: 16,
            }}
          />
          <View
            style={{
              padding: 10,
            }}
          >
            <Text
              numberOfLines={3}
              style={{
                color: COLORS.grey,
                marginVertical: 5,
                fontSize: fontSizeResponsive("H5", device),
                fontWeight: 400,
                textAlign: "center",
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              {deskripsi}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "#fff",
    height: 28,
    width: 28,
    borderRadius: 50,
  },
  imageIos: {
    height: 193,
    borderRadius: 16,
  },
  imageAndroid: {
    height: 193,
    borderRadius: 16,
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.7,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.7,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
