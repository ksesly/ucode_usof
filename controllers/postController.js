const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const jwt = require('jsonwebtoken');
const Like = require('../models/likeModel');
const Category = require('../models/categoryModel');

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

exports.getAllComments = (req, res) => {
	Comment.findAll()
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: 'errrrrrrrrrrrrrrrrrrrrrrrrrror finding all comments',
			});
		});
};

exports.createComment = (req, res) => {
	const id = req.params.post_id;
	if (!req.body.content) {
		res.status(400).send({
			message: 'Fields cannot be empty!',
		});
		return;
	}
	Post.findByPk(id)
		.then((data) => {
			console.log('data FROM CONSOLE', data);
			const comment = {
				content: req.body.content,
				author: data.author,
				author_id: data.author_id,
				post_id: data.post_id,
			};
			Comment.create(comment)
				.then((newComment) => {
					res.send({
						message: 'Comment creation successful',
						newComment,
					});
				})
				.catch((err) => {
					console.error('Sequelize Error:', err);
					res.status(500).send({
						message:
							err.massage ||
							'Some errors while creation the Comment!',
					});
				});
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retreiving the post with id' + id,
			});
		});
};

exports.getCategoriesFromPost = (req, res) => {
	const postId = req.params.post_id;

	Post.findByPk(postId)
		.then((post) => {
			post.getCategories()
				.then((categories) => {
					res.send(categories);
				})
				.catch((err) => {
					res.status(500).send({
						message:
							'Error retrieving categories for the post id= ' +
							postId,
					});
				});
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retrieving the post with id ' + postId,
			});
		});
};

exports.getLikesUnderPost = (req, res) => {
	const id = req.params.post_id;

	Post.findByPk(id)
		.then((data) => {
			Like.findAll({
				where: {
					comment_id: null,
				},
			})
				.then((likeData) => {
					console.log(likeData);

					res.send(likeData);
				})
				.catch((err) => {
					res.status(500).send({
						message: 'error finding likes under the post id= ' + id,
					});
				});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				message: 'Error retreiving the post with id' + id,
			});
		});
};

exports.createPost = (req, res) => {
	if (
		!req.body.title ||
		!req.body.content ||
		!req.body.categories ||
		!Array.isArray(req.body.categories)
	) {
		res.status(400).send({
			message:
				'Fields cannot be empty, and categories should be an array!',
		});
		return;
	}

	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, data) => {
			if (err) {
				res.status(401).send({
					message: 'Unauthorized: Invalid token',
				});
				return;
			}

			User.findByPk(data.id)
				.then((info) => {
					const post = {
						author: data.login,
						title: req.body.title,
						content: req.body.content,
						author_id: data.id,
					};

					Post.create(post)
						.then((newPost) => {
							Category.findAll({
								where: {
									title: req.body.categories,
								},
							})
								.then((categoryData) => {
									const categoryNames = categoryData.map(
										(category) => category.title
									);

									newPost
										.update({ categoryName: categoryNames })
										.then(() => {
											newPost
												.addCategories(categoryData)
												.then(() => {
													res.send({
														message:
															'Creation successful',
														newPost: {
															...newPost.toJSON(),
															categoryName:
																categoryNames,
														},
													});
												})
												.catch((err) => {
													console.error(
														'Sequelize Error:',
														err
													);
													res.status(500).send({
														message:
															'Error adding categories to the post',
													});
												});
										})
										.catch((err) => {
											console.error(
												'Sequelize Error:',
												err
											);
											res.status(500).send({
												message:
													'Error updating categoryName field',
											});
										});
								})
								.catch((err) => {
									console.error('Sequelize Error:', err);
									res.status(500).send({
										message: 'Error finding categories',
									});
								});
						})
						.catch((err) => {
							console.error('Sequelize Error:', err);
							res.status(500).send({
								message:
									err.message ||
									'Some errors while creating the Post!',
							});
						});
				})
				.catch((err) => {
					console.error('Sequelize Error:', err);
					res.status(500).send({
						message:
							err.message ||
							'Some errors while finding the user!',
					});
				});
		}
	);
};

exports.createLike = (req, res) => {
	const id = req.params.post_id;
	if (!req.body.type) {
		res.status(400).send({
			message: 'Fields cannot be empty!',
		});
		return;
	}
	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, userData) => {
			Like.findOne({
				where: { post_id: id },
			})
				.then((aboutLike) => {
					if (!aboutLike) {
						Post.findByPk(id)
							.then((data) => {
								console.log(data);
								const like = {
									content: req.body.content,
									author: data.author,
									author_id: data.author_id,
									post_id: data.post_id,
									type: req.body.type,
								};
								Like.create(like)
									.then((newLike) => {
										res.send({
											message:
												'Comment creation successful',
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
										'Error retreiving the post with id' +
										id,
								});
							});
					} else {
						res.status(500).send({
							message: 'Already liked this post',
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

exports.deliteLikeUnderPost = (req, res) => {
	const id = req.params.post_id;

	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, userData) => {
			Like.findOne({
				where: { post_id: id },
			})
				.then((aboutLike) => {
					console.log(aboutLike);
					Post.findByPk(id)
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
									'Error retreiving the post with id' + id,
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
