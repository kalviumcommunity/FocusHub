import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

export default function HelloWave() {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: -1, duration: 500, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [rotate]);

  const rotation = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-15deg", "15deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <Text style={styles.wave}>👋</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wave: {
    fontSize: 30,
  },
});
