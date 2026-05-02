// HappyHour Austin - Live Oak palette
// Change colors here - they update across the entire app
//
// HOW TO USE:
//   import { theme } from "../theme";
//   style={{ background: theme.bg, color: theme.text }}
//
// HOW TO CHANGE COLORS:
//   Edit any hex code below. Save. The whole app updates.

export const theme = {
  // Backgrounds
  bg: "#0F1410", // Deep ranch dirt - main background
  surface: "#1A201A", // Slightly lighter - cards, inputs, hover states
  surfaceHover: "#222A22", // Even lighter - hover

  // Brand
  primary: "#C9683A", // Copper - CTAs, active pills, gold replacement
  primaryDark: "#2E1408", // Dark brown - text on copper buttons
  primaryAlpha10: "rgba(201,104,58,0.10)",
  primaryAlpha20: "rgba(201,104,58,0.20)",
  primaryAlpha30: "rgba(201,104,58,0.30)",

  // Status / Live
  live: "#8FB996", // Sage - "Live Now", success
  liveDark: "#1A2E1F", // Dark sage - text on sage buttons
  liveAlpha15: "rgba(143,185,150,0.15)",
  liveAlpha25: "rgba(143,185,150,0.25)",
  liveAlpha35: "rgba(143,185,150,0.35)",

  // Status / Soon (uses primary)
  soon: "#C9683A",
  ended: "#666",

  // Text
  text: "#F0E9D6", // Warm cream - main text
  textMuted: "#B8C0B0", // Muted cream-sage
  textDim: "#8A9485", // Muted sage-gray
  textFaint: "#5F6960", // Very dim
  textGhost: "#3A423B", // Almost invisible

  // Borders
  border: "rgba(201,104,58,0.10)", // Faint copper
  borderMid: "rgba(201,104,58,0.20)", // Mid copper
  borderStrong: "rgba(201,104,58,0.35)", // Strong copper

  // Error / danger
  error: "#E24B4A",
  errorBg: "rgba(226,75,74,0.10)",
  errorBorder: "rgba(226,75,74,0.30)",
};
