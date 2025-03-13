import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import { useSelector } from "react-redux";

export const Search = ({ onSearch, placeholder, iconColor }) => {
  const { device } = useSelector((state) => state.apps);

  return (
    <View style={styles.input}>
      <Ionicons
        name="search"
        size={fontSizeResponsive("H3", device)}
        color={iconColor}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.tertiary}
        style={{ fontSize: fontSizeResponsive("H2", device), flex: 1 }}
        maxLength={30}
        onChangeText={onSearch}
        clearButtonMode="always"
        allowFontScaling={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.ExtraDivinder,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
});
