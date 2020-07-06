import dotenv from 'dotenv';
import { convertStringToNumber, convertStringToBoolean } from '../utils';
import { Dialect } from 'sequelize/types';

dotenv.config();

/** main */
export const NODE_ENV: string = process.env.NODE_ENV || 'production';
export const PORT: string = process.env.PORT || '3000';
export const STORAGE_LOCAL: string = './download';

/** JWT */
export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '12h';

/** max file size in MB */
export const UPLOAD_FILE_MAX_SIZE: number = convertStringToNumber(
  process.env.UPLOAD_FILE_MAX_SIZE || '10',
);
export const ACCESS_LOG_FILE_MAX_SIZE: number = convertStringToNumber(
  process.env.ACCESS_LOG_FILE_MAX_SIZE || '20',
);
export const ERROR_LOG_FILE_MAX_SIZE: number = convertStringToNumber(
  process.env.ERROR_LOG_FILE_MAX_SIZE || '10',
);
export const CRON_JOB_FILE_MAX_SIZE: number = convertStringToNumber(
  process.env.CRON_JOB_FILE_MAX_SIZE || '10',
);

/** ORM */
export const ORM_DATABASES: string = process.env.ORM_DATABASES || '';
export const ORM_USERNAME: string = process.env.ORM_USERNAME || '';
export const ORM_PASSWORD: string = process.env.ORM_PASSWORD || '';
export const ORM_HOST: string = process.env.ORM_HOST || '';
export const ORM_PORT: number = convertStringToNumber(process.env.ORM_PORT || '3306');
export const ORM_DIALECT: Dialect = 'mysql';
export const ORM_LOGGING: boolean = convertStringToBoolean(process.env.ORM_LOGGING || 'false');

/** Nodemailer */
export const NODEMAILER_PORT: number = convertStringToNumber(process.env.NODEMAILER_PORT || '25');

/** Cron Job */
export const CRON_TIME: string = process.env.CRON_TIME || '00 00 00 * * *';
export const CRON_TIME_ZONE: string = process.env.CRON_TIME_ZONE || 'Asia/Tokyo';

/** Moment.js */
export const MOMENT_TIMEZONE: string = process.env.MOMENT_TIMEZONE || 'Asia/Ho_Chi_Minh';
export const MOMENT_LOCALE: string = process.env.MOMENT_LOCALE || 'vi';

/** Redis */
export const REDIS_PORT: number = convertStringToNumber(process.env.REDIS_PORT || '6379');

/** Googleapis */
export const GOOGLEAPIS_SLOPES: string[] = [
  'https://www.googleapis.com/auth/cloud-platform',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/admin.directory.user.security',
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/admin.directory.group.member',
  'https://www.googleapis.com/auth/gmail.metadata',
];

/** Google Drive */
export const GOOGLE_DRIVE_FOLDER_URL: string =
  process.env.GOOGLE_DRIVE_FOLDER_URL || 'https://drive.google.com/drive/folders/';
export const GOOGLE_DRIVE_FILE_URL: string =
  process.env.GOOGLE_DRIVE_FILE_URL || 'https://drive.google.com/file/d/{fileId}/view?';
export const ROOT_FOLDER: string = process.env.ROOT_FOLDER || 'ProjectManagement';

/** AWS S3 */
export const AWS_S3_BUCKET_URL: string = process.env.AWS_S3_BUCKET_URL || '';
export const AWS_S3_BUCKET_NAME: string = process.env.AWS_S3_BUCKET_NAME || '';
export const AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY || '';
