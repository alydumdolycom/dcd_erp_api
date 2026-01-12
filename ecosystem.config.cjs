module.exports = {
  apps: [
    {
      name: "dcd_erp_api",
      script: "src/server.js",
      watch: true,
      instances: 1,
      max_restarts: 10,
      autorestart: true,
      restart_delay: 3000,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
