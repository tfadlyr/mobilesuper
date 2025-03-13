import { useNavigation } from "@react-navigation/native";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { useSelector } from "react-redux";
import Button from "../../../components/UI/Button";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, headerToken } from "../../../utils/http";
import { Config } from "../../../constants/config";

function SecretaryDetail({ route }) {
  const profile = useSelector((state) => state.profile.profile);
  const [errorAvatarTitle, setErrorAvatarTitle] = useState(false);
  const [errorAvatarSekre, setErrorAvatarSekre] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  let hak;
  let id = route.params.id;
  let count = 1;
  const [detail, setDetail] = useState([]);
  useEffect(() => {
    getDetail();
    getHeader();
  }, []);

  let header = {};
  async function getHeader() {
    try {
      header = await headerToken();
    } catch (error) {
      Alert.alert("Warning!", "Get Header not working!");
    }
  }
  async function getDetail() {
    setIsLoading(true);
    try {
      //get detail
      const response = await getHTTP(
        nde_api.secretarybyid.replace("{$id}", id)
      );
      setDetail(response.data);
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Warning!", "Secretary Detail not working!");
    }
    setIsLoading(false);
  }
  async function deactivate() {
    setIsLoading(true);
    try {
      const response = await getHTTP(
        nde_api.secretarydeactivate.replace("{$id}", id)
      );
      if (response.status == "Error") {
        Alert.alert("Peringatan!", "Deaktif sekretaris tidak berfungsi!");
      } else {
        Alert.alert("Berhasil!", "Deaktif sekretaris berhasil!");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Peringatan!", "Deaktif sekretaris tidak berfungsi!");
    }
    setIsLoading(false);
  }
  function confirm() {
    Alert.alert("Konfirmasi", "Anda yakin untuk deaktif sekretaris ini?", [
      {
        text: "Tidak",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YA", onPress: () => deactivate() },
    ]);
  }
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <>
      {loadingOverlay}
      <View style={styles.screen}>
        <View style={{ marginBottom: 6 }}>
          <Text>Pejabat</Text>
        </View>
        <Card style={styles.containerCard}>
          <Card.Title
            key={id}
            style={styles.containerCardTitle}
            title={
              <View style={{ flexDirection: "column" }}>
                <Text>{detail?.title?.nik}</Text>
                <Text style={styles.title}>{detail?.title?.official}</Text>
              </View>
            }
            titleNumberOfLines={5}
            subtitle={detail?.title?.name}
            subtitleNumberOfLines={5}
            left={(props) => (
              <View>
                {errorAvatarTitle && (
                  <Avatar.Image {...props} source={Config.avatar} />
                )}

                {!errorAvatarTitle && (
                  <Avatar.Image
                    {...props}
                    source={{
                      uri: `${nde_api.baseurl + detail?.title?.avatar}`,
                      method: "GET",
                      headers: header,
                    }}
                    onError={(e) => setErrorAvatarTitle(true)}
                  />
                )}
              </View>
            )}
          />
        </Card>
        <Card style={styles.containerCard}>
          <View style={styles.headerCard}>
            <View style={styles.header}>
              <Text style={styles.badgeText}>Sekretaris</Text>
            </View>
            <View
              style={[
                detail?.status == true
                  ? { backgroundColor: GlobalStyles.colors.greenlight }
                  : { backgroundColor: GlobalStyles.colors.yellowlight },
                styles.header,
                styles.badge,
              ]}
            >
              <Text
                style={[
                  detail?.status == true
                    ? { color: GlobalStyles.colors.green }
                    : { color: GlobalStyles.colors.yellow },
                  styles.badgeText,
                ]}
              >
                Aktif
              </Text>
            </View>
          </View>
          <Card.Title
            key={id}
            style={styles.containerCardTitle}
            title={
              <>
                <Text>
                  {detail?.profile?.nik}
                  {"\n"}
                </Text>
                <Text style={styles.title} numberOfLines={5}>
                  {detail?.profile?.name}
                </Text>
              </>
            }
            titleNumberOfLines={5}
            left={(props) => (
              <View>
                {errorAvatarSekre && (
                  <Avatar.Image {...props} source={Config.avatar} />
                )}

                {!errorAvatarSekre && (
                  <Avatar.Image
                    {...props}
                    source={{
                      uri: `${nde_api.baseurl + detail?.profile?.avatar}`,
                      method: "GET",
                      headers: header,
                    }}
                    onError={(e) => setErrorAvatarSekre(true)}
                  />
                )}
              </View>
            )}
          />
          <View style={styles.row}>
            <View>
              <Text>Diaktifkan</Text>
              <Text style={styles.title}>{detail?.created_date}</Text>
            </View>
            <View>
              <Text>Sifat</Text>
              <Text style={styles.title}>
                {detail?.personal_assistant == true
                  ? "Personal Assistant"
                  : "Secretary"}
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <Text>Hak</Text>
            {detail?.secretary_access?.map((item, index) => (
              <Fragment key={index}>
                {(item.biasa || item.rahasia || item.rahasia_prib) && (
                  <Text style={styles.title}>
                    {count++}.{item.biasa ? " Biasa" : ""}
                    {item.rahasia ? " Rahasia" : ""}
                    {item.rahasia_prib ? " Rhs-Prib" : ""}
                  </Text>
                )}
              </Fragment>
            ))}
          </View>
        </Card>
        {detail?.title?.nik == profile?.nik && (
          <Button style={styles.button} onPress={confirm}>
            Deaktif
          </Button>
        )}
      </View>
    </>
  );
}

export default SecretaryDetail;

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  containerCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  containerCardTitle: {
    padding: 16,
    alignItems: "flex-start",
  },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    padding: 8,
    width: "50%",
  },
  badge: {
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  badgeText: {
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  container: { padding: 16 },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  button: {
    borderRadius: 10,
    backgroundColor: GlobalStyles.colors.error500,
    color: GlobalStyles.colors.textWhite,
  },
});
