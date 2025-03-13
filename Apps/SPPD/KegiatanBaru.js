import React from "react";
import { useState } from "react";
import { TouchableOpacity, View, Image, FlatList } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import {
  COLORS,
  FONTSIZE,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../../components/Search";
import { useNavigation } from "@react-navigation/native";
import { getLiburKhusus, getTanggalLibur } from "../../service/api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { CardLiburTahunan } from "../../components/CardLiburTahunan";
import { Loading } from "../../components/Loading";
import { CardKegiatanTerbaru } from "../../components/CardKegitanTerbaru";
import ListEmpty from "../../components/ListEmpty";

export const KegiatanBaru = () => {
  const navigation = useNavigation();

  const [collapse, setCollapse] = useState({ toggle: false });

  const { dashboard, loading } = useSelector((state) => state.sppd);
  const { device } = useSelector((state) => state.apps);

  return (
    <GestureHandlerRootView>
      {loading ? <Loading /> : null}
      <View style={{ position: "relative" }}>
        <ScrollView>
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
                width: device === "tablet" ? 40 : 28,
                height: device === "tablet" ? 40 : 28,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20,
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
            <View style={{ alignItems: "center", flex: 1, marginRight: 50 }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H1", device),
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.white,
                }}
              >
                Kegiatan Terbaru
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 15, gap: 30, marginBottom: 30 }}>
            <FlatList
              data={dashboard.events}
              renderItem={({ item }) => (
                <View key={item.id}>
                  <CardKegiatanTerbaru item={item} device={device} />
                </View>
              )}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => <ListEmpty />}
            />

            {/* <View style={{ paddingHorizontal: 20 }}>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 15,
                  borderRadius: 8,
                }}
              >
                <TouchableOpacity onPress={() => setCollapse({ toggle: true })}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text>Kegiatan Terbaru</Text>
                    {collapse.toggle === true ? (
                      <TouchableOpacity
                        onPress={() => setCollapse({ toggle: false })}
                      >
                        <Ionicons name="chevron-up" size={24} />
                      </TouchableOpacity>
                    ) : (
                      <Ionicons name="chevron-down" size={24} />
                    )}
                  </View>
                </TouchableOpacity>

                {collapse.toggle === true ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => setCollapse({ toggle: false })}
                      style={{ gap: 20, marginTop: 20 }}
                    >
                      
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View> */}
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};
