/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    const backend =
      process.env.API_PROXY_TARGET ?? "http://localhost:3001";

    return [
      { source: "/auth/:path*", destination: `${backend}/auth/:path*` },
      { source: "/customer/:path*", destination: `${backend}/customer/:path*` },
      { source: "/business/:path*", destination: `${backend}/business/:path*` },
      { source: "/user/:path*", destination: `${backend}/user/:path*` },
      {
        source: "/card-template/:path*",
        destination: `${backend}/card-template/:path*`,
      },
      {
        source: "/user-loyalty-card/:path*",
        destination: `${backend}/user-loyalty-card/:path*`,
      },
      {
        source: "/stamping-log/:path*",
        destination: `${backend}/stamping-log/:path*`,
      },
      {
        source: "/subscription/:path*",
        destination: `${backend}/subscription/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
