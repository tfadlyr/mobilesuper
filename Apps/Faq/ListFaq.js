import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
  spacing,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Loading } from "../../components/Loading";
import { TopsFaq } from "../../utils/menutab";

export const ListFaq = () => {
  const [inputValue, setInputValue] = useState("");

  const { loading } = useSelector((state) => state.Faq);
  const { device } = useSelector((state) => state.apps);
  const [search, setSearch] = useState("");

  const navigation = useNavigation();

  const filter = () => {
    setSearch(inputValue);
  };
  return (
    <>
      {loading ? <Loading /> : null}
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.primary,
          height: 80,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 50,
            width: device === "tablet" ? 40 : 24,
            height: device === "tablet" ? 40 : 24,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center", marginRight: 40 }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
            }}
          >
            FAQ
          </Text>
        </View>
      </View>

      {/* FAQ */}
      <View
        style={{
          paddingTop: spacing.default,
          padding: spacing.default,
          paddingBottom: 160,
        }}
      >
        <View>
          <Text
            style={{
              fontWeight: FONTWEIGHT.bold,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            Halo, Ada yang bisa kami bantu?
          </Text>
        </View>
        {/* Input Searching */}
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 8,
              backgroundColor: COLORS.white,
            }}
          >
            <View style={styles.input}>
              <Ionicons
                name="search"
                size={fontSizeResponsive("H2", device)}
                color={COLORS.primary}
              />
              <TextInput
                placeholder={"Cari..."}
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  flex: 1,
                }}
                maxLength={30}
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
                onEndEditing={filter}
                clearButtonMode="always"
              />
            </View>
          </View>
        </View> */}
        {/* Kategori */}
        <View
          style={{
            flexDirection: "row",
            marginVertical: spacing.default,
            height: "100%",
            flexGrow: 0,
          }}
        >
          <TopsFaq />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: spacing.default,
    borderWidth: 1,
    borderColor: COLORS.ExtraDivinder,
    borderRadius: 8,
  },
});
