import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function RootLayout() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '960111871354-o2o0q7neim7rfc04uq87pnjekfq8mhg6.apps.googleusercontent.com',
    });

    async function requestPermissions() {
      try {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          const { status } = await Notifications.getPermissionsAsync();
          if (status !== "granted") {
            await Notifications.requestPermissionsAsync();
          }
        }
      } catch (err) {
        console.log("Notification permission error:", err);
      }
    }
    requestPermissions();
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboardingscreen" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
