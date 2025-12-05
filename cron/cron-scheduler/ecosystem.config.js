module.exports = {
  apps: [{
    script: 'npm run start:dev',
    name: 'Casino-Backend',
    watch: '.',
    ignore_watch: ['./logs', 'node_modules', 'logs/*']
  }],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
