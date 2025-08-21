import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../loadingscreen"; // make sure this file exists

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");

        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("hasLaunched", "true");
        } else {
          setIsFirstLaunch(false);
        }
      } catch (e) {
        setIsFirstLaunch(false);
      } finally {
        setTimeout(() => setIsLoading(false), 800); // little delay for smooth UX
      }
    };
    checkFirstLaunch();
  }, []);

  if (isLoading || isFirstLaunch === null) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Onboarding / Auth flow */}
      {isFirstLaunch ? (
        <Stack.Screen name="signin" />
      ) : (
        <Stack.Screen name="maintabs" /> // main tabs with home, profile, etc.
      )}
    </Stack>
  );
}
