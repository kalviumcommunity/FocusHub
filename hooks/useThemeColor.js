import Colors from "../constants/Colors";
import { useColorScheme } from "./useColorScheme";

/**
 * Returns themed color based on current scheme.
 * 
 * Example:
 *   const color = useThemeColor("text");
 */
export function useThemeColor(colorName) {
  const theme = useColorScheme();
  return Colors[theme][colorName];
}
