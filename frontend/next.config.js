/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://10.0.2.143:8080/api/:path*", // IP privada del backend
      },
    ];
  },
};

module.exports = nextConfig;
