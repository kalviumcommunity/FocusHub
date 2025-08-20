import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(localStorage.getItem("hasLaunched") === null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          // await AsyncStorage.setItem("hasLaunched", "true");
        } else {
          setIsFirstLaunch(false);
        }
      } catch (e) {
        setIsFirstLaunch(false);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    checkFirstLaunch();
  }, []);

  if (isLoading || isFirstLaunch === null) return <LoadingScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Onboarding only first time */}
      {isFirstLaunch  && (
        <Stack.Screen name="onboardingscreen"  />
      ) }

      {/* Auth Routes */}
      {/* <Stack.Screen name="signin" component={signin}/>
      <Stack.Screen name="signup" component={signup} /> */}
    </Stack>
  );
}
