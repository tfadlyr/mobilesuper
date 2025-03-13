import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Fragment, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { Avatar, Chip, List } from "react-native-paper";
import { Config } from "../../constants/config";
import { GlobalStyles } from "../../constants/styles";
import { nde_api } from "../../utils/api.config";
import { Image } from "react-native";
import { COLORS } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { headerToken } from "../../utils/http";

function ListTodo({ title, result }) {
  const [errorAvatarSender, setErrorAvatarSender] = useState(false);
  const [errorAvatarReceiver, setErrorAvatarReceiver] = useState(false);
  const navigation = useNavigation();
  let header = {};
  useEffect(() => {
    async function getToken() {
      try {
        header = await headerToken();
      } catch (error) {
        Alert.alert("Warning!", "Avatar " + title + " not working!");
      }
    }
    getToken();
  }, []);
  return (
    <View
      style={[
        title == "Searching" && styles.scrollSearch,
        title != "Searching" && styles.scroll,
      ]}
    >
      {result.results &&
        result.results.length > 0 &&
        result.results.map((data) => (
          <Fragment key={data.date}>
            {data.children &&
              data.children.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    navigation.navigate("TodoDetail", {
                      id: item.id,
                      title: "Detail " + Config.labelTodo,
                    });
                  }}
                >
                  <View style={styles.containerTodo}>
                    <View style={{ gap: 10, width: "80%" }}>
                      <Text style={{ fontSize: 13, fontWeight: 600 }}>
                        {item.subject}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 400,
                          color: COLORS.info,
                        }}
                      >
                        {item.description}
                      </Text>
                      <View style={{ flexDirection: "row", marginLeft: 8 }}>
                        {item.receiver &&
                          item.receiver.map((receiver, index) =>
                            index <= 3 ? (
                              <Fragment key={index}>
                                {errorAvatarReceiver && (
                                  <Image
                                    source={Config.avatar}
                                    style={{
                                      borderRadius: 50,
                                      width: 32,
                                      height: 32,
                                    }}
                                  />
                                )}
                                {!errorAvatarReceiver && (
                                  <Image
                                    source={{
                                      uri: `${
                                        nde_api.baseurl + receiver.avatar
                                      }`,
                                      method: "GET",
                                      headers: header,
                                    }}
                                    style={{
                                      borderRadius: 50,
                                      width: 32,
                                      height: 32,
                                    }}
                                    onError={(error) => {
                                      setErrorAvatarReceiver(true);
                                    }}
                                  />
                                )}
                              </Fragment>
                            ) : null
                          )}
                        {item.receiver.length > 4 && (
                          <Ionicons
                            name="ellipsis-horizontal-circle-outline"
                            size={35}
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          />
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {errorAvatarSender && (
                        <Image
                          source={Config.avatar}
                          style={{
                            borderRadius: 50,
                            width: 32,
                            height: 32,
                          }}
                        />
                      )}
                      {!errorAvatarSender && (
                        <Image
                          source={{
                            uri: `${nde_api.baseurl + item.sender[0].avatar}`,
                            method: "GET",
                            headers: header,
                          }}
                          style={{
                            borderRadius: 50,
                            width: 32,
                            height: 32,
                          }}
                          onError={(error) => {
                            setErrorAvatarSender(true);
                          }}
                        />
                      )}
                      <View
                        style={{
                          backgroundColor: COLORS.infoDangerLight,
                          borderRadius: 30,
                          width: 43,
                          height: 24,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.infoDanger,
                            textAlign: "center",
                          }}
                        >
                          {item.prio}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
          </Fragment>
        ))}
      {result.results && result.results.length == 0 && (
        <View key="search" style={[styles.containerTodo, styles.noTodo]}>
          <Text style={styles.textNotFound}>
            Anda tidak memiliki {Config.labelTodo} {title}
          </Text>
        </View>
      )}
    </View>
  );
}

export default ListTodo;

const styles = StyleSheet.create({
  listAccordion: {
    height: 30,
    margin: 0,
    padding: 0,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  scroll: {
    // height: "30%",
  },
  scrollSearch: {
    // height: "60%",
  },
  containerTodo: {
    backgroundColor: COLORS.white,
    marginVertical: 10,
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    //shadow ios
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    //shadow android
    elevation: 2,
  },
  titleTodo: {
    fontSize: GlobalStyles.font.lg,
    fontWeight: "600",
  },
  descTodo: {
    fontSize: GlobalStyles.font.sm,
    color: GlobalStyles.colors.blue,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerAvatar: {
    flexDirection: "row",
  },
  avaReceiver: { marginLeft: 6 },
  noTodo: {
    justifyContent: "center",
    alignItems: "center",
  },
  textNotFound: {
    fontWeight: "bold",
    fontSize: 13,
  },
});
