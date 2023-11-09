const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

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

// exports.resetPassword = (req, res) => {

// }

// exports.confirmPassword = (req, res) => {

// }
