const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSequalize = require('@adminjs/sequelize');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const Category = require('../models/categoryModel');
const Like = require('../models/likeModel');


const DEFAULT_ADMIN = {
	email: 'admin@example.com',
	password: 'password',
}

const authenticate = async (email, password) => {
	if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
		return Promise.resolve(DEFAULT_ADMIN)
	}
	return null;
}

AdminJS.registerAdapter({
	Resource: AdminJSequalize.Resource,
	Database: AdminJSequalize.Database,
})

const admin = new AdminJS({
	resources: [User, Post, Comment, Category, Like],
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
	admin,
	{
		authenticate,
		cookieName: 'adminjs',
		cookiePassword: 'sessionsecret',
	},
	null,
)

module.exports = adminRouter;
