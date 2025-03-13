import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/min/moment-with-locales";
import ListEmpty from "../../components/ListEmpty";
import { COLORS, DATETIME, spacing } from "../../config/SuperAppps";
import { Loading } from "../../components/Loading";
import { getFaqByCategory, getFaqCategory } from "../../service/api";
import { getTokenValue } from "../../service/session";
import { CardListFaq } from "../../components/CardListFaq";
import { useNavigation } from "@react-navigation/native";
import { Search } from "../../components/Search";

export const DashboardDanReport = () => {
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState({
    id: "",
    toggle: false,
  });
  const { faqCategory, faqByCategory, loading } = useSelector(
    (state) => state.Faq
  );

  const idDDR = faqCategory?.lists[0]?.id;
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState("");
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { device } = useSelector((state) => state.apps);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
      dispatch(getFaqCategory({ token }));
    });
  }, [token]);

  useEffect(() => {
    if (idDDR != undefined) {
      dispatch(getFaqByCategory({ token: token, idCategory: idDDR }));
    }
  }, [token, idDDR]);

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

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    if (search !== "") {
      const data = faqByCategory.DDR.filter((item) => {
        return item.title?.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(faqByCategory.DDR);
    }
  }, [search, faqByCategory.DDR]);

  return (
    <>
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
