/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable, StyleSheet } from "react-native";
import { Text, View } from "components/Themed";
import Colors from "constants/Colors";
import useColorScheme from "hooks/useColorScheme";

import ModalScreen from "screens/ModalScreen";
import NotFoundScreen from "screens/NotFoundScreen";
import HomeScreen from "screens/Tenant/HomeScreen";
import TaskScreen from "screens/Tenant/TaskScreen";
import ChatScreen from "screens/Tenant/ChatScreen";
import CalendarScreen from "screens/Tenant/CalendarScreen";
import { useAppDispatch } from "hooks/typedHooks";
import { useEffect } from "react";
import { fetchData } from "reduxStates/firebaseListener";

import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "types";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch<any>(fetchData());
  }, []);

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<"TabOne">) => ({
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerLeft: () => <Text style={styles.logoText}>Roomr</Text>,
          headerRight: () => (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <Pressable
                onPress={() => navigation.navigate("Modal")}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Feather
                  name="settings"
                  size={25}
                  color={Colors[colorScheme].text}
                  style={{ marginRight: 15 }}
                />
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("Modal")}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Feather
                  name="bell"
                  size={25}
                  color={Colors[colorScheme].text}
                  style={{ marginRight: 15 }}
                />
              </Pressable>
            </View>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TaskScreen}
        options={{
          title: "Tasks",
          headerLeft: () => <Text style={styles.logoText}>Roomr</Text>,
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabThree"
        component={ChatScreen}
        options={{
          title: "Chat",
          headerLeft: () => <Text style={styles.logoText}>Roomr</Text>,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="message-square" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="TabFour"
        component={CalendarScreen}
        options={{
          title: "Calendar",
          headerLeft: () => <Text style={styles.logoText}>Roomr</Text>,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
}) {
  return <Feather size={25} style={{ marginBottom: -3 }} {...props} />;
}

const styles = StyleSheet.create({
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
});
