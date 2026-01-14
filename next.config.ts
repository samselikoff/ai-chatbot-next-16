import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheMaxMemorySize: 0,
  // experimental: {
  //   reactDebugChannel: true,
  // },

  // async rewrites() {
  //   return [
  //     {
  //       source: "/",
  //       missing: [
  //         {
  //           type: "cookie",
  //           key: "isLoggedIn",
  //         },
  //       ],
  //       destination: "/welcome",
  //     },
  //     {
  //       source: "/",
  //       has: [
  //         {
  //           type: "cookie",
  //           key: "isLoggedIn",
  //           value: "1",
  //         },
  //       ],
  //       destination: "/main",
  //     },
  //   ];
  // },
};

export default nextConfig;
