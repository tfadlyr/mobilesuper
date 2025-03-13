import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { getDetailKalenderPersonal } from "../../service/api";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export const CardListKalenderPersonal = ({ item, token, setModal }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailKalenderPersonal(params));
  };
  return (
    <TouchableOpacity
      style={{ padding: 10 }}
      onPress={() => {
        getDetail(item.id);
        navigation.navigate("DetailKalenderPersonal");
        setModal(false);
      }}
    >
      <View
        style={{
          backgroundColor: item.color.backgroundColor,
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};
