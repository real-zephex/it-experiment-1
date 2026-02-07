import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // CSP temporarily disabled - was blocking Convex WebSocket connections
          // To re-enable safely, use browser dev tools to identify all blocked resources,
          // then add them to the policy below:
          // {
          //   key: "Content-Security-Policy",
          //   value:
          //     "default-src 'self'; " +
          //     "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.convex.cloud https://*.clerk.com; " +
          //     "style-src 'self' 'unsafe-inline'; " +
          //     "img-src 'self' blob: data: https:; " +
          //     "font-src 'self'; " +
          //     "connect-src 'self' https://*.clerk.accounts.dev https://*.convex.cloud wss://*.convex.cloud https://*.clerk.com; " +
          //     "worker-src 'self' blob:; " +
          //     "frame-ancestors 'none';",
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
