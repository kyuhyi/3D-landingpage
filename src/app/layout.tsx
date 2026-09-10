import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "./register-service-worker";

export const metadata: Metadata = {
  title: "BSD BOT — 3D Product Experience",
  description: "BSD BOT의 디스플레이, 볼륨 노브, 키캡 LED와 내부 구조를 3D로 살펴보세요.",
  applicationName: "BSD BOT",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "BSD BOT",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

// 모바일 앱 화면: 노치·제스처 바 영역까지 채우고 세이프에어리어는 CSS env()로 처리한다.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
