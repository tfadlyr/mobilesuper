import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getDetailTodo } from "../../service/api";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { COLORS, DATETIME, FONTWEIGHT } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import moment from "moment/min/moment-with-locales";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

export const CardListTodo = ({
  token,
  item,
  bottomSheetAttach,
  role,
  setIdEdit,
  loading,
}) => {
  const [user, setUser] = useState("resepsionis");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

  const getDetail = (id) => {
    const params = { token, id };
    dispatch(getDetailTodo(params));
  };
  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", marginTop: 10 }}
    >
      <TouchableOpacity
        style={{
          width: "90%",
          backgroundColor: COLORS.white,
          borderRadius: 8,
          justifyContent: "center",
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
          navigation.navigate("DetailTodo", { item: item });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {loading ? (
            <ShimmerPlaceHolder
              style={{ borderRadius: 4 }}
              width={100}
              height={20}
            />
          ) : (
            <Text style={{ fontWeight: FONTWEIGHT.bold, width: "90%" }}>
              {item.name}
            </Text>
          )}
          {role.is_pic === true ||
          role.is_notulensi === true ||
          (role.is_pic === false &&
            role.is_notulensi === false &&
            role.is_presensi === false &&
            role.is_member === false) ? (
            <TouchableOpacity
              onPress={() => {
                bottomSheetAttach();
                setIdEdit(item.id);
              }}
            >
              <Ionicons name="chevron-forward-outline" size={24} />
            </TouchableOpacity>
          ) : (
            <Text style={{ fontWeight: FONTWEIGHT.bold }}>{item.name}</Text>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Text style={{ color: COLORS.lighter }}>Due Date :</Text>
          {loading ? (
            <ShimmerPlaceHolder
              style={{ borderRadius: 4, marginVertical: 10 }}
              width={100}
              height={20}
            />
          ) : (
            <Text style={{ marginVertical: 10, color: COLORS.lighter }}>
              {moment(item.due_date).locale("id").format(DATETIME.LONG_DATE)}
            </Text>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Text style={{ color: COLORS.lighter }}>Agenda :</Text>
          {loading ? (
            <ShimmerPlaceHolder
              style={{ borderRadius: 4 }}
              width={100}
              height={20}
            />
          ) : (
            <Text style={{ color: COLORS.lighter, width: 250 }}>
              {item.agenda}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
