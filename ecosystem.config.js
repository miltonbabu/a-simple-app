module.exports = {
  apps: [{
    name: 'notevault',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'postgresql://notevault_user:CHANGE_ME_PASSWORD@localhost:5432/notevault',
      NEXTAUTH_URL: 'https://your-domain.com',
      NEXTAUTH_SECRET: 'CHANGE_ME_GENERATE_WITH_node_-e_console.log(require_crypto_.randomBytes_32_.toString_hex_))',
    },
  }],
};
