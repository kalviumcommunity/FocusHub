import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter,Link } from "expo-router";

export default function Notifications() {
  const router = useRouter();

  const [taskReminders, setTaskReminders] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Link href='/profile'>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      </Link>

      <Text style={styles.title}>Notifications</Text>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Task Reminders</Text>
        <Switch value={taskReminders} onValueChange={setTaskReminders} />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Email Updates</Text>
        <Switch value={emailUpdates} onValueChange={setEmailUpdates} />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Push Alerts</Text>
        <Switch value={pushAlerts} onValueChange={setPushAlerts} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16 // iOS-style blue
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
  },
});
