import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Mail, Globe } from "lucide-react-native";

export default function HelpSupportScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={{ padding: 10 }}>
                    <ChevronLeft size={24} color="#222" />
                </Pressable>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>How can we help?</Text>
                <Text style={styles.subtitle}>If you're experiencing issues, please reach out to our team.</Text>

                <Pressable style={styles.btn} onPress={() => Linking.openURL('mailto:support@productivity.com')}>
                    <Mail size={20} color="#FF4749" style={{ marginRight: 15 }} />
                    <Text style={styles.btnText}>Email Support</Text>
                </Pressable>

                <Pressable style={styles.btn} onPress={() => Linking.openURL('https://google.com')}>
                    <Globe size={20} color="#FF4749" style={{ marginRight: 15 }} />
                    <Text style={styles.btnText}>Visit Help Center</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20, paddingTop: 60 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
    headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
    card: { backgroundColor: "white", borderRadius: 16, padding: 25, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3, alignItems: "center" },
    title: { fontSize: 18, fontWeight: "700", marginBottom: 5 },
    subtitle: { fontSize: 14, color: "gray", textAlign: "center", marginBottom: 25 },
    btn: { flexDirection: "row", width: "100%", alignItems: "center", padding: 15, backgroundColor: "#FFE5E5", borderRadius: 12, marginBottom: 15 },
    btnText: { fontSize: 16, fontWeight: "600", color: "#FF4749" }
});
