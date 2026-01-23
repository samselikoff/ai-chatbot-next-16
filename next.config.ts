import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // cacheMaxMemorySize: 0,

  reactCompiler: true,

  rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          missing: [
            {
              type: "cookie",
              key: "isLoggedIn",
            },
          ],
          destination: "/welcome",
        },
      ],
    };
  },
};

export default nextConfig;
