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
  TextInput
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

import { useAppStore } from "../store/useAppStore";

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState("Chats");
  const router = useRouter();

  // Global State Connect
  const { chats, groups, addChat, addGroup } = useAppStore();

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dataToRender = (activeTab === "Chats" ? chats : groups).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    if (!newName.trim()) return;

    if (activeTab === "Chats") {
      addChat({
        id: `chat_${Date.now()}`,
        isGroup: false,
        name: newName,
        number: newNumber || "Unknown",
        status: "online",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}`,
        messages: []
      });
    } else {
      addGroup({
        id: `group_${Date.now()}`,
        isGroup: true,
        name: newName,
        description: "New Group",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random`,
        members: ["Me", "Andrew"], // Sample generic members 
        messages: []
      });
    }

    setNewName("");
    setNewNumber("");
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {!isSearching ? (
        <View style={styles.header}>
          <RefreshCcw size={22} color="#FF4749" />
          <Text style={styles.headerTitle}>Teams</Text>
          <View style={styles.headerIcons}>
            <Pressable onPress={() => setIsSearching(true)} style={{ marginRight: 15 }}>
              <Search size={22} color="black" />
            </Pressable>
            <MoreVertical size={22} color="black" />
          </View>
        </View>
      ) : (
        <View style={[styles.header, { backgroundColor: "white", padding: 10, borderRadius: 10 }]}>
          <TextInput
            style={{ flex: 1, fontSize: 16 }}
            placeholder="Search teams & chats..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          <Pressable onPress={() => { setIsSearching(false); setSearchQuery(""); }}>
            <Text style={{ color: "gray", fontWeight: "600", marginLeft: 10 }}>Cancel</Text>
          </Pressable>
        </View>
      )}

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
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Action Button */}
      <Pressable style={styles.addButton} onPress={() => setShowModal(true)}>
        <Plus size={26} color="white" />
      </Pressable>

      {/* ✅ Add Chat / Group Modal */}
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {activeTab === "Chats" ? "Add New Chat" : "Create New Group"}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{activeTab === "Chats" ? "Contact Name" : "Group Name"}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={activeTab === "Chats" ? "e.g. Michael Scott" : "e.g. Design Team"}
                value={newName}
                onChangeText={setNewName}
              />
            </View>

            {activeTab === "Chats" && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number / Email</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 555-1234"
                  value={newNumber}
                  onChangeText={setNewNumber}
                  keyboardType="phone-pad"
                />
              </View>
            )}

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitButton} onPress={handleAddNew}>
                <Text style={styles.submitText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ✅ Bottom Navigation */}
      <BottomNav currentTab="Teams" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 15, paddingTop: 40 },
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
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20, color: "#222" },
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "gray", marginBottom: 5 },
  modalInput: {
    borderWidth: 1, borderColor: "#ddd",
    borderRadius: 10, padding: 12,
    fontSize: 15, backgroundColor: "#FAFAFA"
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginRight: 10 },
  cancelText: { color: "gray", fontWeight: "600", fontSize: 15 },
  submitButton: { backgroundColor: "#FF4749", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  submitText: { color: "white", fontWeight: "600", fontSize: 15 }
});
