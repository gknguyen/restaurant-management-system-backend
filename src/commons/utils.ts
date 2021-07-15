import fs from 'fs';
import momentTimezone from 'moment-timezone';
import { Duplex } from 'stream';
import ENV from './env';

class Util {
  public normalizePort(val: string) {
    const normalizingPort = parseInt(val, 10);
    if (isNaN(normalizingPort)) return val;
    if (normalizingPort >= 0) return normalizingPort;
    return false;
  }

  public getFilesizeInBytes(filename: string) {
    try {
      const stats = fs.statSync(filename);
      const fileSizeInBytes = stats['size'];
      return fileSizeInBytes / 1000000;
    } catch (err) {
      return 0;
    }
  }

  public convertStringToNumber(string: string | undefined) {
    if (string) {
      const number: number = parseFloat(string);
      return number;
    } else return 0;
  }

  public convertStringToBoolean(string: string | undefined) {
    if (string) {
      if (string === 'true') return true;
      else return false;
    } else return false;
  }

  public bufferToStream(buffer: Buffer) {
    const stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  public formatDate(theDateTime?: Date | string | number, format = 'DD/MM/YYYY h:mm:ss a') {
    if (theDateTime)
      return momentTimezone(momentTimezone.utc(theDateTime))
        .tz(ENV.MOMENT_TIMEZONE)
        .locale(ENV.MOMENT_LOCALE)
        .format(format);
    else return '';
  }
}

const util = new Util();

export default util;
