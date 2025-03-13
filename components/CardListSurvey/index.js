import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import Checkbox from "expo-checkbox";

export const CardListSurvey = ({
  data,
  pilihan = [],
  device,
  pertanyaan = "",
  tipe = "one-choice",
  validation = [],
  onClick = () => {},
}) => {
  const getCheckedstatus = (val, key) => {
    const realKey = key.split(". ")[1]?.replace(":", "");
    if (data[realKey]?.includes(val)) return true;
    else return false;
  };

  const getValidation = (val) => {
    const realKey = val.split(". ")[1]?.replace(":", "");
    if (validation?.includes(realKey)) {
      return <Text>Mohon Masukan Survey dengan Benar</Text>;
    } else {
      return null;
    }
  };
  return (
    <View style={{ marginHorizontal: 20 }}>
      <Text
        style={{
          marginVertical: 10,
          fontSize: fontSizeResponsive("Judul", device),
        }}
      >
        {pertanyaan}
      </Text>
      {getValidation(pertanyaan)}
      {pilihan.map((label) =>
        tipe === "one-choice" ? (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            onPress={() => onClick(pertanyaan, label.value)}
          >
            {getCheckedstatus(label.value, pertanyaan) ? (
              <Ionicons
                name="radio-button-on"
                size={24}
                color={COLORS.primary}
              />
            ) : (
              <Ionicons
                name="radio-button-off"
                size={24}
                color={COLORS.primary}
              />
            )}
            <Text>{label.label}</Text>
          </TouchableOpacity>
        ) : tipe === "multi-choices" ? (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            onPress={() => onClick(pertanyaan, label)}
          >
            {getCheckedstatus(label, pertanyaan) ? (
              <Ionicons name="checkbox" size={24} color={COLORS.primary} />
            ) : (
              <Ionicons
                name="square-outline"
                size={24}
                color={COLORS.primary}
              />
            )}
            <Text>{label}</Text>
          </TouchableOpacity>
        ) : null
      )}
    </View>
  );
};
