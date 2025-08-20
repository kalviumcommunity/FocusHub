import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { IconSymbol } from "./IconSymbol";

export default function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            <IconSymbol
              name={options.tabBarIcon || "house.fill"}
              size={26}
              color={isFocused ? "tomato" : "gray"}
            />
            <Text style={{ color: isFocused ? "tomato" : "gray" }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    alignItems: "center",
  },
});
