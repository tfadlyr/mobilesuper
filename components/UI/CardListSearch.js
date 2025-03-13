import { Avatar, Card, Divider, IconButton } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { nde_api } from "../../utils/api.config";
import { useEffect, useState } from "react";
import { headerToken } from "../../utils/http";
import { useNavigation } from "@react-navigation/native";
import { Config } from "../../constants/config";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { COLORS, FONTSIZE } from "../../config/SuperAppps";

function CardListSearch({ data, tipe, onPress }) {
  const navigation = useNavigation();
  const [title, setTitle] = useState();
  const [errorAvatar, setErrorAvatar] = useState(false);
  let header = {};
  useEffect(() => {
    if (tipe == "agendain") {
      setTitle("Log Disposition\nIncoming Letter");
    } else if (tipe == "agendadispo") {
      setTitle("Log Disposition\nDisposition Letter");
    } else if (tipe == "agendaout") {
      setTitle("Log Disposition\nSubmitted Letter");
    } else if (tipe == "agendamydispo") {
      setTitle("Log Disposition\nMy Disposition Letter");
    }
    getHeader();
  }, []);
  async function getHeader() {
    header = await headerToken();
  }

  function selectDetailHandler() {
    if (tipe == "agendain") {
      navigation.navigate("TabViewBg", {
        id: data.id,
        screen: "detailAgenda",
        position: "bottom",
      });
    } else if (tipe == "agendadispo" || tipe == "agendamydispo") {
      navigation.navigate("DispositionDetail", {
        id: data.id,
      });
    } else if (tipe == "agendaout") {
      navigation.navigate("SubmittedDetail", {
        id: data.id,
      });
    }
  }
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 8,
          padding: 15,
          marginTop: 16,
          //shadow ios
          shadowOffset: { width: 0, height: 1 },
          shadowColor: "#171717",
          shadowOpacity: 0.1,
          //shadow android
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ gap: 10, width: "70%" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              {data?.unread && (
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: COLORS.warning,
                  }}
                />
              )}
              <Text
                style={[
                  data?.unread ? { fontWeight: "bold" } : { fontWeight: 600 },
                  { fontSize: 13 },
                ]}
              >
                {data?.sender}
              </Text>
            </View>
            <Text style={{ fontSize: 11, fontWeight: 400 }}>
              {data?.subject}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: COLORS.lighter,
              }}
            >
              {data.date} {data.time.substr(0, 5)}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", width: "30%" }}>
            <View style={{ gap: 10, alignItems: "center" }}>
              {(data.type == "incoming" ||
                data.type == "disposition" ||
                data.type == "submitted" ||
                data.type == "outgoing") && (
                <View
                  style={[
                    data.type == "disposition"
                      ? {
                          backgroundColor: GlobalStyles.colors.yellow,
                        }
                      : data.type == "incoming"
                      ? {
                          backgroundColor: GlobalStyles.colors.tertiery,
                        }
                      : data.type == "submitted"
                      ? {
                          backgroundColor: GlobalStyles.colors.red,
                        }
                      : data.type == "outgoing"
                      ? {
                          backgroundColor: GlobalStyles.colors.yellow,
                        }
                      : {},
                    styles.badgeTipeLetter,
                  ]}
                >
                  <Text
                    style={{
                      color: GlobalStyles.colors.textWhite,
                      fontSize: 11,
                    }}
                  >
                    {data.type == "incoming"
                      ? "Incoming"
                      : data.type == "disposition"
                      ? "Disposition"
                      : data.type == "submitted"
                      ? "Submitted"
                      : data.type == "outgoing"
                      ? "Need Follow Up"
                      : ""}
                  </Text>
                </View>
              )}

              {errorAvatar && (
                <Image
                  source={Config.avatar}
                  style={{
                    borderRadius: 50,
                    width: 40,
                    height: 40,
                    borderWidth: 1,
                    borderColor: COLORS.white,
                  }}
                />
              )}
              {!errorAvatar && (
                <Image
                  source={{
                    uri: `${
                      nde_api.baseurl +
                      "crsbe" +
                      data.avatar.slice(4, data.avatar.length)
                    }`,
                    method: "GET",
                    headers: header,
                  }}
                  style={{
                    borderRadius: 50,
                    width: 40,
                    height: 40,
                    borderWidth: 1,
                    borderColor: COLORS.white,
                  }}
                  onError={() => setErrorAvatar(true)}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Divider />
    </>
  );
}

export default CardListSearch;

const styles = StyleSheet.create({
  cardUnread: {
    backgroundColor: GlobalStyles.colors.textWhite,
    borderLeftWidth: 3,
    borderLeftColor: GlobalStyles.colors.yellow,
    borderRadius: 0,
  },
  cardRead: {
    backgroundColor: GlobalStyles.colors.greylight,
    borderLeftWidth: 3,
    borderLeftColor: GlobalStyles.colors.grey,
    borderRadius: 0,
  },
  cardReadDispo: {
    backgroundColor: GlobalStyles.colors.greylight,
    borderLeftWidth: 3,
    borderLeftColor: GlobalStyles.colors.blue,
    borderRadius: 0,
  },
  cardSecre: {
    borderLeftWidth: 3,
    borderLeftColor: GlobalStyles.colors.red,
    borderRadius: 0,
  },
  containerCard: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginRight: 16,
    marginVertical: 8,
  },
  rightStyle: { width: "15%" },
  rightCard: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  remaining: {
    textAlign: "center",
  },
  date: {
    textAlign: "right",
  },
  containerButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 0,
  },
  button: {
    margin: 0,
  },
  footer: {
    flexDirection: "row",
  },
  badgeTipeLetter: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    padding: 8,
  },
  badgeStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  badgeRemaining: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.tertiery,
    borderRadius: 6,
    paddingRight: 8,
  },
});
