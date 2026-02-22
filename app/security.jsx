import React from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, ShieldCheck } from "lucide-react-native";
import { useAppStore } from "./store/useAppStore";

export default function SecurityScreen() {
    const router = useRouter();
    const { user } = useAppStore();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={{ padding: 10 }}>
                    <ChevronLeft size={24} color="#222" />
                </Pressable>
                <Text style={styles.headerTitle}>Account & Security</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.card}>
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                    <ShieldCheck size={40} color="#FF4749" />
                    <Text style={{ marginTop: 10, fontWeight: "600", fontSize: 16 }}>Secure Account</Text>
                    <Text style={{ color: "gray", fontSize: 13, marginTop: 4 }}>{user.email}</Text>
                </View>

                <Text style={styles.label}>Change Password</Text>
                <TextInput style={styles.input} placeholder="Current Password" secureTextEntry />
                <TextInput style={styles.input} placeholder="New Password" secureTextEntry />

                <Pressable style={styles.saveBtn} onPress={() => router.back()}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Update Security</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20, paddingTop: 60 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
    headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
    card: { backgroundColor: "white", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
    label: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 10 },
    input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 10, marginBottom: 15 },
    saveBtn: { backgroundColor: "#FF4749", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 }
});
