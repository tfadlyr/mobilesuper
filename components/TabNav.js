import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";
import { Config } from "../constants/config";
import { GlobalStyles } from "../constants/styles";
import DDelegation from "../screen/Dashboard/DDelegation";
import DLetter from "../screen/Dashboard/DLetter";
import DSecretary from "../screen/Dashboard/DSecretary";
import DTodo from "../screen/Dashboard/DTodo";

const Tab = createMaterialTopTabNavigator();

function TabNav({ route }) {
  todoConfig = Config.todo;
  return (
    <Tab.Navigator
      tabBarPosition={route.params.position}
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: GlobalStyles.colors.primary },
      }}
    >
      <Tab.Screen
        name="Letter"
        component={DLetter}
        options={styles.tabBarLabelStyle}
      />
      {todoConfig && (
        <Tab.Screen
          name="Todo"
          component={DTodo}
          options={styles.tabBarLabelStyle}
        />
      )}
      <Tab.Screen
        name="Secretary"
        component={DSecretary}
        options={styles.tabBarLabelStyle}
      />
      <Tab.Screen
        name="Delegation"
        component={DDelegation}
        options={styles.tabBarLabelStyle}
      />
    </Tab.Navigator>
  );
}

export default TabNav;

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    tabBarLabelStyle: {
      fontSize: GlobalStyles.font.xs,
    },
  },
});
