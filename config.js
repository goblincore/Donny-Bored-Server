'use strict';

exports.CLIENT_ORIGIN=process.env.CLIENT_ORIGIN || 'http://localhost:9090';
exports.PORT = process.env.PORT || 9090;
exports.CLOUDINARY_API_KEY=process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET=process.env.CLOUDINARY_API_SECRET;
exports.CLOUDINARY_NAME=process.env.CLOUDINARY_NAME;
exports.JWT_SECRET=process.env.JWT_SECRET;
exports.JWT_EXPIRY=process.env.JWT_EXPIRY || '7d';
exports.DATABASE_URL=process.env.DATABASE_URL || 'postgres://localhost/dev-moodboards-app';
exports.TEST_DATABASE_URL=process.env.TEST_DATABASE_URL ||'postgres://localhost/dev-moodboards-app';



