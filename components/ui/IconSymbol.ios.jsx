import { Text } from "react-native";

export function IconSymbol({ name, size = 24, color = "black", style }) {
  return (
    <Text
      style={[
        {
          fontFamily: "MaterialIcons", // or any icon font you’re using
          fontSize: size,
          color: color,
        },
        style,
      ]}
    >
      {name}
    </Text>
  );
}
