import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./loadingscreen";

export default function Index() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (e) {
        setIsFirstLaunch(false);
      } finally {
        setTimeout(() => setIsLoading(false), 2000);
      }
    };
    checkFirstLaunch();
  }, []);

  if (isLoading || isFirstLaunch === null) return <LoadingScreen />;

  if (isFirstLaunch) {
    return <Redirect href="/onboardingscreen" />;
  } else {
    return <Redirect href="/signin" />;
  }
}
