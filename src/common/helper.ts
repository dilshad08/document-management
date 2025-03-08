import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export function getDestination(req: any, file: any, cb: any) {
  const destinationPath = path.join(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }
  cb(null, destinationPath);
}

export function getFilename(req: any, file: any, cb: any) {
  const fileExtension = path.extname(file.originalname);
  const fileNameWithExtension = `${generateRandomString()}${fileExtension}`;
  cb(null, fileNameWithExtension);
}

function generateRandomString(): string {
  return uuidv4().replace(/-/g, '').slice(0, 16);
}
