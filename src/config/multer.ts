import multer from 'multer';
import path from 'path';
import fs from 'fs';

export default class Multer {
  constructor(folderName: string) {
    this.folderPath = path.join(__dirname, `../../images/${folderName}`);
    if (!fs.existsSync(this.folderPath)) fs.mkdirSync(this.folderPath);
  }

  private folderPath: string;

  public downloadFile = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, this.folderPath),
      filename: (req, file, cb) => cb(null, file.originalname.toLowerCase().split(' ').join('-')),
    }),
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      )
        cb(null, true);
      else cb(null, false);
    },
  });

  public getFolderPath() {
    return this.folderPath;
  }
}
