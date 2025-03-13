import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getArsipCuti } from "../../service/api";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { Search } from "../../components/Search";
import { CardArsipCuti } from "../../components/CardArsipCuti";
import { CardListArsipCuti } from "../../components/CardListArsipCuti";

export const ListArsipCuti = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.superApps);
  const navigation = useNavigation();
  useEffect(() => {
    if (profile.nip !== "") {
      dispatch(getArsipCuti(profile?.nip));
    }
  }, [profile?.nip]);
  const { loading, arsip } = useSelector((state) => state.cuti);
  const arsipLists = arsip.lists.data;

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(arsipLists);
  }, [arsipLists]);

  useEffect(() => {
    if (search !== "") {
      const data = arsipLists?.filter((item) => {
        return item.jenis_cuti.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(arsipLists);
    }
  }, [search]);

  return (
    <>
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
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
              fontSize: FONTSIZE.H1,
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
            }}
          >
            Arsip Cuti
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 20, marginHorizontal: 16 }}>
        <Search
          placeholder={"Cari"}
          iconColor={COLORS.primary}
          onSearch={filter}
        />
        <FlatList
          data={filterData}
          renderItem={({ item }) => (
            <View key={item.id}>
              <CardListArsipCuti item={item} nip={profile.nip} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => <ListEmpty />}
        />
      </View>
    </>
  );
};
