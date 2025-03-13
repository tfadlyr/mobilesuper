import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/min/moment-with-locales";
import ListEmpty from "../../components/ListEmpty";
import { COLORS, DATETIME, spacing } from "../../config/SuperAppps";
import { Loading } from "../../components/Loading";
import {
  setFaqByCategory,
  setFaqCategory,
  setFaqGroup,
  setFaqByGroup,
} from "../../store/Faq";
import {
  getFaqByCategory,
  getFaqCategory,
  getFaqGroup,
  getFaqByGroup,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import { CardListFaq } from "../../components/CardListFaq";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Dropdown } from "../../components/DropDown";
import { Search } from "../../components/Search";

export const AplikasiPortalKKP = () => {
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState({
    id: "",
    toggle: false,
  });
  const { faqCategory, faqByCategory, faqGroup, faqByGroup, loading } =
    useSelector((state) => state.Faq);

  const idAP = faqCategory?.lists[2]?.id;
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState("");
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { device } = useSelector((state) => state.apps);

  const [group, setFaqGroup] = useState();

  useFocusEffect(
    useCallback(() => {
      setFilterData("");
      if (group != undefined || group != "") {
        setFaqGroup("");
      }
    }, [])
  );

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
      dispatch(getFaqCategory({ token }));
    });
  }, [token]);

  useEffect(() => {
    if (idAP != undefined) {
      dispatch(getFaqByCategory({ token: token, idCategory: idAP }));
      dispatch(getFaqGroup({ token }));
    }
  }, [token, idAP]);

  let dataGroup =
    faqGroup?.lists?.map((item) => ({
      key: item.id,
      value: item.name,
    })) ?? null;
  if (dataGroup && dataGroup.length > 2) {
    dataGroup = dataGroup.slice(0, -2);
  }
  // Nambah Group untuk all faq
  // dataGroup.push({ key: "0", value: "All" });

  const onRefresh = React.useCallback(() => {
    // try {
    //   if (token !== "") {
    //     setSearch("");
    //     setInputValue("");
    //     dispatch(getFaqCategory({ token }));
    //     setIdCategory(faqCategory?.lists[0]?.id);
    //     if (idCategory != undefined) {
    //       dispatch(getFaqByCategory({ token, idCategory }));
    //     }
    //   }
    // } catch (error) {}
    // setRefreshing(true);
    // setTimeout(() => {
    //   setRefreshing(false);
    // }, 2000);
  }, [token]);

  async function getDataFaqByGroup(id) {
    try {
      if (id != undefined) {
        dispatch(getFaqByGroup({ token: token, idGroup: id }));
        // if (id == "0") {
        //   dispatch(getFaqByCategory({ token: token, idCategory: idAP }));
        // }
      }
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
    }
  }

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    if (search !== "") {
      const data = faqByGroup?.lists.filter((item) => {
        return item.title?.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(faqByGroup?.lists);
    }
  }, [search, faqByGroup?.lists]);

  return (
    <>
      <View style={{ marginTop: spacing.medium }}>
        <Dropdown
          data={dataGroup}
          heightValue={"90%"}
          selected={group}
          setSelected={setFaqGroup}
          handleClick={(item) => {
            getDataFaqByGroup(item.key);
            setSearch("");
          }}
          borderWidth={1}
          borderColor={COLORS.ExtraDivinder}
          borderwidthDrop={1}
          borderColorDrop={COLORS.ExtraDivinder}
          borderWidthValue={1}
          borderColorValue={COLORS.ExtraDivinder}
          placeHolder={"Aplikasi"}
          backgroundColor={COLORS.white}
          search={true}
        />
      </View>
      <View style={{ marginVertical: spacing.medium }}>
        <Search
          placeholder={"Cari"}
          iconColor={COLORS.primary}
          onSearch={filter}
        />
      </View>
      <FlatList
        data={filterData}
        renderItem={({ item }) => (
          <CardListFaq
            item={item}
            collapse={collapse}
            setCollapse={setCollapse}
            navigation={navigation}
            token={token}
            loading={loading}
            device={device}
          />
        )}
        ListFooterComponent={() =>
          loading === true ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : null
        }
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => <ListEmpty />}
      />
    </>
  );
};
