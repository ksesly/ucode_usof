const User = require('../models/userModel');

exports.protectedRoute = (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
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
