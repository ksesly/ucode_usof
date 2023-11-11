const User = require('../models/userModel');
const RP = require('../models/resetPasswordModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const transporter = require('../helpers/resetPassword');
const crypto = require('crypto');

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
				{ id: data.user_id, login: user.login },
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

	console.log(req.body);
	User.findOne({
		where: {
			[Op.or]: [{ email: req.body.email }, { login: req.body.login }],
		},
	})
		.then(async (data) => {
			bcrypt.compare(req.body.password, data.password, (err, result) => {
				console.log(result, err);
				if (result) {
					const token = jwt.sign(
						{ id: data.user_id, login: data.login },
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
			console.log(data, '!!!!!!!!!!!!!!!!!!!!!!!!!!!');
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
			const mailOptions = {
				from: process.env.emailUser,
				to: req.body.email,
				subject: 'Reset password',
				text: 'Here is the link to reset the password',
				auth: {
					user: process.env.emailUser,
					refreshToken: process.env.REFRESHTOKEN,
					// accessToken: 'putTheAccessTokenHere',
					// expires: 'putTheAccessTokenExpirationTimeHere'
				},
			};

			const info = transporter.sendMail(mailOptions, (error, info) => {});
			res.send({
				message: 'Check email please',
				data,
			});

			const resetToken = crypto.randomBytes(40).toString('hex');
			// const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
			// const expiredAt = resetTokenExpires;

			const reset = {
				user_id: data.user_id,
				token: resetToken,
			};

			RP.create(reset)
				.then((info) => {
					res.send({
						message: 'Save to bd RP successfully',
						info
					});
				})
				.catch((err) => {
					res.status(500).send({
						message:
							err.massage ||
							'Some errors while write to RP!',
					});
				});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.massage || 'There is no such a user!',
			});
		});
};

// exports.confirmPassword = (req, res) => {

// }
