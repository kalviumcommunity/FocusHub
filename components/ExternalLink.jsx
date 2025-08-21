import { Linking, Text, TouchableOpacity } from "react-native";

export default function ExternalLink({ url, children }) {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(url)}>
      <Text style={{ color: "blue" }}>{children}</Text>
    </TouchableOpacity>
  );
}
