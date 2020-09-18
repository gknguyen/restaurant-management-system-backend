import fs from 'fs';
import { Duplex } from 'stream';

/**
Normalize a port into a number, string, or false.
*/
export function normalizePort(val: string) {
  const normalizingPort = parseInt(val, 10);
  if (isNaN(normalizingPort)) return val;
  if (normalizingPort >= 0) return normalizingPort;
  return false;
}

export function getFilesizeInBytes(filename: string) {
  try {
    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats['size'];
    return fileSizeInBytes / 1000000;
  } catch (err) {
    return 0;
  }
}

export function convertStringToNumber(string: string | undefined) {
  if (string) {
    const number: number = parseFloat(string);
    return number;
  } else return 0;
}

export function convertStringToBoolean(string: string | undefined) {
  if (string) {
    if (string === 'true') return true;
    else return false;
  } else return false;
}

export function bufferToStream(buffer: Buffer) {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
