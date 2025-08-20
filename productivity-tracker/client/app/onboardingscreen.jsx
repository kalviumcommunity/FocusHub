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

  {/* Add a wrapper view to control buttons spacing */}
  <View style={styles.buttonsWrapper}>
    {/* Sign In Button */}
    <Link href="/signin" style={{ width: "100%" }}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.defaultButton,
          hoveredButton === "signin" && styles.hoverButton,
          pressed && styles.pressedButton,
        ]}
        onHoverIn={() => setHoveredButton("signin")}
        onHoverOut={() => setHoveredButton(null)}
      >
        <Text
          style={[
            styles.defaultText,
            hoveredButton === "signin" && styles.hoverText,
          ]}
        >
          Sign In
        </Text>
      </Pressable>
    </Link>

    {/* Sign Up Button */}
    <Link href="/signup" style={{ width: "100%" }}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.defaultButton,
          hoveredButton === "signup" && styles.hoverButton,
          pressed && styles.pressedButton,
        ]}
        onHoverIn={() => setHoveredButton("signup")}
        onHoverOut={() => setHoveredButton(null)}
      >
        <Text
          style={[
            styles.defaultText,
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

// ... your styles remain the same


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: width > 500 ? 32 : 24, // bigger font for large screens
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginVertical: 10,
    fontSize: width > 500 ? 20 : 16, // responsive font
    textAlign: "center",
  },
  button: {
    width: width > 500 ? "50%" : "80%", // smaller buttons on big screens
    padding: width > 500 ? 16 : 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  defaultButton: {
    backgroundColor: "#FFF0F0", // normal button background
  },
  hoverButton: {
    backgroundColor: "#FF4749", // background on hover
  },
  pressedButton: {
    opacity: 0.8,
  },
  defaultText: {
    color: "#FF4749", // normal text color
    fontWeight: "bold",
    fontSize: width > 500 ? 18 : 16, // responsive font
  },
  hoverText: {
    color: "white", // text color on hover
  },
});
