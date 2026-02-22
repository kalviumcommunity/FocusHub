import React from "react";
import { View, Text, StyleSheet, Pressable, Switch } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function NotificationScreen() {
    const router = useRouter();
    const [pushEnabled, setPushEnabled] = React.useState(true);
    const [emailEnabled, setEmailEnabled] = React.useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={{ padding: 10 }}>
                    <ChevronLeft size={24} color="#222" />
                </Pressable>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.card}>
                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Push Notifications</Text>
                    <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ false: "#ddd", true: "#FF4749" }} />
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Email Summaries</Text>
                    <Switch value={emailEnabled} onValueChange={setEmailEnabled} trackColor={{ false: "#ddd", true: "#FF4749" }} />
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
    settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
    settingLabel: { fontSize: 16, color: "#222", fontWeight: "500" }
});
