import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {} from "react-native";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

function MyTabBarSPPD({ state, descriptors, navigation }) {
  const [tabItemIndex, setTabItemIndex] = useState(0);
  const bottomSheetModalAddRef = useRef(null);
  const { device } = useSelector((state) => state.apps);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAdd = () => {
    bottomSheetModalAddRef.current?.present();
  };

  useEffect(() => {
    setTabItemIndex(state.index);
    console.log(state.index);
  }, [state.index]);

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
              setTabItemIndex(0);
              navigation.navigate("Personal", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 0 ? (
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
                  name="school-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 5 }}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    position: "absolute",
                    bottom: device === "tablet" ? 40 : 40,
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
                  height: device === "tablet" ? 120 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 95 : 80,
                }}
              >
                <Ionicons
                  name="school-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 5 }}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    position: "absolute",
                    bottom: device === "tablet" ? 40 : 40,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Personal
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={1}
            onPress={() => {
              setTabItemIndex(1);
              navigation.navigate("DokumenSPPD", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 1 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 120 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 150 : 80,
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
                    textAlign: "center",
                    fontSize: fontSizeResponsive("H3", device),
                    position: "absolute",
                    bottom: device === "tablet" ? 20 : 24,
                  }}
                >
                  Dokumen SPPD
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 120 : 95,
                  justifyContent: "center",
                  width: device === "tablet" ? 150 : 80,
                }}
              >
                <Ionicons
                  name="home-outline"
                  color={COLORS.grey}
                  size={device === "tablet" ? 40 : 24}
                  style={{ position: "absolute", top: 5 }}
                />
                <Text
                  style={{
                    color: COLORS.grey,
                    textAlign: "center",
                    fontSize: fontSizeResponsive("H3", device),
                    position: "absolute",
                    bottom: device === "tablet" ? 20 : 24,
                  }}
                >
                  Dokumen SPPD
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
export default MyTabBarSPPD;
