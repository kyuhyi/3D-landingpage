import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // 상위 폴더의 다른 lockfile 때문에 워크스페이스 루트가 잘못 추론되는 것을 막는다.
  turbopack: { root: __dirname },
};

export default nextConfig;
