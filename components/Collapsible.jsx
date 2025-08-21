import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginVertical: 8 }}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text style={{ fontWeight: "bold" }}>{title}</Text>
      </TouchableOpacity>
      {open && <View>{children}</View>}
    </View>
  );
}
