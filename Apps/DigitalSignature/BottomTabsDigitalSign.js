import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  COLORS,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import {} from "react-native-safe-area-context";
import { useSelector } from "react-redux";

function MyTabDigitalSign({ props, navigation, route }) {
  const [tabItemIndex, setTabItemIndex] = useState(1);
  const { profile } = useSelector((state) => state.superApps);
  const { device } = useSelector((state) => state.apps);

  useEffect(() => {
    if (route?.params?.screen === "DokumenSK") {
      setTabItemIndex(4);
      navigation.navigate("DokumenSK", { route: route });
    } else if (route?.params?.screen === "DokumenLain") {
      setTabItemIndex(1);
      navigation.navigate("DokumenLain", { route: route });
    }
  }, []);

  const roleBankom = ["USER_BSRE"];
  const roleLaporan = ["LAPORAN_BSRE"];

  const hasRequiredRoles = (userRoles, appRoles) => {
    return appRoles.some((role) => userRoles?.includes(role));
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  return (
    <>
      <BottomSheetModalProvider>
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
          {/* {hasRequiredRoles(profile?.roles_access, roleBankom) ? ( */}
          {/* <TouchableOpacity
          key={1}
          onPress={() => {
            setTabItemIndex(1);
            navigation.navigate("Bankom", { unread: false });
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
                name="briefcase-outline"
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
                Bankom
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
                name="briefcase-outline"
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
                Bankom
              </Text>
            </View>
          )}
        </TouchableOpacity> */}
          {/* ) : null} */}

          <TouchableOpacity
            key={1}
            onPress={() => {
              setTabItemIndex(1);
              navigation.navigate("DokumenLain", { unread: false });
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
                <Ionicons
                  name="attach-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Dokumen Lain
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
                <Ionicons
                  name="attach-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Dokumen Lain
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* {hasRequiredRoles(profile?.roles_access, roleLaporan) ? (
          <TouchableOpacity
            key={3}
            onPress={() => {
              setTabItemIndex(3);
              navigation.navigate("LaporanDigitalSign", { unread: false });
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
                  name="chatbubbles-outline"
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
                  Laporan
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
                  name="chatbubbles-outline"
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
                  Laporan
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : null} */}

          <TouchableOpacity
            key={4}
            onPress={() => {
              setTabItemIndex(4);
              navigation.navigate("DokumenSK");
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
                  Dokumen SK
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
                  Dokumen SK
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* {hasRequiredRoles(profile?.roles_access, roleLaporan) ? ( */}
          <TouchableOpacity
            key={3}
            onPress={() => {
              setTabItemIndex(3);
              navigation.navigate("Verifikasi");
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
                <Ionicons
                  name="pencil-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Verifikasi
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
                <Ionicons
                  name="pencil-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Verifikasi
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* ) : null} */}
        </View>
      </BottomSheetModalProvider>
    </>
  );
}

const styles = StyleSheet.create({});
export default MyTabDigitalSign;
