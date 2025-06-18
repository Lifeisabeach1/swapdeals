const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error'] }
      : false,
  },
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
  serverExternalPackages: ['knex', 'pg'],
};

module.exports = nextConfig;