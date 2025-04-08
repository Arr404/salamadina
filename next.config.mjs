/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/landing',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig;
