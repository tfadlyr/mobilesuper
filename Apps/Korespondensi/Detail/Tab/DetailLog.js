import moment from "moment";
import { last } from "ramda";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Avatar, Card, IconButton, Text } from "react-native-paper";
import LoadingOverlay from "../../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../../constants/styles";
import { nde_api } from "../../../../utils/api.config";
import { getHTTP } from "../../../../utils/http";
import RenderHTML from "react-native-render-html";

function DetailLog({ route, data, id, tipe, subject }) {
  const [log, setLog] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [perihal, setPerihal] = useState("");
  useEffect(() => {
    if (subject?.length == 0 || subject == undefined) {
      setPerihal(route?.params?.subject);
    }
    getLogDispo();
  }, [data, route]);

  const getLogDispo = async () => {
    setIsLoading(true);
    try {
      let response;
      if (data == undefined) {
        if (route?.params?.tipe == "agendain") {
          response = await getHTTP(
            nde_api.agendainlog.replace("{$id}", route?.params?.id)
          );
        } else if (route?.params?.tipe == "agendadispo") {
          response = await getHTTP(
            nde_api.agendadispolog.replace("{$id}", route?.params?.id)
          );
        } else if (route?.params?.tipe == "agendaout") {
          response = await getHTTP(
            nde_api.agendaoutlog.replace("{$id}", route?.params?.id)
          );
        }
      } else {
        if (tipe == "in") {
          response = await getHTTP(nde_api.agendainlog.replace("{$id}", id));
        } else if (tipe == "disposition" || tipe == "dispomenwamen") {
          response = await getHTTP(nde_api.agendadispolog.replace("{$id}", id));
        } else if (tipe == "out") {
          response = await getHTTP(nde_api.agendaoutlog.replace("{$id}", id));
        }
      }
      setLog(response?.data);
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Peringatan!", "Aktivitas disposisi tidak berfungsi!");
      setIsLoading(false);
    }
  };
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <ScrollView>
      {loadingOverlay}
      <View style={styles.screen}>
        {perihal && perihal?.length != 0 ? (
          <View
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 12,
              backgroundColor: GlobalStyles.colors.grey,
            }}
          >
            <Text style={{ color: GlobalStyles.colors.textWhite }}>
              {perihal?.replace("\\/", "/")}
            </Text>
          </View>
        ) : null}
        {log &&
          log.map((item, index) => (
            <Card key={item?.id} style={styles.containerCard}>
              <View style={styles.headerCard}>
                <View style={[styles.header, styles.badge]}>
                  <Text
                    style={[
                      { color: GlobalStyles.colors.textWhite },
                      styles.badgeText,
                    ]}
                  >
                    {tipe == "disposition" || tipe == "dispomenwamen"
                      ? "Aktivitas"
                      : "My"}{" "}
                    Disposisi {index + 1}
                  </Text>
                </View>
                <View style={styles.headerDate}>
                  <Text style={styles.badgeText}>
                    {moment(item.created_date).format("DD MMM YYYY HH:mm")}
                  </Text>
                </View>
              </View>
              <View style={[styles.row, { paddingTop: 16 }]}>
                <Text style={styles.title}>Diteruskan Dari</Text>
              </View>
              <View style={[styles.containerCardTitle]}>
                <Text numberOfLines={3}>{item.creator_name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.title}>Tindakan :</Text>
              </View>
              <View style={[styles.containerCardTitle]}>
                <Text numberOfLines={100}>
                  {item.notes.replace("\n", ", ")}
                </Text>
              </View>
              <View style={[styles.row, { marginBottom: 12 }]}>
                <RenderHTML
                  source={{ html: item?.message }}
                  contentWidth={width}
                  defaultTextProps={{ allowFontScaling: false }}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.title}>Diteruskan Kepada</Text>
              </View>
              <View style={[styles.containerCardTitle, { marginBottom: 12 }]}>
                <Text numberOfLines={100}>
                  {item.receivers.replace(/;/g, "\n")}
                </Text>
              </View>
            </Card>
          ))}

        {log?.length == 0 && (
          <Card style={styles.containerCard}>
            <View style={styles.headerCard}>
              <View style={[styles.header, styles.badge]}>
                <Text
                  style={[
                    { color: GlobalStyles.colors.textWhite },
                    styles.badgeText,
                  ]}
                >
                  Aktivitas Disposisi
                </Text>
              </View>
              <View style={styles.headerDate}>
                <Text style={styles.badgeText}>
                  Tidak ada Aktivitas Disposisi
                </Text>
              </View>
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
export default DetailLog;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  containerCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "white",
  },
  containerCardTitle: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: GlobalStyles.colors.grey,
    padding: 8,
    width: "45%",
  },
  headerDate: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
    width: "55%",
  },
  badge: {
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: "center",
    height: "100%",
  },
  badgeText: {
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  container: {
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: GlobalStyles.colors.greylight,
    borderColor: GlobalStyles.colors.primary,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inputContainerStyle: {
    justifyContent: "flex-start",
    // backgroundColor: GlobalStyles.colors.backgroundInput,
  },
});
