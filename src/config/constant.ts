import { HTTPdata } from './interfaces';
import util from './utils';
import message from '../variables/message.json';

const CONSTANTS = {
  RESULT: {
    code: 0,
    message: '',
    data: null,
    transaction: undefined,
    function: '',
  } as HTTPdata,

  LOG: {
    FOLDER_NAME: 'logs',
    ACCESS: {
      FOLDER_NAME: 'access',
      FILE_NAME: `access_log_${util.formatDate(new Date(), 'YYYYMMDD')}`,
      FILE_FORMAT: '.log',
    },
    ERROR: {
      FOLDER_NAME: 'error',
      FILE_NAME: `error_log_${util.formatDate(new Date(), 'YYYYMMDD')}`,
      FILE_FORMAT: '.log',
    },
  },

  IMAGE: {
    AVATAR_FOLDER_NAME: 'users',
    PRODUCT_IMAGE_NAME: 'products',
  },

  MESSAGES: message,
};

export default CONSTANTS;
