import { useNavigation } from "@react-navigation/native";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, Card, Divider, IconButton } from "react-native-paper";
import { useSelector } from "react-redux";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import { handlerError, postHTTP } from "../../../utils/http";
import DetailAgenda from "../Detail/Tab/DetailAgenda";

function ForwardForm({ route, id, data, noAgenda, tipe }) {
  const [detail, setDetail] = useState();
  // const [id, setid] = useState();
  // const [noAgenda, setNoAgenda] = useState();
  // const [tipe, setTipe] = useState();
  const profile = useSelector((state) => state.profile.profile);
  const addressbook = useSelector((state) => state.addressbook.receivers);
  const navigation = useNavigation();
  const [selectedAddressbook, setSelectedAddressbook] = useState(addressbook);
  const [isLoading, setIsLoading] = useState();
  const refresh = navigation.addListener("focus", () => {
    setSelectedAddressbook(addressbook);
  });
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  useEffect(() => {
    // setid(route?.params?.id);
    // setDetail(route?.params?.data);
    // setNoAgenda(route?.params?.noAgenda);
    // setTipe(route?.params?.tipe);
    if (data == undefined) {
      setDetail(route?.params?.data);
    } else {
      setDetail(data);
    }
    return refresh;
  }, [data, route]);

  async function forward() {
    setIsLoading(true);
    try {
      let status = 1;
      //validation
      if (selectedAddressbook.length == 0) {
        status = 0;
      }
      if (status == 1) {
        //prep-data
        let kepada = [];
        let kepada_ids = [];
        selectedAddressbook.map((item) => {
          kepada.push(item.fullname ? item.fullname : item.title);
          kepada_ids.push(item.nik ? item.nik : item.code);
        });
        kepada = kepada.join(",");
        kepada_ids = kepada_ids.join(",");
        let data = {
          request: [
            {
              kepada: kepada,
              kepada_ids: kepada_ids,
              nota_tindakan_free: "",
              nota_tindakan: "Forward",
            },
          ],
        };
        //post api forward
        const response = await postHTTP(
          nde_api.postForward.replace("{$type}", tipe).replace("{$id}", id),
          data
        );
        //alert response
        if (response.data.status == "Error") {
          Alert.alert("Peringatan!", response.data.msg);
        } else {
          Alert.alert("Berhasil!", "Anda berhasil meneruskan surat ini!");
          navigation.goBack();
          // navigation.goBack();
        }
      } else {
        Alert.alert("Peringatan!", "Silakan isi lembar teruskan!");
      }
      setIsLoading(false);
    } catch (error) {
      handlerError(error, "Peringatan!", "Meneruskan tidak berfungsi!");
      //   Alert.alert("Tes", error);
      setIsLoading(false);
    }
  }
  return (
    <ScrollView>
      {loadingOverlay}
      <View style={styles.screen}>
        <View style={styles.containerLabel}>
          <Text style={styles.titleLabel}>Diteruskan Dari</Text>
        </View>
        <Card style={styles.containerProfile}>
          <Card.Title
            style={styles.containerProfileTitle}
            titleNumberOfLines={100}
            titleStyle={styles.titleProfile}
            title={<Text>{profile?.fullname}</Text>}
            left={(props) => (
              <Avatar.Image
                {...props}
                source={{
                  uri: `${profile && nde_api.baseurl + profile?.avatar}`,
                  method: "GET",
                }}
                theme={{
                  colors: {
                    primary: GlobalStyles.colors.textWhite,
                  },
                }}
              />
            )}
          />
        </Card>
        <View style={styles.containerLabel}>
          <Text style={styles.titleLabel}>Alamat Kepada</Text>
        </View>
        <Card style={styles.containerCard}>
          <Card.Title
            style={styles.containerCardTitle}
            title={
              <>
                {selectedAddressbook?.map((item, index) => (
                  <Fragment key={item.nik ? item.nik : item.code}>
                    <Text style={styles.title}>
                      {index + 1}. {item.fullname ? item.fullname : item.title}
                      {"\n"}
                    </Text>
                  </Fragment>
                ))}
                {(selectedAddressbook == undefined ||
                  selectedAddressbook.length == 0) && (
                  <Text style={styles.titleName}>Nama/NIK</Text>
                )}
              </>
            }
            titleNumberOfLines={50}
            subtitleNumberOfLines={50}
            right={(props) => (
              <IconButton
                style={styles.containerIcon}
                {...props}
                icon="account-plus"
                onPress={() => {
                  navigation.navigate("Addressbook", {
                    title: "Addressbook\nForward",
                    multiple: true,
                    tipe: "receivers",
                  });
                }}
              />
            )}
          />
        </Card>
        {/* <View style={styles.containerLabel}>
          <Text style={styles.titleLabel}>Informasi Surat</Text>
        </View> */}
        <Card style={{ marginBottom: 16 }}>
          <DetailAgenda
            style={{
              borderRadius: 6,
              borderColor: GlobalStyles.colors.tertiery50,
              backgroundColor: GlobalStyles.colors.tertiery20,
            }}
            showBody={false}
            noAgenda={noAgenda ? noAgenda : detail?.agenda_number}
            data={detail}
            title={route?.params?.title}
          />
        </Card>
        <Button
          mode="contained"
          style={{ backgroundColor: GlobalStyles.colors.tertiery80 }}
          onPress={forward}
        >
          Kirim
        </Button>
      </View>
    </ScrollView>
  );
}

export default ForwardForm;

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    backgroundColor: GlobalStyles.colors.tertiery10,
  },
  containerLabel: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  titleLabel: {
    fontWeight: "bold",
    fontSize: GlobalStyles.font.md,
  },
  containerProfile: {
    marginBottom: 16,
    borderRadius: 6,
    backgroundColor: GlobalStyles.colors.tertiery20,
  },
  containerProfileTitle: {
    padding: 12,
  },
  titleProfile: {
    fontWeight: "bold",
    color: GlobalStyles.colors.textBlack,
  },
  subtitleProfile: {
    color: GlobalStyles.colors.textBlack,
  },
  containerCard: {
    marginBottom: 16,
    borderRadius: 6,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  containerCardTitle: {
    padding: 12,
    paddingBottom: 0,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  containerIcon: {},
});
