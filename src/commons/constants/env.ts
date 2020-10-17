import dotenv from 'dotenv';
import { convertStringToNumber } from '../utils';

dotenv.config();

/** main */
export const NODE_ENV = process.env.NODE_ENV || 'production';
export const PORT = convertStringToNumber(process.env.PORT || '3000');

/** JWT */
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

/** Crypto */
export const CRYPTO_SECRET = process.env.CRYPTO_SECRET || 'secret';

/** Moment.js */
export const MOMENT_TIMEZONE = process.env.MOMENT_TIMEZONE || 'Asia/Ho_Chi_Minh';
export const MOMENT_LOCALE = process.env.MOMENT_LOCALE || 'vi';

/* max file size in MB */
export const UPLOAD_FILE_MAX_SIZE = convertStringToNumber(
  process.env.UPLOAD_FILE_MAX_SIZE || '10',
);
export const ACCESS_LOG_FILE_MAX_SIZE = convertStringToNumber(
  process.env.ACCESS_LOG_FILE_MAX_SIZE || '20',
);
export const ERROR_LOG_FILE_MAX_SIZE = convertStringToNumber(
  process.env.ERROR_LOG_FILE_MAX_SIZE || '10',
);

/** MySQL */
export const APP_DB_URL =
  process.env.APP_DB_URL || 'mysql://root:@127.0.0.1:3306/project_management_system';

/** AWS S3 */
export const AWS_S3_BUCKET_URL = process.env.AWS_S3_BUCKET_URL || '';
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';

/** Redis */
export const REDIS_PORT = convertStringToNumber(process.env.REDIS_PORT || '6379');
