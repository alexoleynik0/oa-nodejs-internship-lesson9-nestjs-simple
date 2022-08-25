export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  debug: process.env.DEBUG === 'true',
  app: {
    name: process.env.APP_NAME || 'MyApp',
  },
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
  },
});
