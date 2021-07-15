import dotenv from 'dotenv';

dotenv.config();

const ENV = {
  /** main */
  NODE_ENV: process.env.NODE_ENV || '',
  PORT: process.env.PORT || '',

  /** Cookie */
  COOKIE_SECRET: process.env.COOKIE_SECRET || '',

  /** JWT */
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '',

  /** Crypto */
  CRYPTO_SECRET: process.env.CRYPTO_SECRET || '',

  /** Moment.js */
  MOMENT_TIMEZONE: process.env.MOMENT_TIMEZONE || '',
  MOMENT_LOCALE: process.env.MOMENT_LOCALE || '',

  /* max file size in MB */
  UPLOAD_FILE_MAX_SIZE: process.env.UPLOAD_FILE_MAX_SIZE || '',

  /** Databases */
  DB_CONNECTION: process.env.DB_CONNECTION || '',
  REDIS_PORT: process.env.REDIS_PORT || '',
};

export default ENV;
