const User = require('../models/userModel');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const jwt = require('jsonwebtoken');
const Post = require('../models/postModel');

exports.findAll = (req, res) => {
	User.findAll()
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: 'errrrrrrrrrrrrrrrrrrrrrrrrrror',
			});
		});
};

exports.findOne = (req, res) => {
	const id = req.params.user_id;
	User.findByPk(id)
		.then((data) => {
			if (data) res.send(data);
			else {
				res.status(404).send({
					message: `Cannot find the user with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retreiving the user with id' + id,
			});
		});
};

exports.getAllPostsByUserId = (req, res) => {
	const id = req.params.user_id;
	const {
		sort = 'post_id',
		order = 'DESC',
		page = 1,
		pageSize = 10,
	} = req.query;

	const offset = (page - 1) * pageSize;
	const limit = pageSize;

	const orderBy = [[sort, order]];

	Post.findAndCountAll({
		where: {
			author_id: id,
		},
		attributes: [
			'post_id',
			'createdAt',
			'updatedAt',
			'author',
			'title',
			'content',
			'status',
		],
		order: orderBy,
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
			console.error(err);
			res.status(500).send({
				message: 'Error retrieving posts for the user with id ' + id,
			});
		});
};


exports.findCurrentUser = (req, res) => {
	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, decoded) => {
			// console.log(decoded);
			User.findByPk(decoded.id)
				.then((data) => {
					if (data) res.send(data);
					else {
						res.status(404).send({
							message: `Cannot find the user with id=` + decoded,
						});
					}
				})
				.catch((err) => {
					res.status(500).send({
						message: 'Error retreiving the user with id' + decoded,
					});
				});
		}
	);
};

exports.create = (req, res) => {
	if (
		!req.body.login ||
		!req.body.password ||
		!req.body.email ||
		!req.body.fullName ||
		!req.body.role
	) {
		res.status(400).send({
			message: 'Content cannot be empty!',
		});
		return;
	}
	if (req.body.password !== req.body.passwordConfirmation) {
		res.status(400).send({
			message: 'Passwords are different!',
		});
		return;
	}
	const user = {
		login: req.body.login,
		password: req.body.password,
		email: req.body.email,
		fullName: req.body.fullName,
		role: req.body.role,
	};

	// console.log(user);
	User.create(user)
		.then((data) => {
			res.send({
				message: 'Creation successful',
				data,
			});
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.massage || 'Some errors while creation the User!!!!',
			});
		});
};

exports.updateAvatar = (req, res) => {
	const form = formidable({
		multiples: true,
		uploadDir: path.join(__dirname, '../static/avatars'),
	});

	// console.log('tuta rabotaet 1');

	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, decoded) => {
			if (err) {
				return res.status(401).send({
					message: 'Unauthorized',
				});
			}

			const userIdFromToken = decoded.id;

			// console.log('tuta rabotaet 2');

			form.parse(req, (err, fields, files) => {
				// console.log('tuta rabotaet 3');
				if (err) {
					return res.status(500).send({
						message: 'Error parsing form: ' + err.message,
					});
				}

				const profilePictureFile = files.profilePicture;

				if (!profilePictureFile) {
					return res.status(400).send({
						message: 'Avatar file is required!',
					});
				}

				const profilePicturePath = profilePictureFile.path;
				// console.log(profilePicturePath, 'IPIPUPIPIPIPIPI');
				const mimeType = profilePictureFile.type;
				const fileExtension = mime.extension(mimeType);

				const uniqueFileName =
					'avatar_' + Date.now() + '.' + fileExtension;

				const newPath = `/static/avatars/${uniqueFileName}`;

				fs.renameSync(
					profilePicturePath,
					path.join(__dirname, `../${newPath}`)
				);

				User.update(
					{ profilePicture: newPath },
					{
						where: { user_id: userIdFromToken },
					}
				)
					.then((data) => {
						if (data == 1) {
							res.send({
								message: 'Avatar was updated successfully!',
							});
						} else {
							res.status(404).send({
								message: `Cannot update the user's avatar with id=${userIdFromToken}. User not found.`,
							});
						}
					})
					.catch((err) => {
						res.status(500).send({
							message: `Error updating the user's avatar with id ${userIdFromToken}: ${err.message}`,
						});
					});
			});
		}
	);
};

exports.update = (req, res) => {
	const id = req.params.user_id;
	User.update(req.body, {
		where: { user_id: id },
	})
		.then((data) => {
			if (data == 1)
				res.send({
					message: 'User was updated successfully!',
				});
			else {
				res.send({
					message: `Cannot update the user with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating the user with id ' + id,
			});
		});
};

exports.delete = (req, res) => {
	const id = req.params.user_id;

	User.destroy({
		where: { user_id: id },
	})
		.then((data) => {
			if (data == 1)
				res.send({
					message: 'User was deleted successfully!',
				});
			else {
				res.send({
					message: `Cannot delete the user with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error deleting the user with id' + id,
			});
		});
};

// exports.deleteAll = (req, res) => {
//     User.destroy({
//         where: {},
//         truncate: false
//     })
//         .then((data) => {
//             res.send({
//                 message: data + 'Users was deleted successfully!'
//             });
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message: err.message || 'Error deleting all users'
//             });
//         });
// };
