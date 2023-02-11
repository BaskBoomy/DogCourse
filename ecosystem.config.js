module.exports = {
  apps: [
    {
      name: 'Dog-Course-Server',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '256M',
    },
  ],
};
