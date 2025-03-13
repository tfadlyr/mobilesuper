import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { getTokenValue } from "../../service/session";
import { getCourseDigiSign } from "../../service/api";
import ListEmpty from "../../components/ListEmpty";
import { CardListLMS } from "../../components/CardListLMS";

export const SertifikatLms = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [token, setToken] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(getCourseDigiSign(token));
    }
  }, [token]);

  const { device } = useSelector((state) => state.apps);
  const { courseList } = useSelector((state) => state.digitalsign);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.primary,
          height: 80,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            width: device === "tablet" ? 40 : 28,
            height: device === "tablet" ? 40 : 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
              marginRight: 50,
            }}
          >
            Sertifikat LMS
          </Text>
        </View>
      </View>

      <View style={{ padding: 10, flex: 1 }}>
        <FlatList
          data={courseList}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => <CardListLMS item={item} device={device}/>}
          ListEmptyComponent={() => <ListEmpty />}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={onRefresh}
          //   />
          // }
          style={{
            height: "88%",
          }}
        />
      </View>
    </View>
  );
};
