import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fontSizeResponsive } from "../../config/SuperAppps";

export const CardKebijakan = ({
  subjek,
  bentuk,
  id_peraturan,
  item,
  route,
  nomor,
  tahun,
  device,
}) => {
  const navigation = useNavigation();
  const title = subjek;
  return (
    <View key={id_peraturan}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DetailDashboard", {
            data: item,
          })
        }
      >
        <View style={styles.card}>
          <Text
            numberOfLines={3}
            style={[
              styles.nama,
              { fontSize: fontSizeResponsive("H4", device) },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.deskripsi,
              { fontSize: fontSizeResponsive("H4", device) },
            ]}
          >
            No. {nomor} / {tahun}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nama: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
    // paddingHorizontal:20,
  },
  deskripsi: {
    color: "grey",
    fontSize: 15,
    fontWeight: "600",
    // paddingHorizontal:20,
    paddingTop: 10,
  },
  tanggal: {
    fontSize: 14,
    color: "grey",
  },
  card: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    width: "100%",
    // marginLeft: 20,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    //shadow ios
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    //shadow android
    elevation: 2,
    alignContent: "center",
  },
});
