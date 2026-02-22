import React from "react";
import { View, StyleSheet } from "react-native";

export default function ThemedView({ children, style, lightColor = "#fff", darkColor = "#000", isDark = false }) {
  return (
    <View style={[styles.container, { backgroundColor: isDark ? darkColor : lightColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
