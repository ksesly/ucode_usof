const AdminJS = require('adminjs');
const { User } = require('./models/userModel');

const admin = new AdminJS({
  resources: [User],
});

module.exports = admin;
