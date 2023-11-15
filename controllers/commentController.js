const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');
const Post = require('../models/postModel');
const jwt = require('jsonwebtoken');

exports.getComment = (req, res) => {
	const id = req.params.comment_id;
	Comment.findByPk(id)
		.then((data) => {
			if (data) res.send(data);
			else {
				res.status(404).send({
					message: `Cannot find the Comment with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retreiving the Comment with id' + id,
			});
		});
};

exports.getLikeUnderComment = (req, res) => {
	const id = req.params.comment_id;

	Comment.findByPk(id)
		.then((data) => {
			Like.findAll({
				where: {
					post_id: null,
				},
			})
				.then((likeData) => {
					res.send(likeData);
				})
				.catch((err) => {
					res.status(500).send({
						message:
							'error finding likes under the Comment id= ' + id,
					});
				});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				message: 'Error retreiving the Comment with id' + id,
			});
		});
};

exports.createLikeUnderComment = (req, res) => {
	const id = req.params.comment_id;
	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, userData) => {
			Like.findOne({
				where: { comment_id: id },
			})
				.then((aboutLike) => {
					if (!aboutLike) {
						Comment.findByPk(id)
							.then((data) => {
								console.log('AAAAAAAAAAAAAAAAAA', data);
								const like = {
									content: req.body.content,
									author: data.author,
									author_id: data.author_id,
									comment_id: data.comment_id,
									type: 'like',
								};
								Like.create(like)
									.then((newLike) => {
										res.send({
											message: 'Like creation successful',
											newLike,
										});
									})
									.catch((err) => {
										console.error('Sequelize Error:', err);
										res.status(500).send({
											message:
												err.massage ||
												'Some errors while creation the Like!',
										});
									});
							})
							.catch((err) => {
								console.log(err);
								res.status(500).send({
									message:
										'Error retreiving the Comment with id' +
										id,
								});
							});
					} else {
						res.status(500).send({
							message: 'Already liked this Comment',
						});
					}
				})
				.catch((err) => {
					res.status(500).send({
						message:
							err.message ||
							'Some errors while checking existing likes!',
					});
				});
		}
	);
};

exports.updateComment = (req, res) => {
	const id = req.params.comment_id;
	Comment.update(req.body, {
		where: { comment_id: id },
	})
		.then((data) => {
			if (data == 1)
				res.send({
					message: 'Comment was updated successfully!',
				});
			else {
				res.send({
					message: `Cannot update the Comment with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating the Category with id ' + id,
			});
		});
};

exports.deleteComment = (req, res) => {
	const id = req.params.comment_id;

	Comment.destroy({
		where: { comment_id: id },
	})
		.then((data) => {
			if (data == 1)
				res.send({
					message: 'Comment was deleted successfully!',
				});
			else {
				res.send({
					message: `Cannot delete the Comment with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error deleting the Category with id=' + id,
			});
		});
};

exports.deleteLikeUnderComment = (req, res) => {
	const id = req.params.comment_id;

	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, userData) => {
			Like.findOne({
				where: { comment_id: id, post_id: null },
			})
				.then((aboutLike) => {
					console.log(aboutLike);
					Comment.findByPk(id)
						.then((data) => {
							if (aboutLike.author_id === userData.id) {
								Like.destroy({
									where: {
										like_id: aboutLike.like_id,
									},
								})
									.then((newLike) => {
										res.send({
											message: 'Like successfully delete',
										});
									})
									.catch((err) => {
										console.error('Sequelize Error:', err);
										res.status(500).send({
											message:
												err.massage ||
												'Some errors while deleting the Like!',
										});
									});
							} else {
								res.status(500).send({
									message:
										'You`re not the author of the like of post with id=' +
										id,
								});
							}
						})
						.catch((err) => {
							res.status(500).send({
								message:
									'Error retreiving the Comment with id' + id,
							});
						});
				})
				.catch((err) => {
					res.status(500).send({
						message:
							err.message ||
							'Some errors while checking existing likes!',
					});
				});
		}
	);
};
