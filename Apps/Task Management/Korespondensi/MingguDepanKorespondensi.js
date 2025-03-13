import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { FlatList } from "react-native";
import { CardListTask } from "../../../components/CardListTask";
import { CardShimmerListTask } from "../../../components/CardListTask/CardShimmerListTask";
import { useDispatch, useSelector } from "react-redux";
import { CardListGridTask } from "../../../components/CardListGridTask";
import ListEmpty from "../../../components/ListEmpty";
import { CardShimmerListGridTask } from "../../../components/CardListGridTask/CardShimmerListGridTask";
import { COLORS, DATETIME } from "../../../config/SuperAppps";
import { Loading } from "../../../components/Loading";
import { Search } from "../../../components/Search";
import { Text } from "react-native";
import { getListKorespondensiNextWeekTM } from "../../../service/api";
import { CardListTaskKorespondensi } from "../../../components/CardListKorespondensiTM";
import { getTokenValue } from "../../../service/session";

export const MingguDepanKorespondensi = () => {
  const { list, variant, loadingnextweek, listKorespondensi } = useSelector(
    (state) => state.task
  );
  const taskLists = listKorespondensi.today;
  const [filterData, setFilterData] = useState([]);
  const [filterDataStatus, setFilterDataStatus] = useState([]);
  const [page, setPage] = useState(5);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);
  let data = [];
  {
    taskLists?.map((item) =>
      item.children.map((child, index) => {
        data.push(child);
      })
    );
  }
  useEffect(() => {
    // dispatch(getListKorespondensiNextWeekTM(token))
    setFilterDataStatus(taskLists);
  }, [taskLists]);

  const loadMore = () => {
    if (filterData % 5 === 0) {
      setPage(page + 5);
    }
  };

  // const renderShimmerList = () => {
  //     const arr = []
  //     for (let i = 0; i < 6; i++) {
  //         arr.push(
  //             <View key={i}>
  //                 <CardShimmerListTask />
  //             </View>
  //         )
  //     }
  //     return arr
  // }

  const renderShimmerGrid = () => {
    const arr = [];
    for (let i = 0; i < 6; i++) {
      arr.push(
        <View key={i} style={{ flexDirection: "row", gap: 4 }}>
          <CardShimmerListGridTask />
          <CardShimmerListGridTask />
        </View>
      );
    }
    return arr;
  };

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    // const item = taskLists
    if (search !== "") {
      const datas = data.filter((item) => {
        return item.subject?.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(datas);
    } else {
      setFilterData(data);
    }
  }, [search, taskLists]);
  return (
    <>
      <View style={{ marginTop: 20 }}>
        <Search
          placeholder={"Cari"}
          iconColor={COLORS.primary}
          onSearch={filter}
        />
      </View>
      <View style={{ flex: 1, marginTop: 20 }}>
        {loadingnextweek ? (
          <Loading />
        ) : (
          <View>
            <FlatList
              // data={search !== '' ? filterData : filterDataStatus}
              data={data}
              renderItem={({ item }) => (
                <CardListTaskKorespondensi
                  id={item.id}
                  title={item.subject}
                  duedate={item.duedate}
                  priority={item.prio}
                />
              )}
              ListEmptyComponent={() => <ListEmpty />}
              ListFooterComponent={() =>
                loadingnextweek === true ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 24,
                    }}
                  >
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  </View>
                ) : null
              }
              onEndReached={loadMore}
              style={{ height: "95%" }}
            />
          </View>
        )}
      </View>
    </>
  );
};
