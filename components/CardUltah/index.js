import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { FlatList } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import moment from "moment/min/moment-with-locales";
import "moment/locale/id";
moment.locale("id");

const CardLiniMasaSatker = ({ no, nama, nama_jabatan }) => {
  return (
    <View style={{ flexDirection: "row", marginVertical: 20 }}>
      <View style={styles.cardNo}>
        <Text
          style={{
            fontSize: FONTSIZE.H2,
            fontWeight: FONTWEIGHT.bold,
            color: COLORS.white,
          }}
        >
          {no + 1}
        </Text>
      </View>
      <View style={{ marginLeft: 20, flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: FONTSIZE.H2,
            fontWeight: FONTWEIGHT.bold,
            color: COLORS.white,
          }}
        >
          {nama}
        </Text>
        <Text style={{ color: COLORS.white }}>{nama_jabatan}</Text>
      </View>
    </View>
  );
};

export const CardUltah = ({ ultah, device }) => {
  const navigation = useNavigation();
  const [visibleModalPeserta, setVisibleModalPeserta] = useState(false);

  const bottomSheetModalRef = useRef(null);
  const initialSnapPoints = useMemo(() => ["95%"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            alignItems: "center",
            gap: 7,
            justifyContent: "center",
            flex: 1,
            marginVertical: 20,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              width: 50,
              height: 50,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{}}
              source={require("../../assets/superApp/cake_24.png")}
            />
          </View>
          <Text
            style={{
              textAlign: "center",
              color: COLORS.white,
              fontWeight: FONTWEIGHT.bold,
              fontSize: fontSizeResponsive("H1", device),
            }}
          >
            Ulang Tahun{" "}
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: COLORS.white,
              fontSize: fontSizeResponsive("H1", device),
            }}
          >
            pada Bulan {moment(ultah.date_birth).locale("id").format("MMMM")}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Divider
            bold
            style={{ width: "80%", backgroundColor: COLORS.white }}
          />
        </View>
        <View style={{}}>
          <View style={{ alignItems: "center", paddingVertical: 15 }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.white,
                padding: 10,
                width: "80%",
                borderRadius: 8,
              }}
              onPress={() => bottomSheetAttach()}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Tinjau Siapa Saja
              </Text>
            </TouchableOpacity>
          </View>

          {/* <ScrollView>
                        {
                            ultah.map((item, index) => (
                                <View key={index}>
                                    <CardLiniMasaSatker
                                        no={index}
                                        nama={item.nama}
                                        nama_jabatan={item.nama_jabatan}
                                    />
                                </View>
                            ))
                        }
                    </ScrollView> */}

          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={animatedSnapPoints}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}
            index={0}
            style={{ borderRadius: 50 }}
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjust"
            backdropComponent={({ style }) => (
              <View
                style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
              />
            )}
          >
            <BottomSheetView onLayout={handleContentLayout}>
              <View style={{ marginTop: 20, marginBottom: 40 }}>
                <View
                  style={{
                    marginBottom: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H2", device),
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.lighter,
                    }}
                  >
                    Ulang Tahun saat ini
                  </Text>
                </View>
                <View>
                  <FlatList
                    data={ultah}
                    renderItem={({ item, index }) => (
                      <View
                        style={{
                          width: "90%",
                          borderRadius: 8,
                          marginHorizontal: 20,
                          marginTop: 10,
                          flexDirection: "column",
                        }}
                      >
                        <View
                          key={index}
                          style={{ flexDirection: "row", gap: 10 }}
                        >
                          <View style={{}}>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {index + 1}.
                            </Text>
                          </View>
                          <View style={{ width: "90%" }}>
                            <Text
                              style={{
                                fontWeight: FONTWEIGHT.bold,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {item.nama}
                            </Text>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {item.nama_jabatan}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                </View>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.info,
    flexDirection: "column",
    width: "100%",
    // marginHorizontal: 20,
    borderRadius: 16,
    alignSelf: "center",
  },
  profile: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    left: 16,
  },
  cardApps: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  cardNo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginLeft: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
