const isProd = process.env.NODE_ENV === "production";
const internalHost = process.env.TAURI_DEV_HOST || "localhost";

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out",
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd
    ? `http://${internalHost}:3000`
    : `http://${internalHost}:3000`,
  output: "export",
};

export default nextConfig;
