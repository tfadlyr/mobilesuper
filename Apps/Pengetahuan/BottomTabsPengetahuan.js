import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
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

function MyTabBarPengetahuan({ props, navigation }) {
  const bottomSheetModalAddRef = useRef(null);
  const [tabItemIndex, setTabItemIndex] = useState(1);
  const { profile } = useSelector((state) => state.superApps);
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

  const roleIku = [
    "MP.PNL",
    "PNL.SES.BKIPMKHP",
    "PNL.SES.BRSDM",
    "PNL.SES.DJPB",
    "PNL.SES.DJPDSPKP",
    "PNL.SESDJPT",
    "PNL.SES.IJ",
    "PNL.SES.PSD",
    "PNL.SES.SEKJEN",
  ];
  const roleLaporanPenilaian = [
    "MP.PNL",
    "PNL.SES.BKIPMKHP",
    "PNL.SES.BRSDM",
    "PNL.SES.DJPB",
    "PNL.SES.DJPDSPKP",
    "PN.SES.DJPRL",
    "PNL.SES.DJPSDKP",
    "PNL.SES.DJPT",
    "PNL.SES.IJ",
    "PNL.SES.PSD",
    "PNL.SES.SEKJEN",
  ];

  const hasRequiredRoles = (userRoles, appRoles) => {
    return appRoles.some((role) => userRoles.includes(role));
  };

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
              navigation.navigate("LiniMasa", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 1 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  width: device === "tablet" ? 95 : 80,
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
                  name="school-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Linimasa
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  width: device === "tablet" ? 95 : 80,
                  paddingTop: 20,
                }}
              >
                <Ionicons
                  name="school-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Linimasa
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={2}
            onPress={() => {
              setTabItemIndex(2);
              navigation.navigate("PostinganSaya", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 2 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  paddingTop: 20,
                  width: device === "tablet" ? 200 : 70,
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
                  Postingan Saya
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 95,
                  paddingTop: 20,
                  width: device === "tablet" ? 200 : 70,
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
                  Postingan Saya
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {hasRequiredRoles(profile?.roles_access, roleIku) ? (
            <TouchableOpacity
              key={3}
              onPress={() => {
                setTabItemIndex(3);
                navigation.navigate("RangkumanIKU", { unread: false });
                // props.navigation.navigate('Home', { unread: false })
              }}
            >
              {tabItemIndex === 3 ? (
                <View
                  style={{
                    alignItems: "center",
                    height: device === "tablet" ? 100 : 95,
                    paddingTop: 20,
                    width: device === "tablet" ? 200 : 70,
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
                    name="document-text-outline"
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
                    Rangkuman IKU
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    height: device === "tablet" ? 100 : 95,
                    paddingTop: 20,
                    width: device === "tablet" ? 200 : 70,
                  }}
                >
                  <Ionicons
                    name="document-text-outline"
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
                    Rangkuman IKU
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : null}

          {hasRequiredRoles(profile?.roles_access, roleLaporanPenilaian) ? (
            <TouchableOpacity
              key={4}
              onPress={() => {
                setTabItemIndex(4);
                navigation.navigate("LaporanPengetahuan", { unread: false });
                // props.navigation.navigate('Home', { unread: false })
              }}
            >
              {tabItemIndex === 4 ? (
                <View
                  style={{
                    alignItems: "center",
                    height: device === "tablet" ? 100 : 95,
                    paddingTop: 20,
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
                    name="chatbubbles-outline"
                    color={COLORS.primary}
                    size={device === "tablet" ? 40 : 24}
                  />
                  <Text
                    style={{
                      color: COLORS.primary,
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
                    height: device === "tablet" ? 100 : 95,
                    paddingTop: 20,
                    width: device === "tablet" ? 150 : 80,
                  }}
                >
                  <Ionicons
                    name="chatbubbles-outline"
                    color={COLORS.tertiary}
                    size={device === "tablet" ? 40 : 24}
                  />
                  <Text
                    style={{
                      color: COLORS.tertiary,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Laporan
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : null}

          {hasRequiredRoles(profile?.roles_access, roleLaporanPenilaian) ? (
            <TouchableOpacity
              key={5}
              onPress={() => {
                setTabItemIndex(5);
                navigation.navigate("PenilaianPenggetahaun", { unread: false });
                // props.navigation.navigate('Home', { unread: false })
              }}
            >
              {tabItemIndex === 5 ? (
                <View
                  style={{
                    alignItems: "center",
                    height: device === "tablet" ? 100 : 95,
                    paddingTop: 20,
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
                    name="document-text-outline"
                    color={COLORS.primary}
                    size={device === "tablet" ? 40 : 24}
                  />
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Penilaian
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    height: device === "tablet" ? 100 : 95,
                    paddingTop: 20,
                    width: device === "tablet" ? 150 : 80,
                  }}
                >
                  <Ionicons
                    name="document-text-outline"
                    color={COLORS.tertiary}
                    size={device === "tablet" ? 40 : 24}
                  />
                  <Text
                    style={{
                      color: COLORS.tertiary,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Penilaian
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </BottomSheetModalProvider>
    </>
  );
}

const styles = StyleSheet.create({});
export default MyTabBarPengetahuan;
