import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import BottomNav from "../bottomnav"; // ✅ Importing common BottomNav
import { Link } from "expo-router";
const ProfileScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.refreshIcon}>⟳</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatarImage}
          />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.name}>Ron Weasly</Text>
          <Text style={styles.email}>ronweasly@gmail.com</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <Link href='/Preference'>
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => router.push("/Preference")}
  >
    <Text style={styles.menuIconSmall}>⚙️</Text>
    <Text style={styles.menuText}>Preferences</Text>
  </TouchableOpacity>
</Link>

<Link href='/security'>
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => router.push("/security")}
  >
    <Text style={styles.menuIconSmall}>🛡️</Text>
    <Text style={styles.menuText}>Account & Security</Text>
  </TouchableOpacity>
</Link>

<Link href='/notification'>
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => router.push("/notification")}
  >
    <Text style={styles.menuIconSmall}>🔔</Text>
    <Text style={styles.menuText}>Notification</Text>
  </TouchableOpacity>
</Link>

<Link href='/helpsupport'>
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => router.push("/helpsupport")}
  >
    <Text style={styles.menuIconSmall}>❓</Text>
    <Text style={styles.menuText}>Help & Support</Text>
  </TouchableOpacity>
</Link>

      </View>

      {/* Logout */}
      <Link href='/signin'>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.replace("/signin")} // ✅ replace so user can’t go back
      >
        <Text style={styles.logoutText}>Signout</Text>
      </TouchableOpacity>
      </Link>

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  refreshIcon: { fontSize: 20 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  menuIcon: { fontSize: 20 },

  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#A4C2F4",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarImage: { width: 40, height: 40, borderRadius: 20 },
  name: { fontWeight: "bold", fontSize: 16 },
  email: { fontSize: 12, color: "#999" },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuIconSmall: { fontSize: 18, marginRight: 10 },
  menuText: { fontSize: 14 },

  logoutBtn: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 80, // 👈 leaves space above BottomNav
  },
  logoutText: { color: "#E57373", fontWeight: "500" },
});

export default ProfileScreen;
