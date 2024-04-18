/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "d38v990enafbk6.cloudfront.net",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "greatexc-r2d9rlxct-ableez.vercel.app",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "greatexc.vercel.app",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "greatexc-r2d9rlxct-ableez.vercel.app",
        pathname: "**",
        port: "",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((loader) => {
            if (
              loader.use &&
              loader.use.length > 0 &&
              loader.use[0].options &&
              loader.use[0].options.postcssOptions
            ) {
              loader.use[0].options.postcssOptions.plugins.unshift(
                "postcss-nesting"
              );
            }
          });
        }
      });
    }

    return config;
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "ableez",
    project: "javascript-nextjs",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
