import React from "react";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TopsTP } from "../../utils/menutab";
import { COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";

export const Tp = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
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
            backgroundColor: "white",
            borderRadius: 20,
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
          <Text
            style={{
              fontSize: FONTSIZE.H1,
              fontWeight: FONTWEIGHT.bold,
              color: "white",
            }}
          >
            Tautan Pintas
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: "red" }}>
        <TopsTP />
      </View>
    </View>
  );
};
