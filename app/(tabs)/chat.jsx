import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Pressable } from "react-native";
import { ArrowLeft, Send } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Link } from "expo-router";

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState([
    { id: "1", text: "Hello 👋", sender: "other" },
    { id: "2", text: "Hey, how are you?", sender: "me" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: input, sender: "me" }]);
      setInput("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Link href='/teams'>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={22} color="black" />
        </Pressable>
        </Link>
        <Text style={styles.title}>{name}</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === "me" ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text style={{ color: item.sender === "me" ? "white" : "black" }}>
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={{ padding: 15 }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Send size={22} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "700", marginLeft: 10 },
  message: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: "#FF4749",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#FF4749",
    padding: 10,
    borderRadius: 20,
  },
});
