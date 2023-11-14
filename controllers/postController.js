const Post = require('../models/postModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.getAllPosts = (req, res) => {
	Post.findAll()
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: 'errrrrrrrrrrrrrrrrrrrrrrrrrror',
			});
		});
};

exports.getOnePost = (req, res) => {
	const id = req.params.post_id;
	Post.findByPk(id)
		.then((data) => {
			if (data) res.send(data);
			else {
				res.status(404).send({
					message: `Cannot find the post with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retreiving the post with id' + id,
			});
		});
};

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

exports.updatePost = (req, res) => {
	const id = req.params.post_id;
	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, data) => {
			Post.findByPk(id)
				.then((post) => {
					if (!post) {
						return res.status(404).send({
							message: `Post with id=${id} not found`,
						});
					}

					if (post.author !== data.login) {
						return res.status(403).send({
							message: "You're not the author of this post",
						});
					}

					post.update(req.body)
						.then(() => {
							res.send({
								message: 'Post was updated successfully!',
							});
						})
						.catch((updateError) => {
							console.error(updateError);
							res.status(500).send({
								message:
									'Error updating the post with id ' + postId,
							});
						});
				})
				.catch((error) => {
					console.error(error);
					res.status(500).send({
						message: 'Error fetching post data for update',
					});
				});
		}
	);
};

exports.deletePost = (req, res) => {
	const id = req.params.post_id;

	Post.destroy({
		where: { post_id: id },
	})
		.then((data) => {
			if (data == 1)
				res.send({
					message: 'Post was deleted successfully!',
				});
			else {
				res.send({
					message: `Cannot delete the post with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error deleting the post with id=' + id,
			});
		});
};

exports.deliteLikeUnderPost = (req, res) => {};
