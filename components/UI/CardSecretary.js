import { useEffect, useState } from "react";
import { Alert, Text, StyleSheet, View } from "react-native";
import { Config } from "../../constants/config";
import { GlobalStyles } from "../../constants/styles";
import { nde_api } from "../../utils/api.config";
import { headerToken } from "../../utils/http";
import { COLORS } from "../../config/SuperAppps";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

function CardSecretary({ data, onPress }) {
  const [errorAvatarTitle, setErrorAvatarTitle] = useState(false);
  const [errorAvatarSekre, setErrorAvatarSekre] = useState(false);
  let header = {};
  async function getHeader() {
    try {
      header = await headerToken();
    } catch (error) {
      Alert.alert("Warning!", "Get Header not working!");
    }
  }
  useEffect(() => {
    getHeader();
  }, []);
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 8,
          marginBottom: 20,
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.primary,
            padding: 20,
            flexDirection: "row",
            gap: 10,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }}
        >
          {errorAvatarSekre && (
            <Image
              source={Config.avatar}
              style={{
                borderRadius: 50,
                width: 32,
                height: 32,
                borderWidth: 1,
                borderColor: COLORS.white,
              }}
            />
          )}
          {!errorAvatarSekre && (
            <Image
              source={{
                uri: `${nde_api.baseurl + data.profile.avatar}`,
                method: "GET",
                headers: header,
              }}
              onError={(e) => setErrorAvatarSekre(true)}
              style={{
                borderRadius: 50,
                width: 32,
                height: 32,
                borderWidth: 1,
                borderColor: COLORS.white,
              }}
            />
          )}
          <View style={{ gap: 2, width: "90%" }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.white,
              }}
            >
              {data.profile.fullname}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: COLORS.white,
              }}
            >
              {data.title.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            padding: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text
              style={{ fontSize: 13, fontWeight: 400, color: COLORS.lighter }}
            >
              Diaktifkan :{" "}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              {data.created_date}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={16}
            color={COLORS.lighter}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CardSecretary;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  cardContent: {
    flexDirection: "row",
    paddingBottom: 8,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    backgroundColor: GlobalStyles.colors.dSecretary,
  },
  avaSecre: {
    marginLeft: -25,
    marginTop: 30,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  containerTitle: {
    width: "75%",
    marginLeft: 16,
  },
  containerNoTitle: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  title: {
    fontSize: GlobalStyles.font.lg,
    fontWeight: "bold",
    width: "75%",
    color: GlobalStyles.colors.textWhite,
  },
  subtitle: {
    fontSize: GlobalStyles.font.sm,
    color: GlobalStyles.colors.textWhite,
  },
  subtitleArrow: {
    marginLeft: -8,
  },
  subtitleSecre: {
    flexDirection: "row",
    alignItems: "center",
  },
});
