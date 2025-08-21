// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

/**
 * Mapping between SF Symbols (iOS) and Material Icons (Android/web).
 * Update this map if you need more icons.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
};

/**
 * An icon component that uses SF Symbol names for consistency,
 * but renders MaterialIcons underneath (cross-platform).
 */
export function IconSymbol({ name, size = 24, color = "black", style }) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
