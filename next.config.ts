import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isPages ? { output: "export" as const } : {}),
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
