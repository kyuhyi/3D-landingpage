"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Capacitor?: { isNativePlatform?: () => boolean };
  }
}

// 브라우저 PWA 설치용 서비스워커 등록.
// 네이티브 앱(Capacitor) 안에서는 에셋이 이미 번들되어 있으므로 등록하지 않는다.
export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    if (window.Capacitor?.isNativePlatform?.()) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // 오프라인 캐시는 선택 기능이므로 실패해도 페이지는 정상 동작한다.
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
