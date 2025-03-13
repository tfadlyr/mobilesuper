import { useEffect, useState } from "react";
import { Alert, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { nde_api } from "../../utils/api.config";
import { headerToken } from "../../utils/http";
import moment from "moment/min/moment-with-locales";
import { Config } from "../../constants/config";
import { COLORS, DATETIME } from "../../config/SuperAppps";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "react-native-paper";

function CardDelegation({ data, onPress }) {
  const [errorAvatarTitle, setErrorAvatarTitle] = useState(false);
  const [errorAvatarDelegasi, setErrorAvatarDelegasi] = useState(false);
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
      <View>
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
              backgroundColor: "#7B570F",
              padding: 20,
              flexDirection: "column",
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
            }}
          >
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{ fontSize: 13, fontWeight: 700, color: COLORS.white }}
              >
                {data.title.name}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#7B570F",
                flexDirection: "row",
                gap: 10,
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
              }}
            >
              {errorAvatarTitle && (
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
              {!errorAvatarTitle && (
                <Image
                  source={{
                    uri: `${nde_api.baseurl + data.title?.avatar}`,
                    method: "GET",
                    headers: header,
                  }}
                  style={{
                    borderRadius: 50,
                    width: 32,
                    height: 32,
                    borderWidth: 1,
                    borderColor: COLORS.white,
                  }}
                  onError={() => setErrorAvatarTitle(true)}
                />
              )}
              {errorAvatarDelegasi && (
                <Image
                  source={Config.avatar}
                  style={{
                    borderRadius: 50,
                    width: 32,
                    height: 32,
                    borderWidth: 1,
                    borderColor: COLORS.white,
                    marginLeft: -30,
                    marginTop: 20,
                  }}
                />
              )}
              {!errorAvatarDelegasi && (
                <Image
                  source={{
                    uri: `${nde_api.baseurl + data.delegasi?.avatar}`,
                    method: "GET",
                    headers: header,
                  }}
                  style={{
                    borderRadius: 50,
                    width: 32,
                    height: 32,
                    borderWidth: 1,
                    borderColor: COLORS.white,
                    marginLeft: -30,
                    marginTop: 20,
                  }}
                  onError={() => setErrorAvatarDelegasi(true)}
                />
              )}
              <View style={{ gap: 2, width: "90%" }}>
                <Text
                  style={{ fontSize: 11, fontWeight: 400, color: COLORS.white }}
                >
                  {data.title.label}
                </Text>
                <Ionicons
                  name="return-down-back-outline"
                  size={16}
                  color={COLORS.white}
                />
                <Text
                  style={{ fontSize: 11, fontWeight: 400, color: COLORS.white }}
                >
                  {data.delegasi.fullname}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 5,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: COLORS.lighter,
                    textAlign: "right",
                    width: 60,
                  }}
                >
                  Mulai :{" "}
                </Text>
                <Text style={{ fontSize: 13, fontWeight: 400 }}>
                  {moment(data.start_date)
                    .locale("id")
                    .format(DATETIME.LONG_DATE)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: COLORS.lighter,
                    textAlign: "right",
                    width: 60,
                  }}
                >
                  Selesai :{" "}
                </Text>
                <Text style={{ fontSize: 13, fontWeight: 600 }}>
                  {moment(data.end_date)
                    .locale("id")
                    .format(DATETIME.LONG_DATE)}
                </Text>
              </View>
            </View>
            <Chip
              compact={true}
              textStyle={
                data.status == "activate"
                  ? {
                      color: GlobalStyles.colors.green,
                    }
                  : data.status == "waiting"
                  ? {
                      color: GlobalStyles.colors.yellow,
                    }
                  : ""
              }
              style={[
                data.status == "activate"
                  ? {
                      backgroundColor: GlobalStyles.colors.greenlight,
                    }
                  : data.status == "waiting"
                  ? {
                      backgroundColor: GlobalStyles.colors.yellowlight,
                    }
                  : "",
                { borderRadius: 50 },
              ]}
            >
              {data.status == "activate"
                ? "Aktif"
                : data.status == "waiting"
                ? "Menunggu"
                : ""}
            </Chip>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CardDelegation;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    backgroundColor: GlobalStyles.colors.dDelegation,
    paddingBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avaDelegasi: {
    marginLeft: -25,
    marginTop: 30,
  },
  containerTitle: {
    width: "75%",
    marginLeft: 8,
  },
  containerNoTitle: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  title: {
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
    color: GlobalStyles.colors.textWhite,
  },
  subtitle: {
    fontSize: GlobalStyles.font.sm,
    color: GlobalStyles.colors.textWhite,
  },
  subtitleDele: {
    flexDirection: "row",
    alignItems: "center",
  },
});
