import type { NextConfig } from "next";

const repoName = "NPC-forge";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repoName}`,
  images: { unoptimized: true },
};

export default nextConfig;
