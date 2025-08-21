import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  Plus,
  RefreshCcw,
  Search,
  MoreVertical,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import BottomNav from "../bottomnav";

// ✅ Dummy API
const fakeApi = {
  getTeams: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            _id: "1",
            name: "React Avengers",
            description: "Frontend Superheroes",
            createdBy: { name: "Tony Stark", email: "tony@avengers.com" },
            members: [
              { userId: { name: "Tony Stark", email: "tony@avengers.com" }, role: "Manager" },
              { userId: { name: "Steve Rogers", email: "steve@avengers.com" }, role: "Member" },
            ],
          },
          {
            _id: "2",
            name: "Kalvium Gangsters",
            description: "Learning + Building",
            createdBy: { name: "Peter Parker", email: "peter@kalvium.com" },
            members: [
              { userId: { name: "Peter Parker", email: "peter@kalvium.com" }, role: "Manager" },
              { userId: { name: "MJ Watson", email: "mj@kalvium.com" }, role: "Member" },
            ],
          },
        ]);
      }, 1000);
    });
  },
};

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState("Chats");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fakeApi.getTeams().then((data) => {
      setTeams(data);
      setLoading(false);
    });
  }, []);

  const chats = [
    {
      id: "1",
      name: "John Doe",
      status: "online",
      avatar: "https://ui-avatars.com/api/?name=John+Doe",
    },
    {
      id: "2",
      name: "Andrew",
      status: "Last Seen Yesterday",
      avatar: "https://ui-avatars.com/api/?name=Andrew&background=random",
    },
  ];

  const dataToRender = activeTab === "Chats" ? chats : teams;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF4749" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <RefreshCcw size={22} color="#FF4749" />
        <Text style={styles.headerTitle}>Teams</Text>
        <View style={styles.headerIcons}>
          <Search size={22} color="black" style={{ marginRight: 15 }} />
          <MoreVertical size={22} color="black" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "Chats" && styles.activeTab]}
          onPress={() => setActiveTab("Chats")}
        >
          <Text style={[styles.tabText, activeTab === "Chats" && styles.activeTabText]}>
            Chats
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === "Groups" && styles.activeTab]}
          onPress={() => setActiveTab("Groups")}
        >
          <Text style={[styles.tabText, activeTab === "Groups" && styles.activeTabText]}>
            Groups
          </Text>
        </Pressable>
      </View>

      {/* Chat/Group List */}
      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <View style={styles.chatCard}>
            <Image
              source={{
                uri:
                  item.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}`,
              }}
              style={styles.avatar}
            />
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.offlineStatus}>
                {item.status || `${item.members?.length || 0} members`}
              </Text>
            </View>
            <Link href='/chat'>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/chat",
                  params: { id: item._id || item.id, name: item.name },
                })
              }
            >
              <ChevronRight size={22} color="gray" />
            </Pressable>
            </Link>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Action Button */}
      <Pressable style={styles.addButton}>
        <Plus size={26} color="white" />
      </Pressable>

      {/* ✅ Bottom Navigation */}
      <BottomNav currentTab="Teams" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 15 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  headerIcons: { flexDirection: "row" },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 15,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  activeTab: { backgroundColor: "#FF4749" },
  tabText: { fontSize: 15, fontWeight: "600", color: "gray" },
  activeTabText: { color: "white" },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  chatInfo: { flex: 1, marginLeft: 12 },
  chatName: { fontWeight: "600", fontSize: 16, color: "#222" },
  offlineStatus: { fontSize: 13, color: "gray" },
  addButton: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: "#FF4749",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
