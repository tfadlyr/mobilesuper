import { Fragment, useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import TreeView from "react-native-final-tree-view";
import { Icon, IconButton, Text } from "react-native-paper";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import { getHTTP } from "../../../utils/http";

function TrackingLogDetail({ route, data }) {
  const [id, setId] = useState();
  const [log, setLog] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //getlogapi
    setId(route?.params?.id);
    getLogDispo();
  }, [data, route]);

  const getLogDispo = async () => {
    setIsLoading(true);
    try {
      if (route?.params?.trackinglog) {
        let response;
        response = await getHTTP(
          nde_api.agendadispotree?.replace(
            "{$id}",
            route?.params?.trackinglog?.split("/")[
              route?.params?.trackinglog?.split("/")?.length - 2
            ]
          )
        );
        setLog([response?.data]);
      }
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Peringatan!", "Aktivitas disposisi tidak berfungsi!");
      setIsLoading(false);
    }
  };
  function getIndicator(isExpanded, hasChildrenNodes) {
    if (!hasChildrenNodes) {
      return "";
    } else if (isExpanded) {
      return "chevron-down";
    } else {
      return "chevron-right";
    }
  }
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <ScrollView>
      {loadingOverlay}
      <View style={styles.screen}>
        <View style={styles.containerKet}>
          <Text style={{ fontWeight: "bold" }}>Keterangan:</Text>
          <View style={styles.ket}>
            <Icon
              source="square-rounded"
              size={25}
              color={GlobalStyles.colors.tertiery}
            />
            <Text>Puncak Pohon Disposisi</Text>
          </View>
          <View style={styles.ket}>
            <Icon
              source="square-rounded"
              size={25}
              color={GlobalStyles.colors.red}
            />
            <Text>Belum Semua Penerima Membaca</Text>
          </View>
          <View style={styles.ket}>
            <Icon
              source="square-rounded"
              size={25}
              color={GlobalStyles.colors.low}
            />
            <Text>Semua Penerima Sudah Membaca</Text>
          </View>
        </View>
        {log && (
          <TreeView
            childrenKey="children"
            data={log} // defined above
            initialExpanded
            renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
              const marginTree = { marginLeft: 15 * level };
              return (
                <Fragment key={node.type == "head" ? "head" : node.id}>
                  {(level == 0 || level != 0) && (
                    <View
                      style={[
                        { flexDirection: "row" },
                        level == 0 && !hasChildrenNodes
                          ? { marginLeft: -45 }
                          : marginTree,
                      ]}
                    >
                      <IconButton
                        icon={getIndicator(isExpanded, hasChildrenNodes)}
                      />
                      <View
                        style={[
                          node.color == "root"
                            ? {
                                borderColor: GlobalStyles.colors.tertiery,
                              }
                            : node.color == "danger"
                            ? {
                                borderColor: GlobalStyles.colors.red,
                              }
                            : node.color == "info"
                            ? {
                                borderColor: GlobalStyles.colors.low,
                              }
                            : {},
                          styles.containerCard,
                          {
                            backgroundColor: GlobalStyles.colors.textWhite,
                            marginLeft: -10,
                          },
                        ]}
                      >
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <Text style={{ fontSize: 14 }}>
                              {node.name?.split("(")[0]}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 13, fontWeight: 400 }}>
                            {"("}
                            {node.name?.split("(")[1]}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignItems: "flex-start",
                            marginTop: 12,
                          }}
                        >
                          <View
                            style={[
                              node.color == "root"
                                ? {
                                    backgroundColor:
                                      GlobalStyles.colors.tertiery,
                                  }
                                : node.color == "danger"
                                ? {
                                    backgroundColor: GlobalStyles.colors.red,
                                  }
                                : node.color == "info"
                                ? {
                                    backgroundColor: GlobalStyles.colors.low,
                                  }
                                : {},
                              styles.badgeTipeLetter,
                            ]}
                          >
                            <Text
                              style={{
                                color: GlobalStyles.colors.textWhite,
                                fontSize: 13,
                              }}
                            >
                              {node.title}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </Fragment>
              );
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}
export default TrackingLogDetail;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  containerKet: {
    backgroundColor: GlobalStyles.colors.disabled,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
  },
  ket: { flexDirection: "row", alignItems: "center" },
  containerCard: {
    width: Platform.OS == "android" ? "88%" : "93%",
    padding: 8,
    marginBottom: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  badgeTipeLetter: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    padding: 8,
  },
});
