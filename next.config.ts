import type { NextConfig } from "next";

const PLAYWRIGHT_PORT = process.env.PLAYWRIGHT_PORT ?? "3100";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  allowedDevOrigins: [
    `http://localhost:3000`,
    `http://127.0.0.1:3000`,
    `http://127.0.0.1:${PLAYWRIGHT_PORT}`,
    `http://localhost:${PLAYWRIGHT_PORT}`,
  ],
  env: {
    NEXT_PUBLIC_E2E: process.env.NEXT_PUBLIC_E2E ?? process.env.E2E ?? "false",
  },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
