import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { CardFileTask } from "../../../components/CardFileTask";
import { CardDokumenTask } from "../../../components/CardDokumenTask";
import { useSelector } from "react-redux";
import {} from "react-native-safe-area-context";

export const LampiranTask = () => {
  const navigation = useNavigation();
  const { list } = useSelector((state) => state.task);
  const taskDetail = list.detail;

  const { device } = useSelector((state) => state.apps);

  return (
    <GestureHandlerRootView>
      <>
        <BottomSheetModalProvider>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                backgroundColor: COLORS.primary,
                height: 80,
                paddingBottom: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 20,
                  width: 28,
                  height: 28,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 20,
                }}
              >
                <TouchableOpacity
                  style={{}}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H1", device),
                    fontWeight: 600,
                    color: COLORS.white,
                  }}
                >
                  Lampiran
                </Text>
              </View>
            </View>

            <View style={{ marginHorizontal: "5%", marginVertical: 20 }}>
              <Text
                style={{ color: COLORS.lighter, fontWeight: FONTWEIGHT.bold }}
              >
                Lampiran
              </Text>
            </View>

            <View
              style={{ flex: 1, alignItems: "center", marginHorizontal: "5%" }}
            >
              <CardFileTask taskDetail={taskDetail} />
            </View>
          </ScrollView>
        </BottomSheetModalProvider>
      </>
    </GestureHandlerRootView>
  );
};
