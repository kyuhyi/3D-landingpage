import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BSD BOT — 3D Product Experience",
  description: "BSD BOT의 디스플레이, 볼륨 노브, 키캡 LED와 내부 구조를 3D로 살펴보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
