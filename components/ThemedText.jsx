import React from "react";
import { Text } from "react-native";

export default function ThemedText({ children, style, lightColor = "#000", darkColor = "#fff", isDark = false }) {
  return (
    <Text style={[{ color: isDark ? darkColor : lightColor }, style]}>
      {children}
    </Text>
  );
}
