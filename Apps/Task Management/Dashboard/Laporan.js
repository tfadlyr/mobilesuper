import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native";
import { CardListTask } from "../../../components/CardListTask";
import { CardShimmerListTask } from "../../../components/CardListTask/CardShimmerListTask";
import { useDispatch, useSelector } from "react-redux";
import { CardListGridTask } from "../../../components/CardListGridTask";
import ListEmpty from "../../../components/ListEmpty";
import { CardShimmerListGridTask } from "../../../components/CardListGridTask/CardShimmerListGridTask";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../../config/SuperAppps";
import { Loading } from "../../../components/Loading";
import { Search } from "../../../components/Search";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "../../../components/DropDown";
import { TextInput, Image } from "react-native";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTokenValue } from "../../../service/session";
import { getChoiceListTM, getCompleteTM } from "../../../service/api";

const ListCompleteProject = ({ item, device }) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        marginBottom: 10,
        borderRadius: 10,
        padding: 20,
        gap: 5,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        //shadow android
        elevation: 2,
      }}
    >
      <View>
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          Nama Project
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          {item.project}
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          Nama List
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          {item.list_task}
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontSize: fontSizeResponsive("H4", device),
            fontWeight: FONTWEIGHT.bold,
          }}
        >
          Nama Task
        </Text>
        <Text
          style={{
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {item.title}
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          Penanggung Jawab
        </Text>
        <View style={{ flexDirection: "row" }}>
          {item.members?.slice(0, 3).map((data, index) => (
            <View key={data.id} style={{ position: "relative" }}>
              <Image
                source={{ uri: data.avatar_url }}
                style={{
                  width: 26,
                  height: 26,
                  marginLeft: index !== 0 ? -7 : 0,
                  borderRadius: 50,
                }}
              />
            </View>
          ))}
        </View>
      </View>
      <View>
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          Lama Penyelesaian
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          {item.lama_penyelesaian}
        </Text>
      </View>
    </View>
  );
};

export const Laporan = () => {
  const navigation = useNavigation();

  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  const [ascending, setAscending] = useState(false);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getChoiceListTM({ token }));
    }
  }, [token]);

  const { loading, choice } = useSelector((state) => state.task);

  const dataDropdown = () => {
    let valueDropdown = [];
    choice?.map((item) => {
      valueDropdown.push({
        key: item.id,
        value: item.name,
      });
    });
    return valueDropdown;
  };

  const [selectedProject, setSelectedProject] = useState({
    key: "",
    value: "",
  });

  useEffect(() => {
    if (token !== "") {
      dispatch(
        getCompleteTM({ token: token, id: selectedProject.key, search: search })
      );
    }
  }, [token, selectedProject, search]);

  const filterData = () => {
    setSearch(inputValue);
  };

  const { complete } = useSelector((state) => state.task);

  useEffect(() => {
    setDataList(complete.list);
  }, [complete]);

  const asc = () => {
    const sortedAscending = dataList
      ?.slice()
      .sort((a, b) => a.title.localeCompare(b.title));
    setDataList(sortedAscending);
    setAscending(true);
  };

  const desc = () => {
    const sortedDescending = dataList
      ?.slice()
      .sort((a, b) => b.title.localeCompare(a.title));
    setDataList(sortedDescending);
    setAscending(false);
  };

  const { device } = useSelector((state) => state.apps);

  return (
    <>
      {loading ? <Loading /> : null}
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
          <TouchableOpacity
            style={{}}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
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
            Laporan
          </Text>
        </View>
      </View>

      {/* Main */}
      <View
        style={{
          gap: 5,
          paddingHorizontal: "5%",
          width: "100%",
          // backgroundColor: "brown",
          marginTop: 20,
        }}
      >
        <View style={{ rowGap: 20 }}>
          <View key={"ViewDropdownProject"}>
            <Dropdown
              placeHolder={"Pilih Project"}
              borderWidth={1}
              data={dataDropdown()}
              setSelected={setSelectedProject}
              borderColor={COLORS.ExtraDivinder}
              borderwidthDrop={1}
              borderColorDrop={COLORS.ExtraDivinder}
              borderWidthValue={1}
              borderColorValue={COLORS.ExtraDivinder}
              backgroundColor={COLORS.white}
            />
          </View>

          <View key={"ViewSearch"} style={styles.input}>
            <Ionicons
              name="search"
              size={fontSizeResponsive("H3", device)}
              color={COLORS.primary}
            />
            <TextInput
              placeholder={"Cari..."}
              style={{ fontSize: fontSizeResponsive("H3", device), flex: 1 }}
              maxLength={30}
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
              onEndEditing={filterData}
              clearButtonMode="always"
              allowFontScaling={false}
            />
          </View>

          <View
            key={"ActionView"}
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 50,
                padding: 5,
              }}
            >
              <Icon name="get-app" size={24} color={COLORS.grey} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={!ascending ? asc : desc}
              style={{
                backgroundColor: "white",
                borderRadius: 50,
                padding: 5,
              }}
            >
              <Ionicons name="filter-outline" size={24} color={COLORS.grey} />
            </TouchableOpacity>
          </View>

          <View key={"ViewFlatlist"}>
            <FlatList
              data={dataList}
              renderItem={({ item }) => (
                <View key={item.id}>
                  <ListCompleteProject item={item} device={device} />
                </View>
              )}
              ListEmptyComponent={() => <ListEmpty />}
            />
          </View>
        </View>
      </View>
      {/* Main End */}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.ExtraDivinder,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
});
