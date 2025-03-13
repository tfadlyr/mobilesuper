import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { COLORS, FONTSIZE } from "../../../config/SuperAppps";
import { FlatList } from "react-native";
import ListEmpty from "../../../components/ListEmpty";
import { CardTaskCari } from "../../../components/CardTaskCari";

const filterTask = [
  {
    id: 1,
    name: "Semua",
    type: "semua",
  },
  {
    id: 2,
    name: "Backlog",
    type: "backlog",
  },
  {
    id: 3,
    name: "In Progress",
    type: "in progress",
  },
  {
    id: 4,
    name: "Pending",
    type: "pending",
  },
  {
    id: 5,
    name: "Completed",
    type: "completed",
  },
];

const filterTaskDashboard = [
  {
    id: 1,
    name: "Semua",
    type: "semua",
  },
  {
    id: 2,
    name: "Hari Ini",
    type: "today",
  },
  {
    id: 3,
    name: "Minggu Ini",
    type: "this week",
  },
  {
    id: 4,
    name: "Terlewat",
    type: "overdue",
  },
];

export const FilterTask = ({
  choiceFilter,
  setChoiceFilter,
  filterData,
  type,
}) => {
  const listFilter = type === "Dashboard" ? filterTaskDashboard : filterTask;
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {listFilter.map((item) => (
          <TouchableOpacity
            onPress={() => {
              setChoiceFilter(item.type);
            }}
            key={item.id}
          >
            <View
              style={{
                backgroundColor:
                  choiceFilter === item.type
                    ? COLORS.infoDangerLight
                    : COLORS.white,
                borderColor:
                  choiceFilter === item.type
                    ? COLORS.infoDangerLight
                    : COLORS.ExtraDivinder,
                borderRadius: 16,
                borderWidth: 1,
                marginVertical: 10,
              }}
            >
              <Text
                style={{
                  color:
                    choiceFilter == item.type ? COLORS.primary : COLORS.grey,
                  marginVertical: 10,
                  marginHorizontal: 7,
                  fontSize: FONTSIZE.H3,
                }}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 400 }}>
        <FlatList
          data={filterData}
          renderItem={({ item }) => (
            <CardTaskCari
              index={item.id}
              title={item.title}
              members={item.members}
              warna={COLORS.infoDanger}
            />
          )}
          style={{ minHeight: 440 }}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => <ListEmpty />}
        />
      </View>
    </>
  );
};
