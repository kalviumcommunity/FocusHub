// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import LoadingScreen from "./loadingscreen";
import OnboardingScreen from "./onboardingscreen";
import SignInScreen from "./signin";
import SignUpScreen from "./signup";

const Stack = createNativeStackNavigator();

export default function App() {
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
        setTimeout(() => setIsLoading(false), 1000); // small delay for loading screen
      }
    };
    checkFirstLaunch();
  }, []);

  if (isLoading || isFirstLaunch === null) {
    return <LoadingScreen />; // show loading until we know
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          // First time → Onboarding
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          // Otherwise → go straight to Signin
          <Stack.Screen name="Signin" component={SignInScreen} />
        )}

        {/* Auth Screens */}
        <Stack.Screen name="Signup" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
