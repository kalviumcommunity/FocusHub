import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Send, MoreVertical, Phone, Video } from "lucide-react-native";
import { useAppStore } from "./store/useAppStore";
import * as Notifications from 'expo-notifications';

// Configure how notifications hit when the app is foregrounded
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function ChatScreen() {
    const router = useRouter();
    const { id, name } = useLocalSearchParams();
    const flatListRef = useRef();

    // Zustand Store
    const { user, chats, groups, addMessageToThread } = useAppStore();
    const [inputText, setInputText] = useState("");

    // Determine if it's a chat or a group by searching both buckets
    const isGroup = id?.startsWith("group_");
    const threadData = isGroup
        ? groups.find((g) => g.id === id)
        : chats.find((c) => c.id === id);

    const messages = threadData?.messages || [];

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const newMessage = {
            _id: Date.now().toString(),
            text: inputText,
            createdAt: new Date().toISOString(),
            user: { _id: "me", name: user.name.split(" ")[0] }
        };

        // 1. Dispatch to global store
        addMessageToThread(id, newMessage, isGroup);
        setInputText("");

        // 2. Simulate an incoming reply via Expo Notifications after 2 seconds
        setTimeout(async () => {
            const replyMsg = {
                _id: Date.now().toString() + "reply",
                text: isGroup ? "Sounds like a plan to me!" : "Got it! Thanks for letting me know.",
                createdAt: new Date().toISOString(),
                user: { _id: "peer", name: isGroup ? "Steve" : name }
            };

            addMessageToThread(id, replyMsg, isGroup);

            // Trigger Push Notification natively
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: `New message from ${isGroup ? "Group: " + name : name}`,
                    body: replyMsg.text,
                    data: { url: `/chat?id=${id}&name=${encodeURIComponent(name)}` },
                },
                trigger: null, // trigger immediately
            });

        }, 2500);
    };

    const renderMessage = ({ item }) => {
        const isMe = item.user._id === "me";
        return (
            <View style={[styles.msgContainer, isMe ? styles.msgRight : styles.msgLeft]}>
                {!isMe && isGroup && <Text style={styles.senderName}>{item.user.name}</Text>}
                <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
                    <Text style={[styles.msgText, isMe && { color: "white" }]}>{item.text}</Text>
                </View>
                <Text style={styles.timestamp}>
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    if (!threadData) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Chat not found.</Text>
                <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: "blue" }}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable onPress={() => router.back()} style={{ marginRight: 15 }}>
                        <ChevronLeft size={28} color="#222" />
                    </Pressable>
                    <View>
                        <Text style={styles.headerName}>{name}</Text>
                        <Text style={styles.headerStatus}>{isGroup ? `${threadData.members?.length} members` : threadData.status}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", gap: 15 }}>
                    {!isGroup && <Video size={22} color="#555" />}
                    {!isGroup && <Phone size={22} color="#555" />}
                    <MoreVertical size={22} color="#555" />
                </View>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={[...messages].reverse()} // Reverse because flatlist inverted=true natively handles anchoring better
                keyExtractor={(item) => item._id}
                renderItem={renderMessage}
                inverted // Messages start at bottom
                contentContainerStyle={{ padding: 15 }}
            />

            {/* Input */}
            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <Pressable
                    style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]}
                    onPress={handleSendMessage}
                    disabled={!inputText.trim()}
                >
                    <Send size={20} color="white" style={{ marginLeft: 2 }} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAFAFA" },
    header: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20,
        backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#eee"
    },
    headerName: { fontSize: 18, fontWeight: "700", color: "#222" },
    headerStatus: { fontSize: 13, color: "#FF4749" },

    msgContainer: { marginVertical: 5, maxWidth: "80%" },
    msgLeft: { alignSelf: "flex-start" },
    msgRight: { alignSelf: "flex-end", alignItems: "flex-end" },

    senderName: { fontSize: 11, color: "gray", marginBottom: 2, marginLeft: 5 },
    bubble: { padding: 12, borderRadius: 16 },
    bubbleLeft: { backgroundColor: "white", borderTopLeftRadius: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    bubbleRight: { backgroundColor: "#FF4749", borderTopRightRadius: 4 },

    msgText: { fontSize: 15, color: "#333", lineHeight: 22 },
    timestamp: { fontSize: 10, color: "gray", marginTop: 4, alignSelf: "flex-end" },

    inputArea: {
        flexDirection: "row", alignItems: "center",
        padding: 15, paddingBottom: Platform.OS === "ios" ? 30 : 15,
        backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#eee"
    },
    input: {
        flex: 1, backgroundColor: "#F5F5F5", borderRadius: 20,
        paddingHorizontal: 15, paddingTop: 12, paddingBottom: 12,
        fontSize: 15, maxHeight: 100
    },
    sendBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: "#FF4749", justifyContent: "center", alignItems: "center",
        marginLeft: 10
    }
});
