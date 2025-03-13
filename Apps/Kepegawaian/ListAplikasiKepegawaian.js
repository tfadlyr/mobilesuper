import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CardlistSubMenu } from "../../components/CardListSubMenu";

export const ListAplikasiKepegawaian = ({ route }) => {
  const items = route.params;
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);
  const { profile } = useSelector((state) => state.superApps);
  const [menuBankom, setMenuBankom] = useState([]);
  const [menuKepegawaian, setMenuKepegawaian] = useState([]);
  const [modalInfo, setModalInfo] = useState(false);

  const roleLaporan = ["LAPORAN_BSRE"];
  const isRoleLaporan = profile?.roles_access?.some((item) =>
    roleLaporan.includes(item)
  );
  useEffect(() => {
    let tmpMenu = [];
    let tmpMenuKepegawaian = [];
    tmpMenu.push(
      {
        title: "Pengetahuan",
        navigation: "MainPengetahuan",
      },
      {
        title: "Aksi Perubahan",
        navigation: "AksiPerubahan",
      },
      {
        title: "Sertifikat",
        navigation: "MainSertifikat",
      },
      {
        title: "e-Learning",
        navigation: "e-Learning",
      }
      // {
      //   title: "Info",
      //   navigation: "Info",
      // }
    );
    if (isRoleLaporan) {
      tmpMenu.splice(3, 0, {
        title: "Laporan",
        navigation: "LaporanDigitalSign",
      });
    } else {
      console.log("masuk role else", isRoleLaporan);
      null;
    }

    tmpMenuKepegawaian.push(
      {
        title: "IPASN",
        navigation: "MainIPASN",
      },
      {
        title: "Pegawai",
        navigation: "DataPribadi",
      },
      {
        title: "Nominatif Pegawai",
        navigation: "Nominatif",
      }
    );
    setMenuKepegawaian(tmpMenuKepegawaian);
    setMenuBankom(tmpMenu);
  }, [profile]);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.primary,
          height: 80,
          position: "relative",
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            width: device === "tablet" ? 40 : 28,
            height: device === "tablet" ? 40 : 28,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: 20,
            zIndex: 99,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
              textAlign: "center",
              width: "70%",
            }}
          >
            List Aplikasi {items}
          </Text>
        </View>
      </View>

      <FlatList
        data={
          items === "Pengembangan Kompetensi" ? menuBankom : menuKepegawaian
        }
        renderItem={({ item }) => (
          <CardlistSubMenu
            item={item}
            device={device}
            setModalInfo={setModalInfo}
            isRoleLaporan={isRoleLaporan}
          />
        )}
        style={{ height: 600 }}
        keyExtractor={(item) => item.title}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalInfo}
        onRequestClose={() => {
          setModalInfo(false);
        }}
      >
        <TouchableOpacity
          style={[
            Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
            styles.backdrop,
          ]}
        />
        <View
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "90%",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderBottomWidth: 2,
                borderBottomColor: COLORS.grey,
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                }}
              >
                Informasi
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalInfo(false);
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={COLORS.lighter}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
            >
              <Text style={{ textAlign: "justify" }}>
                Menu ini merupakan implementasi dari Aksi Perubahan New
                Integrated Learning and Office System (NILAM) pada Portal
                Collaboration Office.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.32,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
