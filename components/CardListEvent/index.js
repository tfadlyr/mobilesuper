import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { getEventDetail } from "../../service/api";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Text } from "react-native";
import { Image } from "react-native";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

export const CardListEvent = ({ token, item, loading, device }) => {
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const navigation = useNavigation();
  // const [loading, setLoading] = useState(true)
  // const { event } = useSelector(state => state.event)
  const dispatch = useDispatch();

  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getEventDetail(params));
  };

  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", marginTop: 10 }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.white,
          width: "90%",
          padding: 20,
          borderRadius: 8,
          marginTop: 20,
        }}
        onPress={() => {
          getDetail(item.id);
          navigation.navigate("MainDetailEvent");
        }}
      >
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {item.title}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            Departemen:
          </Text>
          {loading ? (
            <ShimmerPlaceHolder
              style={{ borderRadius: 4 }}
              width={100}
              height={20}
            />
          ) : (
            <Text
              style={{
                marginVertical: 10,
                width: 200,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {item.pic.title.name}
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              PIC
            </Text>
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4 }}
                width={100}
                height={20}
              />
            ) : (
              <Image
                source={{ uri: item.pic.avatar_url }}
                style={{
                  width: device === "tablet" ? 60 : 26,
                  height: device === "tablet" ? 60 : 26,
                  borderRadius: 30,
                }}
              />
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              Status
            </Text>
            <View
              style={{
                width: 100,
                height: 24,
                backgroundColor: COLORS.infoLight,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <Text
                  style={{
                    color: COLORS.info,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {item.status}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
