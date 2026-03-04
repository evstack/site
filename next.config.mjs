/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          '*.gstatic.com',
        pathname: '**'
      }
    ]
  }
}

export default nextConfig;
