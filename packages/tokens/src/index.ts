export const themeTokens = {
  background: "#0F3D2E",
  backgroundDark: "#0A2C21",
  primary: "#8EE38A",
  secondary: "#CFF7D3",
  textPrimary: "#F3FFF1",
  textSecondary: "rgba(243,255,241,0.68)",
  mutedBlock: "rgba(255,255,255,0.08)"
} as const;

export type ThemeTokens = typeof themeTokens;
