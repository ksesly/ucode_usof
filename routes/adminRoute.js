const { AdminJS } = require('adminjs');
const { buildRouter } = require('@adminjs/express');
const admin = require('./admin');

const adminRouter = buildRouter(admin);

module.exports = adminRouter;
