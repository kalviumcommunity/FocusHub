import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
      <Tabs.Screen
        name="home"
        options={{ title: "Home" }}
      />
      {/* You can define other tab screens like tasks, profile, here if needed */}
    </Tabs>
  );
}
