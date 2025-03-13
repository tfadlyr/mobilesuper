import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import {
  COLORS,
  DATETIME,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Text } from "react-native";
import moment from "moment/min/moment-with-locales";
import { Image } from "react-native";
import { getEventDetail } from "../../service/api";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

export const CardProgresEvent = ({
  token,
  item,
  bottomSheetAttach,
  loading,
  device,
}) => {
  const navigation = useNavigation();
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  // const [loading, setLoading] = useState(true)
  // const { event } = useSelector(state => state.event)
  const dispatch = useDispatch();

  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getEventDetail(params));
  };
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.white,
          width: "90%",
          padding: 20,
          marginBottom: 10,
          borderRadius: 8,
        }}
        onPress={() => {
          getDetail(item.id);
          navigation.navigate("MainDetailEvent");
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
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
            <>
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  width: "50%",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {item.title}
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                {item.agenda_count} Sub Agenda
              </Text>
            </>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4, marginVertical: 10 }}
                width={100}
                height={20}
              />
            ) : (
              <>
                <Text
                  style={{
                    marginVertical: 10,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {moment(item.start_date)
                    .locale("id")
                    .format(DATETIME.LONG_DATE)}{" "}
                  -{" "}
                </Text>
              </>
            )}
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4, marginVertical: 10 }}
                width={100}
                height={20}
              />
            ) : (
              <>
                <Text
                  style={{
                    marginVertical: 10,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {moment(item.end_date)
                    .locale("id")
                    .format(DATETIME.LONG_DATE)}
                </Text>
              </>
            )}
          </View>
          {/* <TouchableOpacity onPress={() => bottomSheetAttach(item.todo)}>
                          <Ionicons name='chevron-down-outline' size={20} />
                      </TouchableOpacity> */}
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
              <>
                <Image
                  source={{ uri: item.pic.avatar_url }}
                  style={{
                    width: device === "tablet" ? 50 : 26,
                    height: device === "tablet" ? 50 : 26,
                    borderRadius: device === "tablet" ? 60 : 30,
                  }}
                />
                <Text
                  style={{
                    width: device === "tablet" ? 300 : 150,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {item.pic.nama}
                </Text>
              </>
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4 }}
                width={100}
                height={20}
              />
            ) : (
              <View
                style={{
                  width: device === "tablet" ? 70 : 50,
                  paddingVertical: 6,
                  backgroundColor: COLORS.infoDangerLight,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.infoDanger,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {Math.floor(item.progress)}%
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
