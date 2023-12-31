const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSequalize = require('@adminjs/sequelize');
const { User } = require('../models/associations');
const { Post } = require('../models/associations');
const { Comment } = require('../models/associations');
const { Category } = require('../models/associations');
const { Like } = require('../models/associations');
const { RP } = require('../models/associations');
const { postCategory } = require('../models/associations');

const DEFAULT_ADMIN = {
	email: 'admin@example.com',
	password: 'password',
};

const authenticate = async (email, password) => {
	if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
		return Promise.resolve(DEFAULT_ADMIN);
	}
	return null;
};

AdminJS.registerAdapter({
	Resource: AdminJSequalize.Resource,
	Database: AdminJSequalize.Database,
});

const makeRelationships = (req) => {
	if (req.record.params) {
		const { id } = req.record.params;
		for (const key in req.record.params) {
			if (key.startsWith('categories.')) {
				const CategoryId = req.record.params[key];
				Post.findByPk(id)
					.then((post) => {
						// console.log(id, CategoryId);
						post.addCategory(CategoryId);
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}
	}

	return req;
};

const admin = new AdminJS({
	resources: [
		{
			resource: User,
			options: {
				listProperties: [
					'user_id',
					'login',
					'password',
					'fullName',
					'email',
					'profilePicture',
					'rating',
					'role',
				],
				filterProperties: [
					'user_id',
					'login',
					'password',
					'fullName',
					'email',
					'profilePicture',
					'rating',
					'role',
				],
				editProperties: [
					'user_id',
					'login',
					'fullName',
					'email',
					'profilePicture',
					'rating',
					'role',
				],
				showProperties: [
					'user_id',
					'login',
					'password',
					'fullName',
					'email',
					'profilePicture',
					'rating',
					'role',
				],
			},
		},
		RP,
		{
			resource: Post,
			options: {
				listProperties: [
					'post_id',
					'author',
					'title',
					'status',
					'content',
					'categoryName',
					'createdAt',
					'updatedAt',
					// 'author_id',
				],
				filterProperties: [
					'post_id',
					'author',
					'title',
					'status',
					'content',
					'categoryName',
					'createdAt',
					'updatedAt',
					// 'author_id',
				],
				editProperties: [
					'post_id',
					'author',
					'title',
					'status',
					'categoryName',
					'createdAt',
					'updatedAt',
				],
				showProperties: [
					'post_id',
					'author',
					'title',
					'status',
					'content',
					'categoryName',
					'createdAt',
					'updatedAt',
				],
				properties: {
					categories: {
						type: 'reference',
						reference: 'category',
						isArray: true,
						isVisible: {
							list: false,
							filter: false,
							show: true,
							edit: true,
						},
					},
					comments: {
						type: 'reference',
						reference: 'comment',
						isArray: true,
						isVisible: {
							list: false,
							filter: false,
							show: true,
							edit: false,
						},
					},
					likes: {
						type: 'reference',
						reference: 'like',
						isArray: true,
						isVisible: {
							list: false,
							filter: false,
							show: true,
							edit: false,
						},
					},
				},

				actions: {
					new: {
						after: [makeRelationships],
					},
				},
			},
		},
		Category,
		Comment,
		Like,
		{
			resource: postCategory,
			options: {
				properties: {
					categories: {
						type: 'reference',
						reference: 'category',
					},
					posts: {
						type: 'reference',
						reference: 'post',
					},
				},
			},
		},
	],
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
	admin,
	{
		authenticate,
		cookieName: 'adminjs',
		cookiePassword: 'sessionsecret',
	},
	null
);

module.exports = adminRouter;
