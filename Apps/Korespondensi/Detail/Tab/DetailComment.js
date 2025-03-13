import moment from "moment";
import { Platform, StyleSheet, Text, View, ScrollView } from "react-native";
import TreeView from "react-native-final-tree-view";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Avatar, Card, IconButton } from "react-native-paper";
import { GlobalStyles } from "../../../../constants/styles";
import { nde_api } from "../../../../utils/api.config";
import { useState } from "react";
import { Config } from "../../../../constants/config";

function DetailComment({ data }) {
  const [errorAvatar, setErrorAvatar] = useState(false);
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={{
          backgroundColor: GlobalStyles.colors.tertiery20,
        }}
        keyboardShouldPersistTaps={"handled"}
      >
        <View style={styles.screen}>
          <View style={styles.containerLabel}>
            <Text style={styles.titleLabel}>Komentar</Text>
          </View>
          {data?.komentar && (
            <TreeView
              style={{ backgroundColor: "red" }}
              childrenKey="submessage"
              data={data?.komentar} // defined above
              renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                const marginTree = { marginLeft: 25 * level };
                return (
                  <View
                  // style={{ flexDirection: "row" }}
                  // style={[
                  //   { flexDirection: "row" },
                  //   level == 0 && !hasChildrenNodes
                  //     ? { marginLeft: -25 }
                  //     : marginTree,
                  // ]}
                  >
                    {/* <IconButton
                        icon={getIndicator(isExpanded, hasChildrenNodes)}
                      /> */}
                    <Card key={node?.id} style={styles.containerCard}>
                      <View style={styles.headerCard}>
                        <View
                          style={[
                            node?.action == "Approve"
                              ? {
                                  backgroundColor:
                                    GlobalStyles.colors.success50,
                                }
                              : node?.action == "Return" ||
                                node?.action == "Return To Composer"
                              ? {
                                  backgroundColor:
                                    GlobalStyles.colors.warning50,
                                }
                              : {
                                  backgroundColor: GlobalStyles.colors.blue,
                                },
                            styles.header,
                            styles.badge,
                          ]}
                        >
                          <Text style={styles.badgeText}>{node?.action}</Text>
                        </View>

                        <IconButton
                          icon={node.is_mobile ? "cellphone" : "monitor"}
                          size={12}
                          style={styles.headerIsMobile}
                        />
                        <View style={styles.headerDate}>
                          <Text style={styles.badgeDate}>
                            {moment(node.created_date).format(
                              "DD MMM YYYY HH:mm"
                            )}
                          </Text>
                        </View>
                      </View>
                      <Card.Title
                        style={styles.containerCardTitle}
                        title={
                          <>
                            <Text style={styles.titleCard} numberOfLines={3}>
                              {node?.approver_title?.length != 0
                                ? node.approver_title
                                : node.creator}
                            </Text>
                            <Text>
                              {node?.approver_title?.length != 0
                                ? "\n" + node.creator
                                : ""}
                            </Text>
                          </>
                        }
                        titleNumberOfLines={5}
                        left={(props) => (
                          <View style={{ alignItems: "center", flex: 1 }}>
                            {errorAvatar && (
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
                            {!errorAvatar && (
                              <Avatar.Image
                                {...props}
                                source={{
                                  uri: `${
                                    nde_api.baseurl +
                                    "crsbe" +
                                    node?.avatar.slice(4, node?.avatar.length)
                                  }`,
                                  method: "GET",
                                }}
                                theme={{
                                  colors: {
                                    primary: GlobalStyles.colors.textWhite,
                                  },
                                }}
                                onError={() => setErrorAvatar(true)}
                              />
                            )}
                          </View>
                        )}
                      />
                      <View style={styles.containerMessage}>
                        <Text style={styles.textMessage}>
                          "{node?.message}"
                        </Text>
                      </View>

                      {/* <Button
                          // mode="flat"
                          style={[
                            styles.buttonReply,
                            { width: 75, padding: 0 },
                          ]}
                          onPress={() => {
                            handlerReplyButton(node.id);
                          }}
                        >
                          Reply
                        </Button>
                        {reply.find((obj) => obj.id === node.id)?.visible ? (
                          <TextInput
                            mode="outlined"
                            style={styles.inputContainerStyle}
                            multiline={true}
                            label="Comment"
                            value={commentArray[node.id]}
                            // onChangeText={(text) => onChangeText(node.id, text)}
                            theme={{
                              colors: {
                                primary: GlobalStyles.colors.textBlack,
                              },
                            }}
                            right={
                              <TextInput.Icon
                                icon="send"
                                color={GlobalStyles.colors.textWhite}
                                // onPress={(text) => {
                                //   sendMsg(id, node.id);
                                // }}
                              />
                            }
                          />
                        ) : null} */}
                    </Card>
                  </View>
                );
              }}
            />
          )}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
export default DetailComment;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalStyles.colors.tertiery20,
  },
  containerCard: {
    width: Platform.OS == "android" ? "100%" : "100%",
    marginBottom: 16,
    borderRadius: 6,
    backgroundColor: GlobalStyles.colors.tertiery10,
  },
  containerCardTitle: {
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 4,
    width: "45%",
  },
  headerIsMobile: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 0,
  },
  headerDate: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
    width: "40%",
  },
  badge: {
    borderTopLeftRadius: 6,
    borderBottomRightRadius: 6,
    alignItems: "center",
    height: "100%",
  },
  badgeText: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: GlobalStyles.font.md,
    color: GlobalStyles.colors.textWhite,
  },
  badgeDate: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: GlobalStyles.font.md,
    color: GlobalStyles.colors.textBlack,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  containerMessage: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  textMessage: {
    fontSize: GlobalStyles.font.lg,
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
  titleCard: {
    fontWeight: "bold",
    fontSize: GlobalStyles.font.lg,
  },
  inputContainerStyle: {
    justifyContent: "flex-start",
    // backgroundColor: GlobalStyles.colors.backgroundInput,
  },
});
