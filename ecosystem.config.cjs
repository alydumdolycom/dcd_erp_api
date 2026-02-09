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
      max_restarts: 10,
      watch_delay: 1000, // delay between file changes
      min_uptime: 5000,
      ignore_watch : ["node_modules", "logs"],
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
