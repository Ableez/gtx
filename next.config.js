/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "",
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
