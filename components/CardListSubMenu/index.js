import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
  imageApps,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { openURL } from "expo-linking";
import {
  FontAwesome5,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  Fontisto,
} from "@expo/vector-icons";

export const CardlistSubMenu = ({
  item,
  device,
  setModalInfo,
  isRoleLaporan,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        marginTop: 10,
        backgroundColor: COLORS.white,
        padding: 10,
        marginHorizontal: 15,
        borderRadius: 10,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        //shadow android
        elevation: 2,
        height: 70,
      }}
      onPress={() => {
        if (item.title === "Info") {
          setModalInfo(true);
        } else if (item.title === "e-Learning") {
          openURL(
            "https://elearning.kkp.go.id/auth/oauth2/login.php?id=1&wantsurl=https%3A%2F%2Felearning.kkp.go.id%2F&sesskey=Jhop9vc9S5"
          );
        } else {
          navigation.navigate(item.navigation);
        }
      }}
    >
      <View
        style={{
          width: 50,
          height: "100%",
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
        }}
      >
        {item.title === "Pengetahuan" ? (
          <FontAwesome5 name="lightbulb" size={40} color={COLORS.iconMenu} />
        ) : item.title === "Aksi Perubahan" ? (
          <MaterialIcons
            name="published-with-changes"
            size={40}
            color={COLORS.iconMenu}
          />
        ) : item.title === "Sertifikat" ? (
          <AntDesign name="folderopen" size={40} color={COLORS.iconMenu} />
        ) : item.title === "e-Learning" ? (
          <FontAwesome5 name="leanpub" size={40} color={COLORS.iconMenu} />
        ) : item.title === "Info" ? (
          <MaterialCommunityIcons
            name="information-outline"
            size={40}
            color={COLORS.iconMenu}
          />
        ) : item.title === "IPASN" ? (
          <AntDesign name="barschart" size={40} color={COLORS.iconMenu} />
        ) : item.title === "Pegawai" ? (
          <Ionicons name="people-sharp" size={40} color={COLORS.iconMenu} />
        ) : item.title === "Nominatif Pegawai" ? (
          <Fontisto name="persons" size={40} color={COLORS.iconMenu} />
        ) : item.title === "Laporan" && isRoleLaporan === true ? (
          <Ionicons name="file-tray-full" size={40} color={COLORS.iconMenu} />
        ) : null}
      </View>
      <Text
        style={{
          fontSize: fontSizeResponsive("Judul", device),
          fontWeight: FONTWEIGHT.bold,
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};
