import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mofit.app",
  appName: "모핏",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
