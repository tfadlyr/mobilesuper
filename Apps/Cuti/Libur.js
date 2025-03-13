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
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../../components/Search";
import { useNavigation } from "@react-navigation/native";
import { getLiburKhusus, getTanggalLibur } from "../../service/api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { CardLiburTahunan } from "../../components/CardLiburTahunan";
import { Loading } from "../../components/Loading";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ListEmpty from "../../components/ListEmpty";
import { getTokenValue } from "../../service/session";

export const Libur = () => {
  const navigation = useNavigation();
  const [variant, SetVariant] = useState("");
  const dispatch = useDispatch();

  const [collapse, setCollapse] = useState({ toggle: false });
  const [collapseKhusus, setCollapseKhusus] = useState({ toggle: false });
  const { profile } = useSelector((state) => state.superApps);

  const [token, setToken] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getTanggalLibur(token));
      dispatch(getLiburKhusus(token));
    }
  }, [token]);

  const { liburKhusus, libur, loading } = useSelector((state) => state.cuti);

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
                width: 28,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
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
                Libur
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 15, gap: 30, marginBottom: 30 }}>
            <View style={{ paddingHorizontal: "5%" }}>
              {/* <View
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
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text>Libur Nasional Tahun ini</Text>
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
              </View> */}
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Libur Nasional Tahun ini
              </Text>
              <FlatList
                data={libur.data}
                renderItem={({ item }) => (
                  <View key={item.id}>
                    <CardLiburTahunan item={item} device={device} />
                  </View>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => <ListEmpty />}
              />
            </View>

            <View style={{ paddingHorizontal: "5%" }}>
              {/* <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 15,
                  borderRadius: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => setCollapseKhusus({ toggle: true })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text>Libur Khusus Tahun Ini</Text>
                    {collapseKhusus.toggle === true ? (
                      <TouchableOpacity
                        onPress={() => setCollapseKhusus({ toggle: false })}
                      >
                        <Ionicons name="chevron-up" size={24} />
                      </TouchableOpacity>
                    ) : (
                      <Ionicons name="chevron-down" size={24} />
                    )}
                  </View>
                </TouchableOpacity>

                {collapseKhusus.toggle === true ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => setCollapseKhusus({ toggle: false })}
                    >
                      
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View> */}

              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Libur Khusus Tahun Ini
              </Text>
              <FlatList
                data={liburKhusus.data}
                renderItem={({ item }) => (
                  <View key={item.id}>
                    <CardLiburTahunan item={item} device={device} />
                  </View>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => <ListEmpty />}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};
