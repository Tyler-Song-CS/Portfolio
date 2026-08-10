import type { NextConfig } from "next";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // GitHub Pages serves this repository from /Portfolio/. The workflow supplies
  // that prefix at build time while local development continues at the root.
  basePath,
  output: "export",
  trailingSlash: true,
  // Hide Next.js's development tools badge from local design reviews.
  devIndicators: false,
  // The Codex preview uses 127.0.0.1 while Next may advertise localhost.
  // Allow both so local hot reload stays connected during design review.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
