import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import {} from "react-native-safe-area-context";
import { useSelector } from "react-redux";

function MyTabPegawiIPASN({ props, navigation }) {
  const [tabItemIndex, setTabItemIndex] = useState(1);
  const { device } = useSelector((state) => state.apps);

  return (
    <>
      <BottomSheetModalProvider>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: COLORS.white,
            justifyContent: "space-around",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <TouchableOpacity
            key={1}
            onPress={() => {
              setTabItemIndex(1);
              navigation.navigate("PegawaiIPASN", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 1 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 140 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 200 : 100,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 3,
                    backgroundColor: COLORS.primary,
                    position: "absolute",
                    top: 0,
                    //shadow ios
                    shadowOffset: { width: -2, height: 5 },
                    shadowColor: COLORS.primary,
                    shadowOpacity: 0.4,
                    //shadow android
                    elevation: 2,
                  }}
                />
                <Ionicons
                  name="home-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 5 }}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H3", device),
                    position: "absolute",
                    bottom: device === "tablet" ? 52 : 40,
                  }}
                >
                  Data IPASN
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 140 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 200 : 100,
                }}
              >
                <Ionicons
                  name="home-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 5 }}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H3", device),
                    position: "absolute",
                    bottom: device === "tablet" ? 52 : 40,
                  }}
                >
                  Data IPASN
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={2}
            onPress={() => {
              setTabItemIndex(2);
              navigation.navigate("DataPribadi", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 2 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 140 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 150 : 90,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 3,
                    backgroundColor: COLORS.primary,
                    position: "absolute",
                    top: 0,
                    //shadow ios
                    shadowOffset: { width: -2, height: 5 },
                    shadowColor: COLORS.primary,
                    shadowOpacity: 0.4,
                    //shadow android
                    elevation: 2,
                  }}
                />
                <Ionicons
                  name="briefcase-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 5 }}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H3", device),
                    position: "absolute",
                    bottom: device === "tablet" ? 52 : 40,
                  }}
                >
                  Data Pribadi
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 140 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 150 : 90,
                }}
              >
                <Ionicons
                  name="briefcase-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 5 }}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H3", device),
                    position: "absolute",
                    bottom: device === "tablet" ? 52 : 40,
                  }}
                >
                  Data Pribadi
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </BottomSheetModalProvider>
    </>
  );
}

const styles = StyleSheet.create({});
export default MyTabPegawiIPASN;
