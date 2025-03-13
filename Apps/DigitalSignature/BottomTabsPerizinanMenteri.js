import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import {} from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export const MyTabPerizinanMenteri = ({ route, navigation }) => {
  const [tabItemIndex, setTabItemIndex] = useState(3);
  const { profile } = useSelector((state) => state.superApps);
  const { device } = useSelector((state) => state.apps);

  const rolePerizinanDashboard = ["DASHBOARD_PERIZINAN_MENTERI"];

  const isRolePerizinanDashboard = profile.roles_access?.some((item) =>
    rolePerizinanDashboard.includes(item)
  );

  useEffect(() => {
    if (route?.params?.screen === "PKRL") {
      setTabItemIndex(3);
      navigation.navigate("PKRL", { route: route });
    } else if (route?.params?.screen === "ESEA") {
      setTabItemIndex(1);
      navigation.navigate("PerizinanMenteri");
    }
  }, []);

  return (
    <BottomSheetModalProvider>
      <>
        <View
          style={{
            flexDirection: "row",
            height:
              device === "tablet"
                ? 100
                : Platform.OS === "android"
                ? "12%"
                : 70,
            backgroundColor: COLORS.white,
            justifyContent: "space-around",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <TouchableOpacity
            key={3}
            onPress={() => {
              setTabItemIndex(3);
              navigation.navigate("PKRL");
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 3 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
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
                <FontAwesome6
                  name="file-signature"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  PKRL
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
                  justifyContent: "center",
                  width: device === "tablet" ? 200 : 100,
                }}
              >
                <FontAwesome6
                  name="file-signature"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  PKRL
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={1}
            onPress={() => {
              setTabItemIndex(1);
              navigation.navigate("PerizinanMenteri", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 1 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
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
                <FontAwesome6
                  name="file-contract"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  E-Sea
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
                  justifyContent: "center",
                  width: device === "tablet" ? 200 : 100,
                }}
              >
                <FontAwesome6
                  name="file-contract"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  E-Sea
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* {hasRequiredRoles(profile?.roles_access, roleLaporan) ? ( */}

          {isRolePerizinanDashboard === true ? (
            <TouchableOpacity
              key={4}
              onPress={() => {
                setTabItemIndex(4);
                navigation.navigate("DashboardPKRL");
                // props.navigation.navigate('Home', { unread: false })
              }}
            >
              {tabItemIndex === 4 ? (
                <View
                  style={{
                    alignItems: "center",
                    height: device === "tablet" ? 100 : 65,
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
                  <MaterialCommunityIcons
                    name="desktop-mac-dashboard"
                    color={COLORS.primary}
                    size={device === "tablet" ? 40 : 24}
                  />
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Dashboard PKRL
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    height: device === "tablet" ? 100 : 65,
                    justifyContent: "center",
                    width: device === "tablet" ? 200 : 100,
                  }}
                >
                  <MaterialCommunityIcons
                    name="desktop-mac-dashboard"
                    color={COLORS.primary}
                    size={device === "tablet" ? 40 : 24}
                  />
                  <Text
                    style={{
                      color: COLORS.tertiary,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Dashboard PKRL
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </>
    </BottomSheetModalProvider>
  );
};
