import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { GlobalStyles } from "../constants/styles";

export const getTemplateHeaderDispo = (eselon, unker, satker) => {
  switch (eselon) {
    case "m":
    case "0":
      return HeaderMenteri;
    case "a":
    case "1":
      return HeaderEselonI(unker);
    case "b":
    case "c":
    case "2":
    case "3":
    case "4":
      return HeaderEselonII(unker, satker);
    case "L":
      return HeaderLPUMKP(unker);
    default:
      return "";
  }
};

export const HeaderMenteri = () => {
  return (
    <>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>MENTERI KELAUTAN DAN PERIKANAN</Text>
        <Text style={styles.title}>REPUBLIK INDONESIA</Text>
      </View>
    </>
  );
};

export const HeaderWamen = () => {
  return (
    <View style={styles.containerLabel}>
      <Text style={styles.title}>WAKIL MENTERI KELAUTAN DAN PERIKANAN</Text>
      <Text style={styles.title}>REPUBLIK INDONESIA</Text>
    </View>
  );
};

export const HeaderEselonI = (eselon_I) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>KEMENTERIAN KELAUTAN DAN PERIKANAN</Text>
      </View>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>{eselon_I}</Text>
      </View>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>LEMBAR DISPOSISI</Text>
      </View>
    </View>
  );
};

export const HeaderEselonII = (eselon_I, eselon_II) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>KEMENTERIAN KELAUTAN DAN PERIKANAN</Text>
      </View>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>{eselon_I}</Text>
      </View>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>{eselon_II}</Text>
      </View>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>LEMBAR DISPOSISI</Text>
      </View>
    </View>
  );
};

export const HeaderLPUMKP = (eselon_I) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>
          LEMBAGA PENGELOLA MODAL USAHA KELAUTAN PERIKANAN
        </Text>
      </View>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>{eselon_I}</Text>
      </View>
      <View style={styles.containerLabel}>
        <Text style={styles.title}>LEMBAR DISPOSISI</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerLabel: {
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: GlobalStyles.font.md,
  },
});
