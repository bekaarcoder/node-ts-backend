import multer, { FileFilterCallback } from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { BadRequestException } from '../middleware/error.middleware';

function createStorage(uploadDir: string) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(
                __dirname,
                '../../../images',
                uploadDir
            );
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
    });

    return storage;
}

function getUploader(type: string) {
    const upload = multer({
        storage: createStorage(type),
        fileFilter(req, file, callback) {
            if (!file.mimetype.startsWith('image')) {
                callback(new BadRequestException('File type not allowed'));
                callback(null, false);
            }
            callback(null, true);
        },
    });
    return upload;
}

export const upload = getUploader('products');
export const uploadAvatar = getUploader('users');
