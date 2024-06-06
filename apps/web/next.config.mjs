const isProd = process.env.NODE_ENV === "production";

const internalHost = process.env.TAURI_DEV_HOST || "localhost";

/** @type {import('next').NextConfig} */

console.log(
  ">>>>--------------------- TAURI_DEV_HOST ==================>>>>>>",
  internalHost
);

export default (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "*", // Use '*' to allow all origins during development
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "X-Requested-With, Content-Type, Accept",
            },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS",
            },
          ],
        },
      ];
    },
    async rewrites() {
      return process.env.NODE_ENV !== "production"
        ? [
            {
              source: "/api/:path*",
              destination: "http://localhost:8000/:path*",
            },
          ]
        : [];
    },
    output: "export",
    images: {
      unoptimized: true,
    },
    assetPrefix: isProd
      ? `http://${internalHost}:3000`
      : `http://${internalHost}:3000`,
    // crossOrigin: "anonymous",
    experimental: {
      serverActions: {
        serverActions: true,
        bodySizeLimit: "2mb",
        allowedForwardedHosts: ["tauri.localhost"],
        allowedOrigins: ["http://tauri.localhost:3000"],
      },
    },
  };
  return nextConfig;
};

// https://v2.tauri.app/start/frontend/nextjs/
