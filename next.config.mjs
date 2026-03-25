import { createMDX } from 'fumadocs-mdx/next';

// Doc sections that previously lived at the root in VitePress
const docSections = [
  'adr',
  // 'api' excluded — conflicts with /api/ routes (md, search)
  'concepts',
  'ev-abci',
  'ev-reth',
  'getting-started',
  'guides',
  'learn',
  'overview',
  'reference'
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          '*.gstatic.com',
        pathname: '**'
      }
    ]
  },
  async redirects() {
    return docSections.flatMap((section) => [
      {
        source: `/${section}`,
        destination: `/docs/${section}`,
        permanent: true
      },
      {
        source: `/${section}/:path*`,
        destination: `/docs/${section}/:path*`,
        permanent: true
      }
    ])
  }
}

const withMDX = createMDX();

export default withMDX(nextConfig);
