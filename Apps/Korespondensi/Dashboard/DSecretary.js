import { Fragment } from "react";
import { View, StyleSheet, Text } from "react-native";
import CardSecretary from "../../../components/UI/CardSecretary";
import { GlobalStyles } from "../../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { removeAll } from "../../../store/addressbook";
import { TouchableOpacity } from "react-native";
import { COLORS } from "../../../config/SuperAppps";
import { ScrollView } from "react-native";

function DSecretary({ data, add }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <View style={styles.screen}>
      <ScrollView>
        {data?.results &&
          data.results.length > 0 &&
          data.results.map((data) => (
            <Fragment key={data.date}>
              {data.children &&
                data.children.map((item) => (
                  <CardSecretary
                    key={item.id}
                    data={item}
                    onPress={() => {
                      navigation.navigate("SecretaryDetail", {
                        id: item.id,
                        title: "Detail Sekretaris",
                      });
                    }}
                  />
                ))}
            </Fragment>
          ))}

        {data?.results && data.results.length == 0 && (
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 8,
              height: 100,
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
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: 700, color: COLORS.white }}
              >
                Anda Belum Punya Sekretaris
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      {add && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              height: 50,
              marginBottom: "10%",
              marginTop: 20,
              borderRadius: 8,
              justifyContent: "center",
            }}
            onPress={() => {
              dispatch(removeAll());
              navigation.navigate("SecretaryForm", {
                title: "Buat Sekretaris",
              });
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 13,
                fontWeight: 500,
                color: COLORS.white,
              }}
            >
              Tambah Sekretaris
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
export default DSecretary;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  button: {
    backgroundColor: GlobalStyles.colors.dSecretary,
    height: 40,
  },
  buttonText: {
    fontSize: GlobalStyles.font.lg,
    fontWeight: "bold",
  },
  container: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  cardContent: {
    flexDirection: "row",
    paddingBottom: 16,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    backgroundColor: GlobalStyles.colors.dSecretary,
  },
  footerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    margin: 4,
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
    color: GlobalStyles.colors.textWhite,
  },
});
