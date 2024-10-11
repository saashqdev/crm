const os = require('os');

const config = {
  gcloud: {
    bucket: 'fldemo-files',
    hash: '7dc78a6ec0e873dd71e451bd8c2df940',
  },
  bcrypt: {
    saltRounds: 12,
  },
  admin_pass: 'password',
  admin_email: 'admin@saashqdev.org',
  providers: {
    LOCAL: 'local',
    GOOGLE: 'google',
    MICROSOFT: 'microsoft',
  },
  secret_key: 'HUEyqESqgQ1yTwzVlO6wprC9Kf1J1xuA',
  remote: '',
  port: process.env.NODE_ENV === 'production' ? '' : '8080',
  hostUI: process.env.NODE_ENV === 'production' ? '' : 'http://localhost',
  portUI: process.env.NODE_ENV === 'production' ? '' : '3000',

  portUIProd: process.env.NODE_ENV === 'production' ? '' : ':3000',

  swaggerUI: process.env.NODE_ENV === 'production' ? '' : 'http://localhost',
  swaggerPort: process.env.NODE_ENV === 'production' ? '' : ':8080',
  google: {
    clientId:
      '171146354208-5fai6f5m6d72vkt32jk155aenedlbd6d.apps.googleusercontent.com',
    clientSecret: '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',
  },
  microsoft: {
    clientId: '4696f457-31af-40de-897c-e00d7d4cff73',
    clientSecret: 'm8jzZ.5UpHF3=-dXzyxiZ4e[F8OF54@p',
  },
  uploadDir: os.tmpdir(),
  email: {
    from: 'CRM-POC <support@saashqdev.org>',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'saashqdev@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  roles: {
    super_admin: 'Super Administrator',

    admin: 'Administrator',
    user: 'User',
  },

  project_uuid: '5859e865-4af5-4197-bab8-e6133f47b8fa',
  flHost:
    process.env.NODE_ENV === 'production'
      ? 'https://saashqdev.org/projects'
      : 'http://localhost:3000/projects',
};

config.host =
  process.env.NODE_ENV === 'production' ? config.remote : 'http://localhost';
config.apiUrl = `${config.host}${config.port ? `:${config.port}` : ``}/api`;
config.swaggerUrl = `${config.swaggerUI}${config.swaggerPort}`;
config.uiUrl = `${config.hostUI}${config.portUI ? `:${config.portUI}` : ``}/#`;
config.backUrl = `${config.hostUI}${config.portUI ? `:${config.portUI}` : ``}`;

module.exports = config;
