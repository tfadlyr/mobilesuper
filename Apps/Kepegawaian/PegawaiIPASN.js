import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getTokenValue } from "../../service/session";
import { getDataIPASN } from "../../service/api";
import { CardListDataIPASN } from "../../components/CardListDataIPASN";
import ListEmpty from "../../components/ListEmpty";
import { Loading } from "../../components/Loading";

export const PegawaiIPASN = () => {
  const { device } = useSelector((state) => state.apps);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(10);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(
        getDataIPASN({
          token,
          page,
          search,
        })
      );
    }
  }, [token, page, search]);

  const { DataIPASN, loading } = useSelector((state) => state.kepegawaian);

  const loadMore = () => {
    if (DataIPASN.lists.length % 10 === 0) {
      //   if (DataIPASN.lists.length > page) {
      setPage(page + 10);
      //   }
    }
  };

  const filterSearch = () => {
    setSearch(inputValue);
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const { profile } = useSelector((state) => state.superApps);

  const roleOperator = ["OP_KEPEGAWAIAN"];
  const isRoleOperator = profile?.roles_access?.some((item) =>
    roleOperator.includes(item)
  );

  return (
    <View>
      {loading ? <Loading /> : null}
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
            width: device === "tablet" ? 40 : 28,
            height: device === "tablet" ? 40 : 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Main")}>
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
              color: "white",
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
            }}
          >
            Data IPASN
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          // alignContent: "center",
          gap: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderWidth: 1,
            borderColor: COLORS.ExtraDivinder,
            borderRadius: 8,
            backgroundColor: COLORS.white,
            width:
              device === "tablet" && orientation === "landscape"
                ? "96.5%"
                : device === "tablet" && orientation === "potrait"
                ? "95%"
                : "90%",
            marginHorizontal: 20,
            marginTop: 20,
          }}
        >
          <Ionicons
            name="search"
            size={fontSizeResponsive("H3", device)}
            color={COLORS.primary}
          />
          <TextInput
            placeholder={"Cari..."}
            style={{
              fontSize: fontSizeResponsive("H4", device),
              flex: 1,
            }}
            maxLength={30}
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
            onEndEditing={filterSearch}
            clearButtonMode="always"
            allowFontScaling={false}
          />
        </View>

        {/* <TouchableOpacity
            onPress={() => {
              bottomSheetAttachFilter();
              dispatch(getFilterAksiPerubahan(token));
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 30,
                backgroundColor: COLORS.white,
                justifyContent: "center",
                alignItems: "center",
                borderColor: COLORS.secondaryLighter,
                // borderWidth: isFiltered ? 1 : 0,
              }}
            >
              <Ionicons name="filter-outline" size={24} />
            </View>
          </TouchableOpacity> */}
      </View>

      <FlatList
        data={DataIPASN.lists}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <View key={item.id}>
            <CardListDataIPASN
              item={item}
              token={token}
              device={device}
              isRoleOperator={isRoleOperator}
            />
          </View>
        )}
        ListEmptyComponent={() => <ListEmpty />}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        onEndReached={loadMore}
        style={{ height: "75%", marginHorizontal: 20 }}
      />
    </View>
  );
};
