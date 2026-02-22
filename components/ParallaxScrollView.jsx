import React from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";

export default function ParallaxScrollView({ children, backgroundImage }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {backgroundImage && (
        <Image source={backgroundImage} style={styles.background} resizeMode="cover" />
      )}
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    width: "100%",
    height: 200,
    position: "absolute",
    top: 0,
  },
  content: {
    marginTop: 200,
    padding: 16,
  },
});
