import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    localStorage.setItem("hasLaunched", "true");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>Let’s get started with FocusHub!</Text>

      <View style={styles.buttonsWrapper}>
        <Link href="/signin" style={styles.link}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              hoveredButton === "signin" && styles.hoverButton,
              pressed && styles.pressedButton,
            ]}
            onHoverIn={() => setHoveredButton("signin")}
            onHoverOut={() => setHoveredButton(null)}
          >
            <Text
              style={[
                styles.buttonText,
                hoveredButton === "signin" && styles.hoverText,
              ]}
            >
              Sign In
            </Text>
          </Pressable>
        </Link>

        <Link href="/signup" style={styles.link}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              hoveredButton === "signup" && styles.hoverButton,
              pressed && styles.pressedButton,
            ]}
            onHoverIn={() => setHoveredButton("signup")}
            onHoverOut={() => setHoveredButton(null)}
          >
            <Text
              style={[
                styles.buttonText,
                hoveredButton === "signup" && styles.hoverText,
              ]}
            >
              Sign Up
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: width > 500 ? 32 : 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: width > 500 ? 18 : 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 32,
  },
  buttonsWrapper: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  link: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: width > 500 ? "50%" : "90%",
    paddingVertical: width > 500 ? 16 : 14,
    borderRadius: 10,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
  },
  hoverButton: {
    backgroundColor: "#FF4749",
  },
  pressedButton: {
    opacity: 0.9,
  },
  buttonText: {
    color: "#FF4749",
    fontWeight: "bold",
    fontSize: width > 500 ? 18 : 16,
  },
  hoverText: {
    color: "#fff",
  },
});
