import type { CapacitorConfig } from "@capacitor/cli";

// 정적 빌드(out/)를 앱에 번들해 오프라인에서도 3D 랜딩페이지가 그대로 동작한다.
const config: CapacitorConfig = {
  appId: "com.bsd.bot",
  appName: "BSD BOT",
  webDir: "out",
  backgroundColor: "#ffffff",
  android: {
    allowMixedContent: false,
    backgroundColor: "#ffffff",
  },
};

export default config;
