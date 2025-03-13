import React from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../config/SuperAppps";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const FirstRenderIos = () => {
  const navigation = useNavigation();
  return (
    <View>
      {/* <ImageBackground
        source={require("../assets/superApp/iosRender.png")}
        style={{ width: "100%", height: "100%" }}
      /> */}
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          bottom: "25%",
          left: "12%",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.white,
            width: 300,
            padding: 20,
            alignItems: "center",
            borderRadius: 16,
            flexDirection: "row",
            gap: 25,
            shadowOffset: { width: -2, height: 4 },
            shadowColor: "#171717",
            shadowOpacity: 0.2,
          }}
          onPress={() => {
            navigation.navigate("LoginToken");
          }}
        >
          <Image source={require("../assets/superApp/logoKecil.png")} />
          <Text>Lanjut Menggunakan SSO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.white,
            width: 300,
            padding: 20,
            alignItems: "center",
            borderRadius: 16,
            marginTop: 20,
            flexDirection: "row",
            gap: 25,
            shadowOffset: { width: -2, height: 4 },
            shadowColor: "#171717",
            shadowOpacity: 0.2,
          }}
          onPress={() => {
            navigation.navigate("RegisterIOs");
          }}
        >
          <AntDesign name="adduser" size={25} color="#6B7280" />
          <Text>Daftar Sekarang</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            width: 300,
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <Text style={{ color: "#6B7280" }}>Sudah Punya Akun?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("LoginIos");
            }}
          >
            <Text style={{ color: "#0087f9", fontWeight: "bold" }}>
              Log in disini!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
