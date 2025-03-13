import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useDispatch } from "react-redux";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
  spacing,
} from "../../config/SuperAppps";
import { useWindowDimensions, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { Divider } from "react-native-paper";
import WebView from "react-native-webview";
import RenderHTML from "react-native-render-html";

export const CardListFaq = ({ item, collapse, setCollapse, token, device }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const loading = false;

  const { width } = useWindowDimensions();

  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  return (
    <View
      style={{
        flexDirection: "column",
        display: "flex",
        backgroundColor: COLORS.white,
        padding: spacing.default,
        marginBottom: spacing.medium,
        borderRadius: 8,
        alignSelf: "center",
        width: "100%",
      }}
    >
      {collapse.id === item.id && collapse.toggle === true ? (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setCollapse({ id: "", toggle: false })}
        >
          <View style={{ width: Platform.OS === "ios" ? "92%" : "93%" }}>
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4 }}
                width={250}
                height={20}
              />
            ) : (
              <Text
                style={[
                  {
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  },
                ]}
              >
                {item.title}
              </Text>
            )}
          </View>
          {collapse.id === item.id && collapse.toggle === true ? (
            <TouchableOpacity
              onPress={() => setCollapse({ id: "", toggle: false })}
            >
              <Ionicons
                name="chevron-up"
                size={device === "tablet" ? 40 : 24}
              />
            </TouchableOpacity>
          ) : (
            <Ionicons
              name="chevron-down"
              size={device === "tablet" ? 40 : 24}
            />
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setCollapse({ id: item.id, toggle: true })}
        >
          <View style={{ width: Platform.OS === "ios" ? "92%" : "93%" }}>
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4 }}
                width={250}
                height={20}
              />
            ) : (
              <Text
                style={[
                  {
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  },
                ]}
              >
                {item.title}
              </Text>
            )}
          </View>
          {collapse.id === item.id && collapse.toggle === true ? (
            <TouchableOpacity
              onPress={() => setCollapse({ id: "", toggle: false })}
            >
              <Ionicons
                name="chevron-up"
                size={device === "tablet" ? 40 : 24}
              />
            </TouchableOpacity>
          ) : (
            <Ionicons
              name="chevron-down"
              size={device === "tablet" ? 40 : 24}
            />
          )}
        </TouchableOpacity>
      )}

      {collapse.id === item.id && collapse.toggle === true ? (
        <View>
          <TouchableOpacity
            onPress={() => setCollapse({ id: "", toggle: false })}
          >
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4, marginTop: 10 }}
                width={100}
                height={20}
              />
            ) : (
              <>
                <Divider style={{ marginVertical: spacing.medium }} />
                <RenderHTML
                  source={{ html: item.description }}
                  contentWidth={width}
                  defaultTextProps={{ allowFontScaling: false }}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
