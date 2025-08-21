import { useEffect, useState } from "react";

/**
 * Web-specific hook for detecting system color scheme (light or dark).
 * Falls back to "light" if not supported.
 */
export function useColorScheme() {
  const getScheme = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [colorScheme, setColorScheme] = useState(getScheme);

  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => setColorScheme(getScheme());

    if (matcher.addEventListener) {
      matcher.addEventListener("change", listener);
    } else {
      matcher.addListener(listener); // fallback for older browsers
    }

    return () => {
      if (matcher.removeEventListener) {
        matcher.removeEventListener("change", listener);
      } else {
        matcher.removeListener(listener);
      }
    };
  }, []);

  return colorScheme || "light";
}
