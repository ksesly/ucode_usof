const User = require('../models/userModel');
const RP = require('../models/resetPasswordModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const transporter = require('../helpers/resetPassword');
const crypto = require('crypto');
const moment = require('moment');

exports.register = (req, res) => {
	if (
		!req.body.login ||
		!req.body.password ||
		!req.body.email ||
		!req.body.fullName
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
	};

	User.create(user)
		.then((data) => {
			const token = jwt.sign(
				{ id: data.user_id, login: user.login, role: user.role },
				process.env.secretKey,
				{ expiresIn: process.env.expiresTime }
			);

			res.send({
				message: 'Registration successful',
				token,
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

exports.login = async (req, res) => {
	if (!req.body.login || !req.body.password || !req.body.email) {
		res.status(400).send({
			message: 'Content cannot be empty!',
		});
	}

	// console.log(req.body);
	User.findOne({
		where: {
			[Op.or]: [{ email: req.body.email }, { login: req.body.login }],
		},
	})
		.then(async (data) => {
			bcrypt.compare(req.body.password, data.password, (err, result) => {
				// console.log(result, err);
				if (result) {
					const token = jwt.sign(
						{ id: data.user_id, login: data.login, role: data.role },
						process.env.secretKey,
						{ expiresIn: process.env.expiresTime }
					);
					res.send({
						message: 'Login successfully!',
						token,
						data,
					});
				}
				if (err) {
					res.status(400).send({
						message: 'Invalid password!',
					});
				}
			});
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.massage || 'Some errors while creation the User!!!!',
			});
		});
};

exports.logout = (req, res) => {
	if (!req.headers.authorization) {
		res.status(400).send({
			message: 'No token, no money, bro!',
		});
		return;
	}
	jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.secretKey,
		(err, data) => {
			// console.log(data, '!!!!!!!!!!!!!!!!!!!!!!!!!!!');
			User.findByPk(data.id)

				.then((data) => {
					const token = jwt.sign(
						{ id: data.user_id, login: data.login },
						process.env.secretKey,
						{ expiresIn: process.env.expiresLogOutTime }
					);
					res.send({
						token,
					});
				})
				.catch((err) => {
					res.status(500).send({
						message:
							err.massage ||
							'Some errors while creation the User!!!!',
					});
				});
		}
	);
};

exports.resetPassword = (req, res) => {
	User.findOne({
		where: {
			email: req.body.email,
		},
	})
		.then((data) => {
			if (!data) {
				res.status(400).send({
					message: 'Entschuldigung, bitch!',
				});
				return;
			}

			RP.findOne({
				where: {
					user_id: data.user_id,
				},
			}).then((existingReset) => {
				let resetToken = crypto.randomBytes(40).toString('hex');
				if (existingReset) {
					existingReset.update({ token: resetToken });
				} else {
					RP.create({
						user_id: data.user_id,
						token: resetToken,
					});
				}

				// const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
				// const expiredAt = resetTokenExpires;

				const mailOptions = {
					from: process.env.emailUser,
					to: req.body.email,
					subject: 'Reset password',
					text:
						'Here is the link to reset the password: http://127.0.0.1:3000/api/auth/password-reset/' +
						`${resetToken}`,
					auth: {
						user: process.env.emailUser,
						refreshToken: process.env.REFRESHTOKEN,
					},
				};

				const info = transporter.sendMail(
					mailOptions,
					(error, info) => {}
				);

				res.send({
					message: 'Check email please (more likely folder "spam")',
					data,
					resetToken,
				});
			});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Error while querying reset tokens!',
			});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.massage || 'There is no such a user!',
			});
		});
};

exports.confirmPassword = (req, res) => {
	// console.log(req.params);
	RP.findOne({
		where: {
			token: req.params.confirm_token,
		},
	})
		.then((data) => {
			if (data.token === req.params.confirm_token) {
				const tokenCreationTime = moment(data.updatedAt);
				const currentTime = moment();
				const timeDifference = currentTime.diff(
					tokenCreationTime,
					'minutes'
				);
				// console.log(timeDifference);
				// console.log('tokenCreationTime: ', tokenCreationTime);
				// console.log('currentTime: ', currentTime);
				if (timeDifference > 5 * 60) {
					return res.status(400).send({
						message:
							'Time of waiting is out, try one more time from the start',
					});
				}

				User.findByPk(data.user_id)
					.then(async (info) => {
						if (await bcrypt.compare(req.body.password, info.password)) {
							return res.send({
								message: 'You have already used this password!',
							});
						}
						info.password = req.body.password;
						await info.save();
						res.send({
							message: 'normal resave of password!',
							info,
						});
					})
					.catch((err) => {
						res.status(500).send({
							message: err.massage || 'No users with this id :(',
						});
					});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: err.massage || 'No such a token in RP',
			});
		});
};
