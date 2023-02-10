module.exports = {
  apps: [
    {
      name: 'Dog-Course-Server',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'development',
        GOOGLE_SECRET_KEY: 'AIzaSyAqYgAYMn77AmEqsMimgx4fBpiq6GXpgr4',
        NAVER_CLIENT_ID: '8vps61fg52',
        NAVER_CLIENT_SECRET: 'zkeCHVqUw89tj2QQxZo6f0bSIcVeDhSEzZCj07X4',
        CLOUDINARY_KEY:
          'cloudinary://867662988711131:2ClWnPHXBlfs9AtvBqWM_JTh3LA@dcizjmtey',
        CLOUDINARY_NAME: 'dcizjmtey',
        CLOUDINARY_KEY: '867662988711131',
        CLOUDINARY_SECRET: '2ClWnPHXBlfs9AtvBqWM_JTh3LA',
        DOGCOURSE_URL:'https://728f-221-148-27-89.jp.ngrok.io',
        REDIS_HOST:'127.0.0.1',
        REDIS_PORT:6379,
      },
      env_production: {
        NODE_ENV: 'production',
        GOOGLE_SECRET_KEY: 'AIzaSyAqYgAYMn77AmEqsMimgx4fBpiq6GXpgr4',
        NAVER_CLIENT_ID: '8vps61fg52',
        NAVER_CLIENT_SECRET: 'zkeCHVqUw89tj2QQxZo6f0bSIcVeDhSEzZCj07X4',
        CLOUDINARY_KEY:
          'cloudinary://867662988711131:2ClWnPHXBlfs9AtvBqWM_JTh3LA@dcizjmtey',
        CLOUDINARY_NAME: 'dcizjmtey',
        CLOUDINARY_KEY: '867662988711131',
        CLOUDINARY_SECRET: '2ClWnPHXBlfs9AtvBqWM_JTh3LA',
        DOGCOURSE_URL:'https://api.dogcourse.net',
        REDIS_HOST:'dogcourse-redis.rkfo3f.ng.0001.apn2.cache.amazonaws.com',
        REDIS_PORT:6379,
      },
    },
  ],
};
