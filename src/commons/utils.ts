import fs from 'fs';
import { Duplex } from 'stream';

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
