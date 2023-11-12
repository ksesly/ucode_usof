module.exports = (app) => {
	const users = require('../controllers/authController');
	const protect = require('../helpers/protected');

	var router = require('express').Router();
	router.post('/register', users.register);
	router.post('/login', users.login);
	router.post('/logout', protect.protectedRoute, users.logout);
	router.post('/password-reset', users.resetPassword);
	router.post('/password-reset/:confirm_token', users.confirmPassword);

	app.use('/api/auth', router);
};
