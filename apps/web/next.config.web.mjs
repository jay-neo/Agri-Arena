
/** @type {import('next').NextConfig} */
const nextConfig = {
  // distDir: "out",
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "*",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value: "X-Requested-With, Content-Type, Accept",
  //         },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET, POST, PUT, DELETE, OPTIONS",
  //         },
  //       ],
  //     },
  //   ];
  // },
  // async rewrites() {
  //   return process.env.NODE_ENV !== "production"
  //     ? [
  //         {
  //           source: "/api/:path*",
  //           destination: "http://localhost:8000/:path*",
  //         },
  //       ]
  //     : [];
  // },
};

export default nextConfig;
