import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import {} from "react-native-safe-area-context";
import { useSelector } from "react-redux";

function MyTabCuti({ props, navigation }) {
  const [tabItemIndex, setTabItemIndex] = useState(2);
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
            height:
              device === "tablet"
                ? 100
                : Platform.OS === "android"
                ? "14%"
                : 95,
          }}
        >
          <TouchableOpacity
            key={1}
            onPress={() => {
              setTabItemIndex(1);
              navigation.navigate("PersonalCuti", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 1 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 110 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 300 : 90,
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
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    textAlign: "center",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Personal
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 110 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 300 : 90,
                }}
              >
                <Ionicons
                  name="home-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    textAlign: "center",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Personal
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={2}
            onPress={() => {
              setTabItemIndex(2);
              navigation.navigate("PersetujuanCuti", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 2 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 110 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 300 : 90,
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
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    textAlign: "center",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Dokumen Persetujuan
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 110 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 300 : 90,
                }}
              >
                <Ionicons
                  name="briefcase-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    textAlign: "center",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Dokumen Persetujuan
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            key={3}
            onPress={() => {
              setTabItemIndex(3);
              navigation.navigate("DokumenCuti", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 3 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 110 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 300 : 90,
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
                  name="document-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    textAlign: "center",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Dokumen Personal
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 110 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 300 : 90,
                }}
              >
                <Ionicons
                  name="document-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    textAlign: "center",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Dokumen Personal
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
export default MyTabCuti;
