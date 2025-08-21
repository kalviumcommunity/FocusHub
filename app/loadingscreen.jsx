import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/onboardingscreen");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Image Logo */}
      <Image
        source={require("../assets/images/Frame_7-removebg-preview.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Spinner */}
      <ActivityIndicator size="large" color="#B22222" style={{ marginTop: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },
});
