// maintabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screens
import HomeScreen from "./(tabs)/home";
import TasksScreen from "./(tabs)/tasks";
import TeamScreen from "./(tabs)/teams";
import NotesScreen from "./(tabs)/reports";
import ProfileScreen from "./(tabs)/profile";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 15,
          left: 20,
          right: 20,
          backgroundColor: "white",
          borderRadius: 20,
          height: 70,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Tasks") iconName = focused ? "list" : "list-outline";
          else if (route.name === "Team") iconName = focused ? "people" : "people-outline";
          else if (route.name === "Notes") iconName = focused ? "document-text" : "document-text-outline";
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName} size={26} color={focused ? "#FF4749" : "gray"} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
