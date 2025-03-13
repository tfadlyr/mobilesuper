import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native";
import { AVATAR, DATETIME } from "../../../config/SuperAppps";
import { FlatList } from "react-native";
import { CardListTask } from "../../../components/CardListTask";
import { useSelector } from "react-redux";
import { CardListGridTask } from "../../../components/CardListGridTask";
import moment from "moment/min/moment-with-locales";
import ListEmpty from "../../../components/ListEmpty";
import { CardShimmerListGridTask } from "../../../components/CardListGridTask/CardShimmerListGridTask";
import { CardShimmerListTask } from "../../../components/CardListTask/CardShimmerListTask";

export const InProgres = () => {
  const { list, variant, loading } = useSelector((state) => state.task);
  const taskLists = list.data;
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    const data = taskLists.filter((item) => {
      return item.status === "in progress";
    });
    setFilterData(data);
  }, [taskLists]);

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

  const { device } = useSelector((state) => state.apps);
  return (
    <>
      {variant === "list" ? (
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={{ flexDirection: "column", gap: 10, marginTop: 20 }}>
              {renderShimmerList()}
            </View>
          ) : (
            <View style={{ marginTop: 20 }}>
              <FlatList
                data={filterData}
                renderItem={({ item }) => (
                  <CardListTask
                    id={item.id}
                    title={item.title}
                    duedate={moment(item.due_date)
                      .locale("id")
                      .format(DATETIME.LONG_DATE)}
                    device={device}
                  />
                )}
                ListEmptyComponent={() => <ListEmpty />}
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
