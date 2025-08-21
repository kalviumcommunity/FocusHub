import React from "react";
import { Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

export default function HapticTab({ children, onPress, style }) {
  const handlePress = async () => {
    await Haptics.selectionAsync();
    if (onPress) onPress();
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.tab, style, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: {
    padding: 10,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});
