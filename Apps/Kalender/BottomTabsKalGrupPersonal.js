import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
import { useSelector } from "react-redux";

function MyTabBarGrupKal({ props, navigation }) {
  const [tabItemIndex, setTabItemIndex] = useState(1);
  const bottomSheetModalAddRef = useRef(null);

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

  const { device } = useSelector((state) => state.apps);

  return (
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
            navigation.navigate("GrupKalender", { unread: false });
            // props.navigation.navigate('Home', { unread: false })
          }}
        >
          {tabItemIndex === 1 ? (
            <View
              style={{
                alignItems: "center",
                height: device === "tablet" ? 100 : 60,
                justifyContent: "center",
                width: device === "tablet" ? 95 : 100,
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
                name="calendar-outline"
                color={COLORS.primary}
                size={device === "tablet" ? 40 : 24}
              />
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Kalender
              </Text>
            </View>
          ) : (
            <View
              style={{
                alignItems: "center",
                height: device === "tablet" ? 100 : 60,
                justifyContent: "center",
                width: device === "tablet" ? 95 : 100,
              }}
            >
              <Ionicons
                name="calendar-outline"
                color={COLORS.tertiary}
                size={device === "tablet" ? 40 : 24}
              />
              <Text
                style={{
                  color: COLORS.tertiary,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Kalender
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* <TouchableOpacity
                        key={3}
                        onPress={() => {
                            setTabItemIndex(3)
                            bottomSheetAdd()
                            // props.navigation.navigate('Home', { unread: false })
                        }}
                        style={{
                            top: -35,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                        }}>
                        <View style={{
                            backgroundColor: COLORS.white,
                            height: 70,
                            width: 70,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 50
                        }}>
                            <View style={{
                                backgroundColor: COLORS.primary,
                                width: 51,
                                height: 51,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 50
                            }}>
                                <Ionicons name='add-outline' color={COLORS.white} size={24} />
                            </View>
                        </View>
                    </TouchableOpacity> */}
        {/* <BottomSheetModal
                        ref={bottomSheetModalAddRef}
                        snapPoints={animatedSnapPoints}
                        handleHeight={animatedHandleHeight}
                        contentHeight={animatedContentHeight}
                        index={0}
                        style={{ borderRadius: 50 }}
                        keyboardBlurBehavior="restore"
                        android_keyboardInputMode="adjust"
                        backdropComponent={({ style }) => (
                            <View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
                        )}
                    >
                        <BottomSheetView onLayout={handleContentLayout} >
                            <View style={{ marginHorizontal: 20, backgroundColor: COLORS.infoDanger, height: 60, marginTop: 40, borderRadius: 8 }}>
                                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                    <Text style={{ color: COLORS.white, fontWeight: FONTWEIGHT.bold }}>Tambah Agenda</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginHorizontal: 20, backgroundColor: COLORS.infoDanger, height: 60, marginTop: 10, borderRadius: 8 }}>
                                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                    <Text style={{ color: COLORS.white, fontWeight: FONTWEIGHT.bold }}>Tambah Task</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginHorizontal: 20, backgroundColor: COLORS.infoDanger, height: 60, marginTop: 10, borderRadius: 8 }}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                                    onPress={() => {
                                        navigation.navigate('TambahGrup', { unread: false })
                                        // props.navigation.navigate('Home', { unread: false })
                                    }}
                                >
                                    <Text style={{ color: COLORS.white, fontWeight: FONTWEIGHT.bold }}>Tambah Grup</Text>
                                </TouchableOpacity>
                            </View>
                        </BottomSheetView>
                    </BottomSheetModal> */}

        <TouchableOpacity
          key={2}
          onPress={() => {
            setTabItemIndex(2);
            navigation.navigate("KalenderPersonal", { unread: false });
            // navigation.navigate("Agenda", { unread: false });
            // props.navigation.navigate('Home', { unread: false })
          }}
          style={{ alignItems: "center" }}
        >
          {tabItemIndex === 2 ? (
            <View
              style={{
                alignItems: "center",
                height: device === "tablet" ? 100 : 60,
                justifyContent: "center",
                width: device === "tablet" ? 200 : 120,
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
                name="calendar-clear"
                color={COLORS.primary}
                size={device === "tablet" ? 40 : 24}
              />
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Kalender Personal
              </Text>
            </View>
          ) : (
            <View
              style={{
                alignItems: "center",
                height: device === "tablet" ? 100 : 60,
                justifyContent: "center",
                width: device === "tablet" ? 200 : 120,
              }}
            >
              <Ionicons
                name="calendar-clear"
                color={COLORS.tertiary}
                size={device === "tablet" ? 40 : 24}
              />
              <Text
                style={{
                  color: COLORS.tertiary,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Kalender Personal
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({});
export default MyTabBarGrupKal;
