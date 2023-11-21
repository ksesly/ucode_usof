const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const sequelize = require('../db');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');
const Favorite = require('../models/favoriteModel');

exports.getAllFavorites = (req, res) => {
	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, data) => {
			console.log(data);
			User.findByPk(data.id)
				.then((currentUser) => {
					currentUser
						Favorite.findAll()
						.then((favoritePosts) => {
							res.status(200).json({ data: favoritePosts });
						})
						.catch((getFavoritesError) => {
							console.error(
								'Error getting favorites:',
								getFavoritesError
							);
							res.status(500).json({
								message: 'Error getting favorites',
							});
						});
				})
				.catch((userNotFoundError) => {
					console.error('Error finding user:', userNotFoundError);
					res.status(500).json({ message: 'Error finding user' });
				});
		}
	);
};

exports.addToFavorites = (req, res) => {
	const post_id = req.params.post_id;
	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, data) => {
			User.findByPk(data.id)
				.then((currentUser) => {
					Post.findByPk(post_id)
						.then((selectedPost) => {
							Favorite.create({
                                user_id: currentUser.user_id,
                                post_id: selectedPost.post_id
                            })
								.then(() => {
									res.status(200).json({
										message:
											'Post added to favorites successfully',
										selectedPost,
									});
								})
								.catch((addFavoriteError) => {
									console.error(
										'Error adding to favorites:',
										addFavoriteError
									);
									res.status(500).json({
										message: 'Error adding to favorites',
									});
								});
						})
						.catch((findPostError) => {
							console.error('Error finding post:', findPostError);
							res.status(500).json({
								message: 'Error finding post',
							});
						});
				})

				.catch((findUserError) => {
					console.error('Error finding user:', findUserError);
					res.status(500).json({ message: 'Error finding user' });
				});
		}
	);
};

exports.deleteFromFavorites = (req, res) => {
    const post_id = req.params.post_id;
	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, data) => {
			User.findByPk(data.id)
				.then((currentUser) => {
					Post.findByPk(post_id)
						.then((selectedPost) => {
							Favorite.destroy({
                                where: {
                                    user_id: currentUser.user_id,
                                    post_id: selectedPost.post_id,
                                },
                            })
								.then(() => {
									res.status(200).json({
										message:
											'Post deleted to favorites successfully',
										selectedPost,
									});
								})
								.catch((addFavoriteError) => {
									console.error(
										'Error deleting from favorites:',
										addFavoriteError
									);
									res.status(500).json({
										message: 'Error deleting from favorites',
									});
								});
						})
						.catch((findPostError) => {
							console.error('Error finding post:', findPostError);
							res.status(500).json({
								message: 'Error finding post',
							});
						});
				})

				.catch((findUserError) => {
					console.error('Error finding user:', findUserError);
					res.status(500).json({ message: 'Error finding user' });
				});
		}
	);

};
