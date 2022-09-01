import { config } from 'dotenv';

config(); // it seems redundant but is needed to use config in Decorators

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  debug: process.env.DEBUG === 'true',
  app: {
    name: process.env.APP_NAME || 'MyApp',
  },
  database: {
    type: process.env.DATABASE_TYPE,
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
  },
  docs: {
    name: process.env.DOCS_NAME || process.env.APP_NAME || 'MyApp API',
    description: process.env.DOCS_DESCRIPTION || '',
    basic_auth: {
      users: (process.env.DOCS_BASIC_AUTH_USERS || 'admin:secret')
        .split(',')
        .reduce((a, v) => ({ ...a, [v.split(':')[0]]: v.split(':')[1] }), {}),
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    auth_token_expires_in:
      parseInt(process.env.JWT_AUTH_TOKEN_EXPIRES_IN, 10) || 600,
    auth_refresh_token_expires_in:
      parseInt(process.env.JWT_AUTH_REFRESH_TOKEN_EXPIRES_IN, 10) || 86400,
  },
});
