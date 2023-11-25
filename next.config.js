/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dumb.nyc3.cdn.digitaloceanspaces.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
