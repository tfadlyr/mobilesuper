import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getEventAgendaDetail } from "../../service/api";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import moment from "moment/min/moment-with-locales";
import { useState } from "react";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const CardListDetailAgenda = ({
  token,
  item,
  bottomSheetAttach,
  setIdEdit,
  loading,
  device,
}) => {
  const navigation = useNavigation();
  const [user, setUser] = useState("resepsionis");
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  // const { agenda } = useSelector(state => state.event)
  const { event } = useSelector((state) => state.event);
  const dispatch = useDispatch();

  const getDetail = (id) => {
    // const data = agenda.lists.find(item => item.id === id)
    const params = { token, id };
    dispatch(getEventAgendaDetail(params));
  };

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        style={{
          width: "90%",
          backgroundColor: COLORS.white,
          marginTop: 10,
          borderRadius: 8,
          padding: 20,
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
        }}
        onPress={() => {
          getDetail(item.id);
          navigation.navigate("MainDetailAgenda");
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
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                width: "90%",
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {item.title}
            </Text>
          )}
          {event.detailEvent.user_role.is_pic === true ||
          item.user_role?.is_pic === true ||
          (item.user_role?.is_notulensi === false &&
            item.user_role?.is_presensi === false &&
            item.user_role?.is_member === false &&
            item.user_role?.is_pic === false) ? (
            <TouchableOpacity
              onPress={() => {
                bottomSheetAttach();
                setIdEdit(item.id);
              }}
            >
              <Ionicons
                name="chevron-forward-outline"
                size={device === "tablet" ? 36 : 24}
                color={COLORS.lighter}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <View>
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4 }}
                width={100}
                height={20}
              />
            ) : (
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                {moment(item.date).locale("id").format(DATETIME.LONG_DATE)}
              </Text>
            )}
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4, marginTop: 10 }}
                width={100}
                height={20}
              />
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {moment(item.start_time, "HH:mm:ss")
                    .locale("id")
                    .format("HH:mm")}{" "}
                  -{" "}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {moment(item.end_time, "HH:mm:ss")
                    .locale("id")
                    .format("HH:mm")}
                </Text>
              </View>
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
              <>
                <Ionicons
                  name="list-circle-outline"
                  size={device === "tablet" ? 36 : 24}
                  color={COLORS.lighter}
                />
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {item.jmltodo}
                </Text>
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  Todo
                </Text>
              </>
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {loading ? (
            <ShimmerPlaceHolder
              style={{ borderRadius: 4, marginTop: 10 }}
              width={100}
              height={20}
            />
          ) : (
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              {item.location}
            </Text>
          )}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4 }}
                width={100}
                height={20}
              />
            ) : (
              <>
                <Ionicons
                  name="people-outline"
                  size={device === "tablet" ? 36 : 24}
                  color={COLORS.lighter}
                />
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {item.member_count}
                </Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
