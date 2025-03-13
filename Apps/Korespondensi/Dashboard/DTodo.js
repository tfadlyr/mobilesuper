import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, Image } from "react-native";
import { Searchbar, List, IconButton } from "react-native-paper";
import CardTodo from "../../../components/UI/CardTodo";
import ListTodo from "../../../components/UI/ListTodo";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { Config } from "../../../constants/config";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";
import { COLORS, FONTSIZE } from "../../../config/SuperAppps";
import { useSelector } from "react-redux";

function DTodo() {
  const navigation = useNavigation();
  let [listTodoToday, setTodoToday] = useState([]);
  let [listTodoOverdue, setTodoOverdue] = useState([{ results: [] }]);
  let [listTodoNextweek, setTodoNextweek] = useState([]);
  let [listTodoSearch, setTodoSearch] = useState([]);
  let [expanded, setExpanded] = useState("");
  let [searchTodo, setSearchTodo] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    todoToday();
    todoOverdue();
    todoNextweek();
  }, [token]);

  // const response = getHTTP(nde_api.dashboard);
  async function todoToday() {
    setIsLoading(true);
    try {
      //get Today
      const response = await getHTTP(nde_api.todotoday);
      setTodoToday(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response.status == null && error.status == null) {
      } else {
        handlerError(
          error,
          "Warning!",
          Config.labelTodo + " Today not working!"
        );
      }
      setIsLoading(false);
    }
  }
  async function todoOverdue() {
    try {
      //get Overdue
      const response = await getHTTP(nde_api.todooverdue);
      setTodoOverdue(response.data);
    } catch (error) {
      if (error.response.status == null && error.status == null) {
      } else {
        handlerError(
          error,
          "Warning!",
          Config.labelTodo + " Overdue not working!"
        );
      }
    }
  }
  async function todoNextweek() {
    try {
      //get Nextweek
      const response = await getHTTP(nde_api.todonextweek);
      setTodoNextweek(response.data);
    } catch (error) {
      if (error.response.status == null && error.status == null) {
      } else {
        handlerError(
          error,
          "Warning!",
          Config.labelTodo + " Nextweek not working!"
        );
      }
    }
  }
  async function todoSearch() {
    setIsLoading(true);
    try {
      //get searching
      const response = await getHTTP(nde_api.todosearch + searchTodo);
      setTodoSearch(response.data);
      setExpanded("Searching");
      setIsLoading(false);
    } catch (error) {
      if (error.response.status == null && error.status == null) {
      } else {
        handlerError(
          error,
          "Warning!",
          "Searching " + Config.labelTodo + " not working!"
        );
      }
      setIsLoading(false);
    }
  }
  function setExpandedList(title) {
    expanded != title ? setExpanded(title) : setExpanded("");
  }
  return (
    <ScrollView style={styles.screen}>
      {/* <LoadingOverlay visible={isLoading} /> */}
      <View style={styles.counter}>
        <CardTodo
          count={listTodoToday.count}
          title="Today"
          onPress={() => setExpandedList("Today")}
        />
        <CardTodo
          count={listTodoOverdue.count}
          title="Overdue"
          onPress={() => setExpandedList("Overdue")}
        />
        <CardTodo
          count={listTodoNextweek.count}
          title="Next Week"
          onPress={() => setExpandedList("Next Week")}
        />
      </View>
      <Searchbar
        placeholder="Cari..."
        onChangeText={setSearchTodo}
        value={searchTodo}
        style={styles.searchBar}
        onIconPress={todoSearch}
        onSubmitEditing={todoSearch}
        clearIcon={() => (
          <>
            {searchTodo.length > 0 && (
              <IconButton
                icon="close"
                onPress={() => {
                  setSearchTodo("");
                  setTodoSearch([]);
                }}
              />
            )}
          </>
        )}
      />

      {listTodoSearch.length == 0 && (
        <>
          <View style={{ marginBottom: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  backgroundColor: COLORS.infoDanger,
                  width: "2%",
                  height: 20,
                  borderTopEndRadius: 2,
                  borderBottomEndRadius: 2,
                }}
              />
              <View
                style={{
                  height: 20,
                  width: "96%",
                  backgroundColor: "#6B7280",
                  borderRadius: 4,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 13,
                    fontWeight: 600,
                    marginStart: 10,
                  }}
                >
                  Over Due
                </Text>
              </View>
            </View>
            <ListTodo title="Overdue" result={listTodoOverdue} />
          </View>

          <View style={{ marginBottom: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  backgroundColor: COLORS.infoDanger,
                  width: "2%",
                  height: 20,
                  borderTopEndRadius: 2,
                  borderBottomEndRadius: 2,
                }}
              />
              <View
                style={{
                  height: 20,
                  width: "96%",
                  backgroundColor: "#6B7280",
                  borderRadius: 4,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 13,
                    fontWeight: 600,
                    marginStart: 10,
                  }}
                >
                  Today
                </Text>
              </View>
            </View>
            <ListTodo title="Today" result={listTodoToday} />
          </View>

          <View style={{ marginBottom: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  backgroundColor: COLORS.infoDanger,
                  width: "2%",
                  height: 20,
                  borderTopEndRadius: 2,
                  borderBottomEndRadius: 2,
                }}
              />
              <View
                style={{
                  height: 20,
                  width: "96%",
                  backgroundColor: "#6B7280",
                  borderRadius: 4,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 13,
                    fontWeight: 600,
                    marginStart: 10,
                  }}
                >
                  Next Week
                </Text>
              </View>
            </View>
            <ListTodo title="Next Week" result={listTodoNextweek} />
          </View>
        </>
      )}

      {listTodoSearch.length != 0 && (
        <>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                backgroundColor: COLORS.infoDanger,
                width: "2%",
                height: 20,
                borderTopEndRadius: 2,
                borderBottomEndRadius: 2,
              }}
            />
            <View
              style={{
                height: 20,
                width: "96%",
                backgroundColor: "#6B7280",
                borderRadius: 4,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 13,
                  fontWeight: 600,
                  marginStart: 10,
                }}
              >
                Searching
              </Text>
            </View>
          </View>
          <ListTodo title="Searching" result={listTodoSearch} />
        </>
      )}
      {/* <List.AccordionGroup
        expandedId={expanded}
        onAccordionPress={(item) => setExpandedList(item)}
      >
        {listTodoSearch.length == 0 && (
          <>
            <ListTodo title="Today" result={listTodoToday} />
            <ListTodo title="Overdue" result={listTodoOverdue} />
            <ListTodo title="Next Week" result={listTodoNextweek} />
          </>
        )}
        {listTodoSearch.length != 0 && (
          <ListTodo title="Searching" result={listTodoSearch} />
        )}
      </List.AccordionGroup> */}
    </ScrollView>
  );
}
export default DTodo;

const styles = StyleSheet.create({
  screen: {
    marginTop: 20,
  },
  counter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  searchBar: {
    borderRadius: 6,
    backgroundColor: "white",
    marginBottom: 16,
    //shadow ios
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    //shadow android
    elevation: 2,
  },
});
