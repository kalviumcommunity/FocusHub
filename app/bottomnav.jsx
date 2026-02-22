import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";

export default function BottomNav({ currentTab }) {
  const [navTab, setNavTab] = useState(currentTab || "Home");

  const goTo = (tab, path) => {
    setNavTab(tab);
    router.replace(path); // ✅ always reset navigation
  };

  return (
    <View style={styles.bottomNav}>

      <Pressable style={styles.navItem} onPress={() => goTo("Teams", "/teams")}>
        <Ionicons
          name="people-outline"
          size={22}
          color={navTab === "Teams" ? "#FF4749" : "gray"}
        />
        <Text
          style={[
            styles.navText,
            { color: navTab === "Teams" ? "#FF4749" : "gray" },
          ]}
        >
          Teams
        </Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => goTo("Tasks", "/tasks")}>
        <Ionicons
          name="document-text-outline"
          size={22}
          color={navTab === "Tasks" ? "#FF4749" : "gray"}
        />
        <Text
          style={[
            styles.navText,
            { color: navTab === "Tasks" ? "#FF4749" : "gray" },
          ]}
        >
          Tasks
        </Text>
      </Pressable>


      <Pressable style={styles.navItem} onPress={() => goTo("Home", "/home")}>
        <Ionicons
          name="home"
          size={22}
          color={navTab === "Home" ? "#FF4749" : "gray"}
        />
        <Text
          style={[
            styles.navText,
            { color: navTab === "Home" ? "#FF4749" : "gray" },
          ]}
        >
          Home
        </Text>
      </Pressable>
      <Pressable
        style={styles.navItem}
        onPress={() => goTo("Reports", "/reports")}
      >
        <Ionicons
          name="stats-chart-outline"
          size={22}
          color={navTab === "Reports" ? "#FF4749" : "gray"}
        />
        <Text
          style={[
            styles.navText,
            { color: navTab === "Reports" ? "#FF4749" : "gray" },
          ]}
        >
          Reports
        </Text>
      </Pressable>

      <Pressable
        style={styles.navItem}
        onPress={() => goTo("Profile", "/profile")}
      >
        <Ionicons
          name="person-outline"
          size={22}
          color={navTab === "Profile" ? "#FF4749" : "gray"}
        />
        <Text
          style={[
            styles.navText,
            { color: navTab === "Profile" ? "#FF4749" : "gray" },
          ]}
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: { alignItems: "center", flex: 1 },
  navText: { fontSize: 12, marginTop: 2 },
});
