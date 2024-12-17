import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { BadRequestException } from '../middleware/error.middleware';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../images', 'products'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

export const upload = multer({
    storage: storage,
    fileFilter(req, file, callback) {
        if (!file.mimetype.startsWith('image')) {
            callback(new BadRequestException('File type not allowed'));
            callback(null, false);
        }
        callback(null, true);
    },
});
