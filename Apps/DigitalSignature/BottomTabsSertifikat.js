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
import { useNavigation } from "@react-navigation/native";

export const MyTabSertifikat = () => {
  const [tabItemIndex, setTabItemIndex] = useState(1);
  const { profile } = useSelector((state) => state.superApps);
  const { device } = useSelector((state) => state.apps);

  const roleBankom = ["USER_BSRE"];
  const roleLaporan = ["LAPORAN_BSRE"];

  const hasRequiredRoles = (userRoles, appRoles) => {
    return appRoles.some((role) => userRoles?.includes(role));
  };

  const navigation = useNavigation();

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
                : 80,
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
              navigation.navigate("Bankom", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            <View
              style={{
                alignItems: "center",
                height: device === "tablet" ? 100 : 65,
                justifyContent: "center",
                width: device === "tablet" ? 200 : 100,
              }}
            >
              {tabItemIndex === 1 && (
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
              )}
              <Ionicons
                name="attach-outline"
                color={tabItemIndex === 1 ? COLORS.primary : COLORS.tertiary}
                size={device === "tablet" ? 40 : 24}
              />
              <Text
                style={{
                  color: tabItemIndex === 1 ? COLORS.primary : COLORS.tertiary,

                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Sertifikat TTDE
              </Text>
            </View>
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

          {/* {hasRequiredRoles(profile?.roles_access, roleLaporan) ? ( */}
          <TouchableOpacity
            key={3}
            onPress={() => {
              setTabItemIndex(3);
              navigation.navigate("SertifikatLms");
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            <View
              style={{
                alignItems: "center",
                height: device === "tablet" ? 100 : 65,
                justifyContent: "center",
                width: device === "tablet" ? 200 : 100,
              }}
            >
              {tabItemIndex === 3 && (
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
              )}
              <Ionicons
                name="pencil-outline"
                color={tabItemIndex === 3 ? COLORS.primary : COLORS.tertiary}
                size={device === "tablet" ? 40 : 24}
              />
              <Text
                style={{
                  color: tabItemIndex === 3 ? COLORS.primary : COLORS.tertiary,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Sertifikat LMS
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            key={4}
            onPress={() => {
              setTabItemIndex(4);
              navigation.navigate("SertifikatEksternal");
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            <View
              style={{
                alignItems: "center",
                height: device === "tablet" ? 100 : 65,
                justifyContent: "center",
                width: device === "tablet" ? 200 : 100,
              }}
            >
              {tabItemIndex === 4 && (
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
              )}
              <Ionicons
                name="create-outline"
                color={tabItemIndex === 4 ? COLORS.primary : COLORS.tertiary}
                size={device === "tablet" ? 40 : 24}
              />
              <Text
                style={{
                  color: tabItemIndex === 4 ? COLORS.primary : COLORS.tertiary,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Sertifikat Eksternal
              </Text>
            </View>
          </TouchableOpacity>
          {/* ) : null} */}
        </View>
      </BottomSheetModalProvider>
    </>
  );
};
