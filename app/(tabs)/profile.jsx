import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react-native";
import BottomNav from "../bottomnav";
import { useAppStore } from "../store/useAppStore";

const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAppStore();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        {/* Menu Section */}
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/Preference")}
          >
            <Settings size={20} color="#555" style={styles.menuIconSpacing} />
            <Text style={styles.menuText}>Preferences</Text>
            <ChevronRight size={18} color="lightgray" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/security")}
          >
            <Shield size={20} color="#555" style={styles.menuIconSpacing} />
            <Text style={styles.menuText}>Account & Security</Text>
            <ChevronRight size={18} color="lightgray" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/notification")}
          >
            <Bell size={20} color="#555" style={styles.menuIconSpacing} />
            <Text style={styles.menuText}>Notifications</Text>
            <ChevronRight size={18} color="lightgray" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => router.push("/helpsupport")}
          >
            <HelpCircle size={20} color="#555" style={styles.menuIconSpacing} />
            <Text style={styles.menuText}>Help & Support</Text>
            <ChevronRight size={18} color="lightgray" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace("/signin")}
        >
          <LogOut size={20} color="#E57373" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ✅ Shared BottomNav */}
      <BottomNav currentTab="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },

  profileCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    marginRight: 15,
  },
  avatarImage: { width: 60, height: 60, borderRadius: 30 },
  name: { fontWeight: "bold", fontSize: 18, color: "#222" },
  email: { fontSize: 13, color: "gray", marginTop: 4 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "gray",
    marginBottom: 10,
    marginLeft: 5,
    textTransform: "uppercase"
  },
  menuGroup: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 5,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIconSpacing: { marginRight: 15 },
  menuText: { fontSize: 15, fontWeight: "500", color: "#333" },

  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoutText: { color: "#E57373", fontWeight: "700", fontSize: 16 },
});

export default ProfileScreen;
