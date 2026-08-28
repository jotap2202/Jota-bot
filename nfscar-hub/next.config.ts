import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: "/api/r/:code",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=60, s-maxage=60",
        },
      ],
    },
  ],
};

export default config;
