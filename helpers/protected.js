const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.protectedRoute = (req, res, next) => {
	const authorizationHeader = req.headers.authorization;
	console.log(authorizationHeader);
	if (!authorizationHeader) {
		return next('Unauthorized');
	}
	const token = authorizationHeader.split(' ')[1];
	if (!token) {
		return next('Unauthorized');
	}

	jwt.verify(token, process.env.secretKey, (err, decoded) => {
		if (err) {
			return next('Invalid token');
		}
		req.user_id = decoded.id;
		next();
	});
};

exports.adminRoute = (req, res, next) => {
	User.findByPk(req.user_id)
		.then((data) => {
			if (!data.role === 'admin') {
				return next('You are not an admin');
			}
			next();
		})
		.catch((err) => {
			res.status(500).send({
				message: err.massage || 'Cannot find this user(',
			});
		});
};
