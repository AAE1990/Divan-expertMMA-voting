import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  env: {
    SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    GOOGLE_RECAPTCHA_SITE_KEY: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.yandex.net"
      },
       {
        protocol: 'https',
        hostname: 'i.ibb.co', // Наш новый фотохостинг для бойцов и турниров
      },
    ]
  },
};

export default withNextIntl(nextConfig);
