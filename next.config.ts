import type { NextConfig } from "next";

function normalizeBasePath(basePath: string) {
  const trimmed = basePath.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

function resolveBasePath() {
  const configuredBasePath =
    process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.BASE_PATH ?? "";

  if (configuredBasePath) {
    return normalizeBasePath(configuredBasePath);
  }

  if (process.env.GITHUB_ACTIONS !== "true") {
    return "";
  }

  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
  return normalizeBasePath(repositoryName);
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
