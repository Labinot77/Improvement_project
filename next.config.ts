import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Recipe photos go through server actions (default limit is 1 MB)
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
