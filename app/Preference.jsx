import React from "react";
import { View, Text, StyleSheet, Pressable, Switch } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useAppStore } from "./store/useAppStore";

export default function PreferenceScreen() {
    const router = useRouter();
    const { user, updateUser } = useAppStore();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={{ padding: 10 }}>
                    <ChevronLeft size={24} color="#222" />
                </Pressable>
                <Text style={styles.headerTitle}>Preferences</Text>
                <View style={{ width: 44 }} />
            </View>

            {/* Settings List */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>App Settings</Text>

                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Dark Mode</Text>
                    <Switch
                        value={user.preferences?.darkMode || false}
                        onValueChange={(val) => updateUser({ preferences: { ...user.preferences, darkMode: val } })}
                        trackColor={{ false: "#ddd", true: "#FF4749" }}
                    />
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Enable Notifications</Text>
                    <Switch
                        value={user.preferences?.notificationsEnabled || false}
                        onValueChange={(val) => updateUser({ preferences: { ...user.preferences, notificationsEnabled: val } })}
                        trackColor={{ false: "#ddd", true: "#FF4749" }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20, paddingTop: 60 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
    headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
    card: { backgroundColor: "white", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
    sectionTitle: { fontSize: 13, fontWeight: "700", color: "gray", textTransform: "uppercase", marginBottom: 20 },
    settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
    settingLabel: { fontSize: 16, color: "#222", fontWeight: "500" }
});
