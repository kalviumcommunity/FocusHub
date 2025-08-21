import React from "react";
import { View, StyleSheet } from "react-native";
import { IconSymbol } from "./IconSymbol";

export default function TabBarIOS({ state, descriptors, navigation }) {
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
          <IconSymbol
            key={route.key}
            name={options.tabBarIcon || "house.fill"}
            size={28}
            color={isFocused ? "tomato" : "gray"}
            onPress={onPress}
            style={{ margin: 10 }}
          />
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
    paddingBottom: 10,
    paddingTop: 10,
  },
});
