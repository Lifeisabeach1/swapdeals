/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence Turbopack warning (we're using webpack for database fallbacks)
  turbopack: {},
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error'] }
      : false,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'obczdbbbcppsjbiyayvq.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // Webpack config for database driver fallbacks
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'oracledb': false,
      'mysql': false,
      'mysql2': false,
      'sqlite3': false,
      'better-sqlite3': false,
      'pg-native': false,
      'tedious': false,
    };

    if (!isServer) {
      config.externals = {
        ...config.externals,
        'oracledb': 'oracledb',
        'mysql': 'mysql',
        'mysql2': 'mysql2',
        'sqlite3': 'sqlite3',
        'better-sqlite3': 'better-sqlite3',
        'pg-native': 'pg-native',
        'tedious': 'tedious',
      };
    }

    return config;
  },

  // Mark packages that should only run on server
  serverExternalPackages: ['knex', 'pg'],

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;