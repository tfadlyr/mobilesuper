import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native";
import {
  Avatar,
  Card,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  List,
  TextInput,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/UI/Button";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, postHTTP } from "../../../utils/http";
import TreeView from "react-native-final-tree-view";
import { logout } from "../../../store/auth";
import { Config } from "../../../constants/config";
import * as Sentry from "@sentry/react-native";

function TodoDetail({ route }) {
  const [errorAvatarSender, setErrorAvatarSender] = useState(false);
  const [errorAvatarReceiver, setErrorAvatarReceiver] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const [isLoading, setIsLoading] = useState(true);
  const [mark, setMark] = useState(false);
  const navigation = useNavigation();
  const [detail, setDetail] = useState([]);
  let id = route.params.id;
  let commentArray = [];
  let replyArray = [];
  const [reply, setReply] = useState(replyArray);
  const dispatch = useDispatch();
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  const willFocusSubscription = navigation.addListener("focus", () => {
    getDetail();
  });

  useEffect(() => {
    getDetail();
    return willFocusSubscription;
  }, []);

  async function getDetail() {
    setIsLoading(true);
    try {
      //get detail
      const response = await getHTTP(nde_api.todobyid.replace("{$id}", id));
      if (response?.data?.status == "Error") {
        Alert.alert("Peringatan!", response.data.msg);
      } else {
        setDetail(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response.status === 401) {
        Sentry.captureEvent(error?.response);
        dispatch(logout);
      } else {
        Sentry.captureEvent(error?.response);
        Alert.alert("Warning!", Config.labelTodo + " Detail not working!");
      }
    }
    setIsLoading(false);
  }
  async function sendMsg(id, idParent) {
    setIsLoading(true);
    try {
      let data;
      if (
        (commentArray[id]?.length == 0 || commentArray[id] == undefined) &&
        (commentArray[idParent]?.length == 0 ||
          commentArray[idParent]?.length == undefined)
      ) {
        // validasi
        Alert.alert("Warning!", "Please fill in The Comment");
      } else {
        if (idParent == "" || idParent == undefined) {
          let prefix;
          if (mark) {
            //jika terceklis mark as complete
            data = { mark: mark, message: commentArray[id] };
            prefix = "Telah selesai ";
          } else {
            //jika tidak terceklis mark as complete
            data = { message: commentArray[id] };
            prefix = "Komentar ";
          }
          const response = await postHTTP(
            nde_api.todomarkcomplete.replace("{$id}", id),
            data
          );
          if (response.data.status == "Success") {
            commentArray[id] = "";
            getDetail();
            Alert.alert("Berhasil!", prefix + Config.labelTodo + " berhasil!");
            if (mark) navigation.goBack();
          } else {
            Alert.alert(
              "Peringatan!",
              prefix + Config.labelTodo + " tidak berfungsi!"
            );
          }
          setIsLoading(false);
        } else {
          //jika komen todo reply
          data = { message: commentArray[idParent], parent: idParent };
          let response = await postHTTP(
            nde_api.todomarkcomplete.replace("{$id}", id),
            data
          );
          if (response.data.status == "Success") {
            commentArray[id] = "";
            getDetail();
            Alert.alert(
              "Berhasil!",
              "Komentar " + Config.labelTodo + " berhasil!"
            );
          } else {
            Alert.alert(
              "Peringatan!",
              "Komentar " + Config.labelTodo + " tidak berfungsi!"
            );
          }
          setIsLoading(false);
        }
      }
    } catch (error) {
      Alert.alert("Peringatan!", "Telah selesai tidak berfungsi!");
    }
    setIsLoading(false);
  }
  function handlerMark() {
    setMark(!mark);
  }
  function onChangeText(id, text) {
    commentArray[id] = text;
  }
  function handlerReplyButton(id) {
    //menampilkan textinput comment dengan tekan tombol reply
    const temp = [...reply];
    let index = temp.find((item) => item.id === id);
    if (index == undefined) {
      //jika belum pernah tekan reply
      setReply((prev) => [...prev, { id: id, visible: true }]);
    } else {
      //jika sudah pernah tekan reply
      index.visible = !index.visible;
      setReply(temp);
    }
  }

  function getIndicator(isExpanded, hasChildrenNodes) {
    if (!hasChildrenNodes) {
      return "";
    } else if (isExpanded) {
      return "chevron-down";
    } else {
      return "chevron-right";
    }
  }
  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior="position">
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <View style={styles.screen}>
          {loadingOverlay}
          <View style={{ marginBottom: 8 }}>
            <Text>Dibuat oleh</Text>
          </View>
          <Card style={styles.containerCard}>
            <Card.Title
              style={styles.containerCardTitle}
              title={
                <Text style={styles.title}>
                  {detail?.sender && detail?.sender[0]?.name}
                </Text>
              }
              titleNumberOfLines={5}
              subtitleNumberOfLines={5}
              left={(props) => (
                <View>
                  {errorAvatarSender && (
                    <Avatar.Image
                      {...props}
                      source={Config.avatar}
                      theme={{
                        colors: {
                          primary: GlobalStyles.colors.textWhite,
                        },
                      }}
                    />
                  )}
                  {!errorAvatarSender && detail?.sender && (
                    <Avatar.Image
                      {...props}
                      source={{
                        uri: `${nde_api.baseurl + detail?.sender[0]?.avatar}`,
                        method: "GET",
                      }}
                      onError={(e) => setErrorAvatarSender(true)}
                      theme={{
                        colors: {
                          primary: GlobalStyles.colors.textWhite,
                        },
                      }}
                    />
                  )}
                </View>
              )}
            />
          </Card>

          <View style={{ marginBottom: 8 }}>
            <Text>Diteruskan Kepada</Text>
          </View>
          <Card style={styles.containerCard}>
            {detail &&
              detail.receiver?.map((item, index) => (
                <Card.Title
                  key={index}
                  style={styles.containerCardTitle}
                  title={
                    <Text style={styles.title}>
                      {item.name ? item.name : ""}
                    </Text>
                  }
                  titleNumberOfLines={5}
                  subtitleNumberOfLines={5}
                  left={(props) => (
                    <View>
                      {errorAvatarReceiver && (
                        <Avatar.Image
                          {...props}
                          source={Config.avatar}
                          theme={{
                            colors: {
                              primary: GlobalStyles.colors.textWhite,
                            },
                          }}
                        />
                      )}
                      {!errorAvatarReceiver && (
                        <Avatar.Image
                          {...props}
                          source={{
                            uri: `${nde_api.baseurl + item.avatar}`,
                            method: "GET",
                          }}
                          onError={(e) => setErrorAvatarReceiver(true)}
                          theme={{
                            colors: {
                              primary: GlobalStyles.colors.textWhite,
                            },
                          }}
                        />
                      )}
                    </View>
                  )}
                />
              ))}
          </Card>
          <Card style={styles.containerCard}>
            <View style={[styles.headerCard, styles.rowBetween]}>
              <View style={styles.wrap}>
                <Text style={{ color: GlobalStyles.colors.textWhite }}>
                  Tenggat waktu: {detail.duedate}
                </Text>
              </View>
              <Chip
                compact={true}
                style={[
                  detail.priority == "nr"
                    ? {
                        backgroundColor: GlobalStyles.colors.tertiery,
                      }
                    : detail.priority == "lo"
                    ? { backgroundColor: GlobalStyles.colors.blue }
                    : detail.priority == "hi"
                    ? {
                        backgroundColor: GlobalStyles.colors.error500,
                      }
                    : { backgroundColor: GlobalStyles.colors.yellow },
                  styles.wrap,
                ]}
                textStyle={{ color: GlobalStyles.colors.textWhite }}
              >
                {detail.priority == "nr"
                  ? "Normal"
                  : detail.priority == "lo"
                  ? "Low"
                  : detail.priority == "hi"
                  ? "High"
                  : ""}
              </Chip>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.title}>{detail.subject}</Text>
            </View>
            <View style={[styles.tindakan, styles.wrap]}>
              <Text>{detail.description}</Text>
            </View>
            <View style={styles.wrap}>
              <Button
                style={styles.button}
                onPress={() => {
                  navigation.navigate("DispositionDetail", {
                    id: detail.disposition,
                    title: "Detail Disposisi",
                    hideFormDispo: true,
                  });
                }}
              >
                Lihat Dokumen
              </Button>
            </View>
            {detail?.sender && detail?.sender[0]?.name == profile?.fullname && (
              <View style={styles.section}>
                <Checkbox.Item
                  mode="android"
                  label="Telah selesai"
                  status={mark ? "checked" : "unchecked"}
                  color={GlobalStyles.colors.tertiery}
                  onPress={handlerMark}
                  position="leading"
                  labelStyle={styles.labelCheckbox}
                />
              </View>
            )}
            <View style={styles.wrap}>
              <TextInput
                mode="outlined"
                style={styles.inputContainerStyle}
                multiline={true}
                label="Komentar"
                value={commentArray[id]}
                onChangeText={(text) => onChangeText(id, text)}
                theme={{
                  colors: { primary: GlobalStyles.colors.textBlack },
                  roundness: 12,
                }}
                right={
                  <TextInput.Icon
                    icon="send"
                    onPress={() => {
                      sendMsg(id);
                    }}
                  />
                }
                allowFontScaling={false}
              />
            </View>
            <View style={styles.wrap}>
              <Text>Komentar</Text>
              {detail?.message && (
                <TreeView
                  childrenKey="submessage"
                  data={detail?.message} // defined above
                  renderNode={({
                    node,
                    level,
                    isExpanded,
                    hasChildrenNodes,
                  }) => {
                    const marginTree = {
                      marginLeft: 25 * level,
                    };
                    return (
                      <>
                        <List.Item
                          title={() => (
                            <>
                              <View style={styles.rowBetween}>
                                <Text style={styles.title}>{node.creator}</Text>
                                <IconButton
                                  icon={
                                    node.is_mobile ? "cellphone" : "monitor"
                                  }
                                  size={16}
                                />
                              </View>
                              <View style={styles.section}>
                                <IconButton
                                  icon="timer-outline"
                                  size={16}
                                  style={{ margin: 0 }}
                                />
                                <Text>{node?.created_date?.substr(0, 16)}</Text>
                              </View>
                            </>
                          )}
                          description={() => (
                            <>
                              <Text>
                                {node?.message?.replace(/<br\/>/g, "\n")}
                              </Text>
                              <Button
                                // mode="flat"
                                style={[
                                  styles.buttonReply,
                                  { width: 75, padding: 0 },
                                ]}
                                onPress={() => {
                                  handlerReplyButton(node.id);
                                }}
                              >
                                Balas
                              </Button>
                              {reply.find((obj) => obj.id === node.id)
                                ?.visible ? (
                                <TextInput
                                  mode="outlined"
                                  style={styles.inputContainerStyle}
                                  multiline={true}
                                  label="Komentar"
                                  value={commentArray[node.id]}
                                  onChangeText={(text) =>
                                    onChangeText(node.id, text)
                                  }
                                  theme={{
                                    colors: {
                                      primary: GlobalStyles.colors.textBlack,
                                    },
                                    roundness: 12,
                                  }}
                                  right={
                                    <TextInput.Icon
                                      icon="send"
                                      onPress={(text) => {
                                        sendMsg(id, node.id);
                                      }}
                                    />
                                  }
                                  allowFontScaling={false}
                                />
                              ) : null}
                            </>
                          )}
                          left={(props) => (
                            <List.Icon
                              {...props}
                              icon={getIndicator(isExpanded, hasChildrenNodes)}
                              style={{ width: 20 }}
                            />
                          )}
                          style={
                            level == 0 && !hasChildrenNodes
                              ? { marginLeft: -25 }
                              : marginTree
                          }
                        />
                        <Divider bold style={marginTree} />
                      </>
                    );
                  }}
                />
              )}
              {detail?.message?.length == 0 && (
                <List.Item description="Tidak ada komentar" />
              )}
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export default TodoDetail;

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  containerCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  containerCardTitle: {
    padding: 16,
    alignItems: "center",
  },
  keyboard: {
    flex: 1,
    width: "100%",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerCard: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 8,
    backgroundColor: GlobalStyles.colors.grey,
  },
  wrap: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  tindakan: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderRadius: 12,
    padding: 8,
    backgroundColor: GlobalStyles.colors.greylight,
  },
  button: {
    borderRadius: 12,
    backgroundColor: GlobalStyles.colors.tertiery,
  },
  buttonReply: {
    borderRadius: 12,
    backgroundColor: GlobalStyles.colors.tertiery,
  },
  textInput: {
    borderradius: 12,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelCheckbox: {
    fontSize: GlobalStyles.font.md,
  },
  inputContainerStyle: {
    justifyContent: "flex-start",
    // backgroundColor: GlobalStyles.colors.backgroundInput,
  },
});
