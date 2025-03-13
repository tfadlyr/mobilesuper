import React from "react";
import { Linking, Platform, ScrollView, View } from "react-native";
import { Modal, TouchableOpacity } from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { handleUpgradeLink } from "../../utils/http";

export const Dialog = ({ title, content, buttonTitle, modal }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modal}
      onRequestClose={() => {
        //   setVisibleModal(!visibleModal);
      }}
    >
      <TouchableOpacity
        style={[
          Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
          styles.backdrop,
        ]}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            width: "90%",
            borderRadius: 10,
            alignContent: "center",
          }}
        >
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: FONTSIZE.Judul,
                  fontWeight: FONTWEIGHT.bold,
                }}
              >
                {title}
              </Text>
            </View>

            {/* <TouchableOpacity
                              style={{}}
                              onPress={() => {
                                setVisibleModal(false);
                              }}
                            >
                              <Ionicons
                                name="close-outline"
                                size={24}
                                color={COLORS.lighter}
                              />
                            </TouchableOpacity> */}
          </View>
          {/* custom divider */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 1,
                width: "90%",
                backgroundColor: "#DBDADE",
                marginVertical: 10,
              }}
            />
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <Text>{content}</Text>
          </View>

          <View style={{ marginBottom: 20, alignItems: "flex-end" }}>
            <TouchableOpacity
              style={{
                width: "40%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                marginHorizontal: 20,
                marginTop: 10,
                backgroundColor: COLORS.primary,
                padding: 10,
              }}
              onPress={() => {
                // handleUpgradeLink();
                if (Platform.OS === "android") {
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=go.id.kkp.portal"
                  );
                } else if (Platform.OS === "ios") {
                  Linking.openURL(
                    "https://apps.apple.com/app/superapps-kkp/id6478191000"
                  );
                }
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: FONTSIZE.Judul,
                }}
              >
                {buttonTitle}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
    width: 390,
    height: 260,
    resizeMode: "cover",
  },
  imageAndroid: {
    width: 420,
    height: 260,
    resizeMode: "cover",
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
