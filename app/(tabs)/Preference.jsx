import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter,Link } from "expo-router"; // ✅ Import router for navigation

export default function Preferences() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const router = useRouter(); // ✅ Initialize router

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Link href='/profile'>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      </Link>

      <Text style={styles.title}>Preferences</Text>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Auto Sync Data</Text>
        <Switch value={autoSync} onValueChange={setAutoSync} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16 // iOS-style blue
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: { fontSize: 16 },
});
