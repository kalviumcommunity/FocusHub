import { useColorScheme as _useColorScheme } from "react-native";

/**
 * Hook to get current color scheme (light or dark)
 * Fallbacks to "light" if unavailable
 */
export function useColorScheme() {
  return _useColorScheme() || "light";
}
