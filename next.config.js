/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ["en-US", "tr"],
    defaultLocale: "en-US",
  },
  images: {
    domains: ["media.graphcms.com"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "removeViewBox",
                  active: false,
                  removeViewBox: false,
                },
              ],
            },
          },
        },
      ],
    });
    return config;
  },
};
