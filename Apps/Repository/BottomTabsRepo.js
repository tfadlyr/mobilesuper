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
import {} from "react-native";
import { useSelector } from "react-redux";

function MyTabBarRepo({ props, navigation }) {
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
              navigation.navigate("Dokumen", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
            style={{ flex: 1 }}
          >
            {tabItemIndex === 1 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  paddingTop: 20,
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
                  name="list"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Dokumen
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  paddingTop: 20,
                }}
              >
                <Ionicons
                  name="list"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Dokumen
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={2}
            onPress={() => {
              setTabItemIndex(2);
              navigation.navigate("Dibagikan", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
            style={{ flex: 1 }}
          >
            {tabItemIndex === 2 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  paddingTop: 20,
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
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Dibagikan
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  paddingTop: 20,
                }}
              >
                <Ionicons
                  name="people-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Dibagikan
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={4}
            onPress={() => {
              setTabItemIndex(4);
              navigation.navigate("Tinjauan", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
            style={{ flex: 1 }}
          >
            {tabItemIndex === 4 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  paddingTop: 20,
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
                  name="documents-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Tinjauan
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  paddingTop: 20,
                }}
              >
                <Ionicons
                  name="documents-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Tinjauan
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={3}
            onPress={() => {
              setTabItemIndex(3);
              navigation.navigate("DokumenTamplate", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
            style={{ flex: 1 }}
          >
            {tabItemIndex === 3 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  paddingTop: 20,
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
                  name="documents-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Dokumen Template
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  paddingTop: 20,
                }}
              >
                <Ionicons
                  name="documents-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Dokumen Template
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
export default MyTabBarRepo;
