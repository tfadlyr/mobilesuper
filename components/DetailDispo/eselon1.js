import { ScrollView, StyleSheet, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { COLORS } from "../../config/SuperAppps";
import { Card, Text } from "react-native-paper";
import moment from "moment";
import { getTemplateHeaderDispo } from "../../utils/templateDispo";

export const detailEselonI = (data, checked, device) => {
  return (
    <ScrollView nestedScrollEnabled>
      <View style={styles.screen}>
        {getTemplateHeaderDispo(
          data?.sender?.type,
          data?.sender?.unker,
          data?.sender?.satker
        )}
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Sifat Surat
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data?.obj?.priority ? data?.obj?.priority : data?.obj?.prio}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Nomor Agenda
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data?.obj?.agenda_number}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Nomor Surat
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data?.obj?.ref_number}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Tingkat Keamanan
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data?.obj?.type}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Diterima Tanggal
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {moment(data?.created_date).format("D MMMM YYYY")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Tanggal Surat
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data?.obj?.letter_date}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Asal Surat
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data?.obj && data?.obj?.senders[0].title
                  ? data?.obj?.senders[0].title
                  : data?.obj?.senders[0].name}
              </Text>
            </View>
            <View style={{ flexDirection: "row", paddingTop: 10 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Hal
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data?.obj?.subject}
              </Text>
            </View>
          </View>
        </View>
        <Card style={styles.containerCard}>
          <View style={[styles.containerTitle, { paddingTop: 0 }]}>
            <Text style={styles.title}>Diteruskan kepada Yth.*</Text>
          </View>
          <View>
            <View>
              {/* tidak ada receiver config */}
              {checked?.receiverDispo?.length == 0 &&
                data?.receivers?.map((item, index) => (
                  <Text key={index}>
                    {index + 1}. {item}
                  </Text>
                ))}
              {/* ada receiver config */}
              {checked?.receiverDispo?.length != 0 &&
                checked?.receiverDispo?.map((item, index) => (
                  <Text key={index}>{item.name}</Text>
                ))}
            </View>
          </View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>Petunjuk</Text>
          </View>
          <View>
            <Text>
              {checked?.actionDispo?.length == 0 && data?.action
                ? data?.action
                : checked?.actionDispo?.map((item) => item.name).join("\n")}
            </Text>
          </View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>Catatan</Text>
          </View>
          <View>
            <Text>{data?.action_manual ? data?.action_manual : "-"}</Text>
          </View>
          {data?.attachments?.length != 0 && (
            <View>
              <View>
                <Text style={styles.title}>Attachments Disposisi</Text>
              </View>
              {data?.attachments?.length == 0 && <Text>-</Text>}
              {data?.attachments?.length != 0 &&
                data?.attachments?.map((item, index) => (
                  <View
                    key={item.id}
                    onPress={() => {
                      // showBottommSheet(item, getExtensionIcon(item));
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 12,
                        overflow: "hidden", // Ensure the WebView respects the border radius
                        height: device === "tablet" ? 300 : 200,
                        width: "100%",
                      }}
                    >
                      {/* <Text>{item?.truncate_name}</Text> */}
                      {/* <Text>{item?.size}</Text>
                        <Text>{item.file}</Text> */}
                      <WebView
                        originWhitelist={["*"]}
                        source={{
                          uri: newUrlNote,
                          headers: header,
                        }}
                        style={{
                          flex: 1,
                        }}
                        allowFileAccess={true}
                        androidLayerType={"software"}
                        mixedContentMode={"always"}
                        allowUniversalAccessFromFileURLs={true}
                        setDisplayZoomControls={true}
                        scalesPageToFit={false}
                        scrollEnabled={true}
                        onTouchStart={() => {
                          setCheckScroll(false);
                        }}
                        onTouchEnd={() => {
                          setCheckScroll(true);
                        }}
                      />
                    </View>
                  </View>
                ))}
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    backgroundColor: GlobalStyles.colors.tertiery20,
  },
  containerCard: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
    backgroundColor: GlobalStyles.colors.tertiery10,
  },
  containerTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
  },
  containerLabel: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "center",
  },
  title: {
    marginBottom: 6,
    fontSize: GlobalStyles.font.md,
  },
  titleLabel: {
    fontSize: GlobalStyles.font.md,
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  containerTindakanChecked: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: GlobalStyles.colors.textWhite,
    paddingHorizontal: 12,
  },
  containerTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  titleTodo: {
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  containerBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  switchLabel: {
    paddingLeft: 8,
  },
  titleLabelTodo: {
    marginBottom: 12,
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  dropdown: {
    height: 55,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: GlobalStyles.colors.black,
    paddingHorizontal: 12,
  },
  containerTanggalPrioritas: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  containerRemind: {
    flexDirection: "row",
  },
  title: {
    marginBottom: 6,
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  placeholderStyle: {
    fontSize: GlobalStyles.font.sm,
  },
  selectedTextStyle: {
    fontSize: GlobalStyles.font.sm,
  },
  labelRemind: {
    fontSize: GlobalStyles.font.sm,
    fontWeight: "bold",
  },
  labelCheckbox: {
    width: "95%",
    textAlign: "left",
    // fontSize: GlobalStyles.font.sm,
  },
  // });

  // const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  body: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});
