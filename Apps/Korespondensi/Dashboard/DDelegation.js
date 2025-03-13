import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Fragment, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CardDelegation from "../../../components/UI/CardDelegation";
import { GlobalStyles } from "../../../constants/styles";
import { removeAll } from "../../../store/addressbook";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";
import { useCallback } from "react";
import { logout } from "../../../store/auth";
import { COLORS } from "../../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import * as Sentry from "@sentry/react-native";

function DDelegation({ add }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  let [listMyDelegation, setMyDelegation] = useState([]);
  const token = useSelector((state) => state.auth.token);
  useFocusEffect(
    useCallback(() => {
      getMyDelegation();
    }, [])
  );

  useEffect(() => {
    getMyDelegation();
  }, [token]);

  async function getMyDelegation() {
    try {
      //get secretary actived
      const response = await getHTTP(nde_api.delegationassigned);
      setMyDelegation(response.data);
    } catch (error) {
      if (error?.response?.status == 401 || error?.status == 401) {
        Sentry.captureEvent(error?.response);
        dispatch(logout());
      } else {
        handlerError(error, "Peringatan!", "List delegasi tidak berfungsi");
      }
    }
  }
  return (
    <>
      <ScrollView>
        <View style={styles.screen}>
          {listMyDelegation.results &&
            listMyDelegation.results.length > 0 &&
            listMyDelegation.results.map((data) => (
              <Fragment key={data.date}>
                {data.children &&
                  data.children.map((item) => (
                    <CardDelegation
                      key={item.id}
                      style={styles.card}
                      data={item}
                      onPress={() => {
                        navigation.navigate("DelegationDetail", {
                          id: item.id,
                          title: "Detail Delegasi",
                        });
                      }}
                    />
                  ))}
              </Fragment>
            ))}
          {listMyDelegation.results && listMyDelegation.results.length == 0 && (
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
                  backgroundColor: "#7B570F",
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
                  Anda Belum Punya Delegasi
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {add && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={{
              backgroundColor: "#7B570F",
              height: 50,
              marginBottom: "10%",
              marginTop: 20,
              borderRadius: 8,
              justifyContent: "center",
            }}
            onPress={() => {
              dispatch(removeAll());
              navigation.navigate("DelegationForm", {
                title: "Buat Delegasi",
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
              Tambah Delegasi
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
export default DDelegation;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 20,
  },
  card: {
    borderWidth: 1,
  },

  container: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  cardContent: {
    flexDirection: "row",
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    backgroundColor: GlobalStyles.colors.dDelegation,
  },
  footerDele: {
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
  footer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  button: {
    backgroundColor: GlobalStyles.colors.dDelegation,
  },
  buttonText: {
    fontSize: GlobalStyles.font.lg,
    fontWeight: "bold",
  },
});
