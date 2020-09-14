import dotenv from 'dotenv';
import { convertStringToBoolean, convertStringToNumber } from '../utils';

dotenv.config();

/** main */
export const NODE_ENV = process.env.NODE_ENV || 'production';
export const PORT = process.env.PORT || '3000';
export const STORAGE_LOCAL = './download';

/** JWT */
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

/** max file size in MB */
export const UPLOAD_FILE_MAX_SIZE = convertStringToNumber(
  process.env.UPLOAD_FILE_MAX_SIZE || '10',
);
export const ACCESS_LOG_FILE_MAX_SIZE = convertStringToNumber(
  process.env.ACCESS_LOG_FILE_MAX_SIZE || '20',
);
export const ERROR_LOG_FILE_MAX_SIZE = convertStringToNumber(
  process.env.ERROR_LOG_FILE_MAX_SIZE || '10',
);
export const CRON_JOB_FILE_MAX_SIZE = convertStringToNumber(
  process.env.CRON_JOB_FILE_MAX_SIZE || '10',
);

/** ORM */
export const ORM_DATABASES = process.env.ORM_DATABASES || '';
export const ORM_USERNAME = process.env.ORM_USERNAME || '';
export const ORM_PASSWORD = process.env.ORM_PASSWORD || '';
export const ORM_HOST = process.env.ORM_HOST || '';
export const ORM_PORT = convertStringToNumber(process.env.ORM_PORT || '3306');
export const ORM_DIALECT = 'mysql';
export const ORM_LOGGING = convertStringToBoolean(
  process.env.ORM_LOGGING || 'false',
);

/** Nodemailer */
export const NODEMAILER_PORT = convertStringToNumber(
  process.env.NODEMAILER_PORT || '25',
);

/** Cron Job */
export const CRON_TIME = process.env.CRON_TIME || '00 00 00 * * *';
export const CRON_TIME_ZONE = process.env.CRON_TIME_ZONE || 'Asia/Tokyo';

/** Moment.js */
export const MOMENT_TIMEZONE = process.env.MOMENT_TIMEZONE || 'Asia/Ho_Chi_Minh';
export const MOMENT_LOCALE = process.env.MOMENT_LOCALE || 'vi';

/** Redis */
export const REDIS_PORT = convertStringToNumber(process.env.REDIS_PORT || '6379');

/** Googleapis */
export const GOOGLEAPIS_SLOPES = [
  'https://www.googleapis.com/auth/cloud-platform',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/admin.directory.user.security',
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/admin.directory.group.member',
  'https://www.googleapis.com/auth/gmail.metadata',
];

/** Google Drive */
export const GOOGLE_DRIVE_FOLDER_URL =
  process.env.GOOGLE_DRIVE_FOLDER_URL || 'https://drive.google.com/drive/folders/';
export const GOOGLE_DRIVE_FILE_URL =
  process.env.GOOGLE_DRIVE_FILE_URL ||
  'https://drive.google.com/file/d/{fileId}/view?';
export const ROOT_FOLDER = process.env.ROOT_FOLDER || 'ProjectManagement';

/** AWS S3 */
export const AWS_S3_BUCKET_URL = process.env.AWS_S3_BUCKET_URL || '';
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
