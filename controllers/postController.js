const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const sequelize = require('../db');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');
const Category = require('../models/categoryModel');

exports.getAllPosts = (req, res) => {
	const {
		sort = 'likes',
		order = 'DESC',
		categories,
		dateFrom,
		dateTo,
		page = 1,
		pageSize = 10,
	} = req.query;

	const offset = (page - 1) * pageSize;
	const limit = pageSize;

	let orderBy;

	if (sort === 'date') orderBy = [['createdAt', order]];
	else
		orderBy = [
			['likes', order],
			['createdAt', order],
		];

	let where = {};
	let whereAccess = {};

	if (dateFrom && dateTo) {
		where.createdAt = {
			[Op.between]: [dateFrom, dateTo],
		};
	}

	if (categories) {
		where.title = categories;
	}

	const categoryInclude = categories
		? [
				{
					model: Category,
					as: 'categories',
					where: { title: categories },
				},
		  ]
		: [
				{
					model: Category,
					as: 'categories',
					required: false,
				},
		  ];

	const authHead = req.headers.authorization;
	if (!authHead) {
		whereAccess = { status: 'active' };
	} else {
		jwt.verify(
			req.headers.authorization.split(' ')[1],
			process.env.secretKey,
			(err, userData) => {
				if (err) {
					res.status(400).send({
						message: 'nononon, kudaaaaaaaa',
						err,
					});
				} else {
					const { role } = userData || {};
					whereAccess =
						role === 'user'
							? {
									[Op.or]: [
										{
											status: 'inactive',
											author_id: userData.id,
										},
										{ status: 'active' },
									],
							  }
							: { status: 'active' };
				}
			}
		);
	}

	Post.findAndCountAll({
		where: { ...where, ...whereAccess },
		attributes: [
			[
				sequelize.literal(
					'(SELECT COUNT(*) FROM `Like` WHERE `Like`.`post_id` = `Post`.`post_id`)'
				),
				'likes',
			],
			'post_id',
			'createdAt',
			'updatedAt',
			'author',
			'title',
			'content',
			'status',
		],
		order: orderBy,
		include: [
			...categoryInclude,
			// {
			//   model: User,
			//   as: 'postAuthor',
			//   attributes: ['profilePicture'],
			// },
		],
		limit: limit,
		offset: offset,
	})
		.then((result) => {
			const data = result.rows;
			const count = result.count;
			const totalPages = Math.ceil(count / pageSize);

			res.send({
				data: data,
				pagination: {
					totalItems: count,
					totalPages: totalPages,
					currentPage: page,
					pageSize: pageSize,
				},
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				message: 'Error finding posts',
			});
		});
};

exports.getOnePost = (req, res) => {
	const id = req.params.post_id;
	Post.findByPk(id, {
		include: [
			{
				model: User,
				as: 'postAuthor', 
				attributes: ['profilePicture'],
			},
		],
	})
		.then((data) => {
			if (data) res.send(data);
			else {
				res.status(404).send({
					message: `Cannot find the post with id=` + id,
				});
			}
		})
		.catch((err) => {
			console.log(err);
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
			// console.log('data FROM CONSOLE', data);
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
					// console.log(likeData);

					res.send(likeData);
				})
				.catch((err) => {
					res.status(500).send({
						message: 'error finding likes under the post id= ' + id,
					});
				});
		})
		.catch((err) => {
			// console.log(err);
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
						status: 'active',
					};

					Post.create(post)
						.then((newPost) => {
							Category.findAll({
								where: {
									title: req.body.categories,
								},
							})
								.then((categoryData) => {
									newPost
										.addCategories(categoryData)
										.then(() => {
											const categoryNames =
												req.body.categories;
											newPost
												.update({
													categoryName: categoryNames,
												})
												.then(() => {
													res.send({
														message:
															'Creation successful',
														profilePicture:
															info.profilePicture,
														newPost: {
															...newPost.toJSON(),
															categoryName:
																categoryNames,
														},
													});
												})
												.catch((updateErr) => {
													console.error(
														'Sequelize Error:',
														updateErr
													);
													res.status(500).send({
														message:
															'Error updating categoryName field in the post',
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
													'Error adding categories to the post',
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
			if (err) {
				res.status(401).send({
					message: 'Unauthorized',
				});
				return;
			}
			// console.log(userData);
			const authorId = userData.id;

			Like.findOne({
				where: {
					post_id: id,
					author_id: authorId,
				},
			})
				.then((existingLike) => {
					if (existingLike) {
						res.status(400).send({
							message: 'You have already liked this post',
						});
					} else {
						Post.findByPk(id)
							.then((data) => {
								// console.log(data);
								const like = {
									content: req.body.content,
									author: userData.login,
									author_id: userData.author_id,
									post_id: data.post_id,
									type: req.body.type,
								};

								Like.create(like)
									.then((newLike) => {
										User.findByPk(authorId)
											.then((author) => {
												if (req.body.type === 'like') {
													author.update({
														rating:
															author.rating + 1,
													});
												} else {
													author.update({
														rating:
															author.rating - 1,
													});
												}
											})
											.catch((err) => {
												console.error(
													'Sequelize Error:',
													err
												);
												res.status(500).send({
													message:
														'Error updating author rating!',
												});
											});

										res.send({
											message: 'Like creation successful',
											newLike,
										});
									})
									.catch((err) => {
										console.error('Sequelize Error:', err);
										res.status(500).send({
											message:
												err.message ||
												'Some errors while creating the Like!',
										});
									});
							})
							.catch((err) => {
								// console.log(err);
								res.status(500).send({
									message:
										'Error retrieving the post with id' +
										id,
								});
							});
					}
				})
				.catch((err) => {
					res.status(500).send({
						message:
							err.message ||
							'Some errors while checking existing likes for the post!',
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
			const authorId = userData.id;
			Like.findOne({
				where: { post_id: id },
			})
				.then((aboutLike) => {
					// console.log(aboutLike);
					Post.findByPk(id)
						.then((data) => {
							if (aboutLike.author_id === userData.id) {
								Like.destroy({
									where: {
										like_id: aboutLike.like_id,
									},
								})
									.then((newLike) => {
										User.findByPk(authorId)
											.then((author) => {
												if (aboutLike.type === 'like') {
													author.update({
														rating:
															author.rating - 1,
													});
												} else {
													author.update({
														rating:
															author.rating + 1,
													});
												}
											})
											.catch((err) => {
												console.error(
													'Sequelize Error:',
													err
												);
												res.status(500).send({
													message:
														'Error updating author rating!',
												});
											});
										res.send({
											message: 'Like successfully delete',
											newLike,
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
