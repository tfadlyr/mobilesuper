import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { FlatList } from "react-native";
import { CardListTask } from "../../../components/CardListTask";
import { CardShimmerListTask } from "../../../components/CardListTask/CardShimmerListTask";
import { useDispatch, useSelector } from "react-redux";
import { CardListGridTask } from "../../../components/CardListGridTask";
import moment from "moment/min/moment-with-locales";
import ListEmpty from "../../../components/ListEmpty";
import { CardShimmerListGridTask } from "../../../components/CardListGridTask/CardShimmerListGridTask";
import { COLORS, DATETIME } from "../../../config/SuperAppps";
import { Loading } from "../../../components/Loading";
import { ActivityIndicatorBase } from "react-native";
import { Search } from "../../../components/Search";

export const Semua = () => {
  const { list, variant, loading } = useSelector((state) => state.task);
  // const dispatch = useDispatch()
  const taskLists = list.data;
  const [filterData, setFilterData] = useState([]);
  // const [page, setPage] = useState(1);
  // const [token, setToken] = useState("");
  const [search, setSearch] = useState("");

  // useEffect(() => {
  //     getTokenValue().then((val) => {
  //         setToken(val);
  //     });
  //     setPage(1)
  // }, []);

  // useEffect(() => {
  //     if (token !== "") {
  //         dispatch(getListDashboardTM({ token: token, page: page }))
  //         dispatch(getTreeTM({ token: token, page:page }))
  //     }
  // }, [token, page]);

  useEffect(() => {
    const data = taskLists.filter((item) => {
      return item.deadline_status;
    });
    setFilterData(data);
  }, [taskLists]);

  const loadMore = () => {
    if (taskLists % 5 === 0) {
      setPage(page + 5);
    }
    return page;
  };

  const renderShimmerList = () => {
    const arr = [];
    for (let i = 0; i < 6; i++) {
      arr.push(
        <View key={i}>
          <CardShimmerListTask />
        </View>
      );
    }
    return arr;
  };

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
    const item = taskLists;
    if (search !== "") {
      const data = item.filter((item) => {
        return item.title?.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(item);
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
      {variant === "list" ? (
        <View style={{ flex: 1, marginTop: 0 }}>
          {loading ? (
            <Loading />
          ) : (
            <View>
              <FlatList
                data={filterData}
                renderItem={({ item }) => (
                  <CardListTask
                    id={item.id}
                    title={item.title}
                    duedate={moment(item.due_date)
                      .locale("id")
                      .format(DATETIME.LONG_DATE)}
                  />
                )}
                // onEndReached={loadMore}
                // keyExtractor={(item) => item.id}
                ListEmptyComponent={() => <ListEmpty />}
                ListFooterComponent={() =>
                  loading === true ? (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 24,
                      }}
                    >
                      <ActivityIndicatorBase
                        size="large"
                        color={COLORS.primary}
                      />
                    </View>
                  ) : null
                }
              />
            </View>
          )}
        </View>
      ) : variant === "grid" ? (
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={{ flexDirection: "column", marginTop: 20 }}>
              {renderShimmerGrid()}
            </View>
          ) : (
            <FlatList
              key={"#"}
              data={filterData}
              renderItem={({ item }) => (
                <CardListGridTask
                  id={item.id}
                  title={item.title}
                  duedate={moment(item.due_date)
                    .locale("id")
                    .format(DATETIME.LONG_DATE)}
                  priority={item.priority}
                  members={item.members}
                />
              )}
              style={{ marginTop: 20 }}
              columnWrapperStyle={{ gap: 4 }}
              numColumns={2}
              keyExtractor={(item) => "#" + item.id}
              ListEmptyComponent={() => <ListEmpty />}
            />
          )}
        </View>
      ) : null}
    </>
  );
};
