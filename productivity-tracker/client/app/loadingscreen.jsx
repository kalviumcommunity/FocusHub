import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate loading, then navigate to Onboarding
    const timer = setTimeout(() => {
      router.push("/onboardingscreen"); // or router.push("/onboarding")
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* App Logo Text */}
      <View style={styles.logoContainer}>
        <Text style={styles.text}>
          F
          <MaterialIcons name="refresh" size={28} color="#B22222" />
          CUS
        </Text>
        <Text style={styles.text}>HUB</Text>
      </View>

      {/* Spinner */}
      <ActivityIndicator
        size="large"
        color="#B22222"
        style={{ marginTop: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // white background
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#B22222", // dark red
    letterSpacing: 2,
  },
});
