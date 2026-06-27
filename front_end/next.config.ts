import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Set the root directory for Turbopack to the current directory
    root: __dirname,
  },
};

export default nextConfig;
