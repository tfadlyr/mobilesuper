import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setFAB } from "../../store/snackbar";
import { initDownload } from "../../utils/agenda";

//toolbar custom
export const toolbarBack = ({ navigation, title, route, options, back }) => {
  const dispatch = useDispatch();
  const { device } = useSelector((state) => state.apps);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        height: 80,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 20,
          width: 28,
          height: 28,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          style={{}}
          onPress={() => {
            if (
              route?.params?.title == "Lihat Surat" &&
              route?.params?.tipe == "in"
            ) {
              dispatch(setFAB(true));
            }
            navigation.goBack();
            if (route?.params?.stylus) {
              navigation.goBack();
            }
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
      <View
        style={[
          { flex: 1, alignItems: "center" },
          route?.params?.title == "Lihat Surat"
            ? { marginRight: 0 }
            : { marginRight: 50 },
        ]}
      >
        <Text
          style={{
            fontSize: fontSizeResponsive("H1", device),
            fontWeight: 600,
            color: COLORS.white,
            textAlign: "center",
          }}
        >
          {title ? title : route?.params?.title}
        </Text>
      </View>
      {route?.params?.title == "Lihat Surat" && !route?.params?.stylus && (
        <TouchableOpacity
          onPress={() => {
            initDownload(route?.params?.selected);
          }}
          style={{
            backgroundColor: COLORS.white,
            width: 30,
            height: 30,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 5,
            marginRight: 20,
            //shadow ios
            shadowOffset: { width: -2, height: 4 },
            shadowColor: "#171717",
            shadowOpacity: 0.2,
            //shadow android
            elevation: 2,
          }}
        >
          <Ionicons name="share-social" size={16} />
        </TouchableOpacity>
      )}
      {route?.params?.title == "Lihat Surat" && route?.params?.stylus && (
        <View style={{ width: 50 }}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.colors.primary,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  containerHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleHeader: {
    textAlign: "right",
    fontWeight: "500",
    fontSize: 16,
  },
  logoHeader: {
    height: 30,
    width: 60,
  },
});
