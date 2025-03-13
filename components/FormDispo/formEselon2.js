import { StyleSheet, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { COLORS } from "../../config/SuperAppps";
import { Text } from "react-native-paper";
import { getTemplateHeaderDispo } from "../../utils/templateDispo";
import moment from "moment";

export const formEselonII = (data, headerDispo) => {
  return (
    <View>
      {getTemplateHeaderDispo(
        headerDispo?.type,
        headerDispo?.unker,
        headerDispo?.satker
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
              Dari
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {data?.senders[0].title
                ? data?.senders[0].title
                : data?.senders[0].name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomWidth: 2,
              borderBottomColor: "#DBDADE",
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
              {data?.subject}
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
              No Agenda
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {data?.agenda_number}
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
              Tanggal Diterima
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {moment(new Date()).format("D MMMM YYYY")}
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
              {data?.ref_number}
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
              Tanggal
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {data?.letter_date}
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
              Lampiran
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {data?.attachmment?.length == 0 ? "-" : data?.attachment}
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
              Sifat
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {data?.priority ? data?.priority : data?.prio}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingTop: 10,
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
              Untuk
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {data?.attachmment?.length == 0 ? "-" : data?.attachment}
            </Text>
          </View>
        </View>
      </View>
    </View>
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
