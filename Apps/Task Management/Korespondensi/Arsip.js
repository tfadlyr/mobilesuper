import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { FlatList } from "react-native";
import { CardListTask } from "../../../components/CardListTask";
import { CardShimmerListTask } from "../../../components/CardListTask/CardShimmerListTask";
import { useSelector } from "react-redux";
import { CardListGridTask } from "../../../components/CardListGridTask";
import ListEmpty from "../../../components/ListEmpty";
import { CardShimmerListGridTask } from "../../../components/CardListGridTask/CardShimmerListGridTask";
import { COLORS, DATETIME } from "../../../config/SuperAppps";
import { Loading } from "../../../components/Loading";
import { Search } from "../../../components/Search";
import { Text } from "react-native";
import { CardListTaskKorespondensi } from "../../../components/CardListKorespondensiTM";

export const Arsip = () => {
  const { list, variant, loading } = useSelector((state) => state.task);
  const taskLists = list.data;
  const [filterData, setFilterData] = useState([]);
  const [filterDataStatus, setFilterDataStatus] = useState([]);
  const [page, setPage] = useState(5);
  const [search, setSearch] = useState("");

  const loadMore = () => {
    if (filterData % 5 === 0) {
      setPage(page + 5);
    }
  };

  const data = [];
  {
    taskLists?.map((item) =>
      item.children.map((child, index) => {
        data.push(child);
      })
    );
  }

  // useEffect(() => {
  //     // dispatch(getListKorespondensiArsipTM({ token: token, page: page }));
  //     setFilterDataStatus(data)
  // }, [data])

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

  // const renderShimmerGrid = () => {
  //     const arr = []
  //     for (let i = 0; i < 6; i++) {
  //         arr.push(
  //             <View key={i} style={{ flexDirection: 'row', gap: 4 }}>
  //                 <CardShimmerListGridTask />
  //                 <CardShimmerListGridTask />
  //             </View>
  //         )
  //     }
  //     return arr
  // }

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
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
        {loading ? (
          <Loading />
        ) : (
          <View>
            <FlatList
              data={search !== "" ? filterData : data}
              // data={data}
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
                loading === true ? (
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
