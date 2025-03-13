import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import {} from "react-native";
import { useSelector } from "react-redux";

function MyTabDetailAgenda({ props, navigation }) {
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
              navigation.navigate("DetailAgenda", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 1 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 120 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 95 : 80,
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
                  name="information-circle-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 10 }}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H3", device),
                    position:"absolute",
                    bottom: device === "tablet" ? 40 : 40,
                  }}
                >
                  Detail
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 120 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 95 : 80,
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 10 }}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H3", device),
                    position:"absolute",
                    bottom: device === "tablet" ? 40 : 40,
                  }}
                >
                  Detail
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={2}
            onPress={() => {
              setTabItemIndex(2);
              navigation.navigate("Todo", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 2 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 120 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 95 : 80,
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
                  name="reorder-four-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 10 }}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H3", device),
                    position:"absolute",
                    bottom: device === "tablet" ? 40 : 40,
                  }}
                >
                  Todo
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 120 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 95 : 80,
                }}
              >
                <Ionicons
                  name="reorder-four-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 10 }}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H3", device),
                    position:"absolute",
                    bottom: device === "tablet" ? 40 : 40,
                  }}
                >
                  Todo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={3}
            onPress={() => {
              setTabItemIndex(3);
              navigation.navigate("Absen", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 3 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 120 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 95 : 80,
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
                  name="people-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 10 }}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H3", device),
                    position:"absolute",
                    bottom: device === "tablet" ? 40 : 40,
                  }}
                >
                  Absen
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 120 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 95 : 80,
                }}
              >
                <Ionicons
                  name="people-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 10 }}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H3", device),
                    position:"absolute",
                    bottom: device === "tablet" ? 40 : 40,
                  }}
                >
                  Absen
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
export default MyTabDetailAgenda;
