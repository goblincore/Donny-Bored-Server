'use strict';

exports.PORT = process.env.PORT || 9090;
exports.JWT_SECRET=process.env.JWT_SECRET;
exports.JWT_EXPIRY=process.env.JWT_EXPIRY || '7d';
exports.DATABASE_URL=process.env.DATABASE_URL || 'postgres://localhost/dev-moodboards-app';
exports.TEST_DATABASE_URL=process.env.TEST_DATABASE_URL ||'postgres://localhost/dev-moodboards-app';



