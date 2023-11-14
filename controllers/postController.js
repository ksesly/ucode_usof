const Post = require('../models/postModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.getAllPosts = (req, res) => {};

exports.getOnePost = (req, res) => {};

exports.getAllComments = (req, res) => {};

exports.createComment = (req, res) => {};

exports.getCategoriesFromPost = (req, res) => {};

exports.getLikesUnderPost = (req, res) => {};

exports.createPost = (req, res) => {
	if (!req.body.title || !req.body.content) {
		res.status(400).send({
			message: 'Fields cannot be empty!',
		});
		return;
	}

	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, data) => {
			User.findByPk(data.id)
				.then((data) => {
					const post = {
                        author: data.login,
						title: req.body.title,
						content: req.body.content,
						categories: req.body.categories,
					};
					Post.create(post)
						.then((data) => {
							res.send({
								message: 'Creation successful',
								data,
							});
						})
						.catch((err) => {
							console.error('Sequelize Error:', err);
							res.status(500).send({
								message:
									err.massage ||
									'Some errors while creation the Post!',
							});
						});
				})
				.catch((err) => {
					res.status(500).send({
						message:
							err.massage ||
							'Some errors while creation the Post!!!!',
					});
				});
		}
	);
};

exports.createLike = (req, res) => {};

exports.updatePost = (req, res) => {};

exports.deletePost = (req, res) => {};

exports.deliteLikeUnderPost = (req, res) => {};
