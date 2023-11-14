module.exports = (app) => {
	const users = require('../controllers/authController');
	const preveliges = require('../helpers/protected');

	var router = require('express').Router();
	router.post('/register', users.register);
	router.post('/login', users.login);
	router.post('/password-reset', users.resetPassword);
	router.post('/password-reset/:confirm_token', users.confirmPassword);

	router.use(preveliges.protectedRoute);
	router.post('/logout', users.logout);

	app.use('/api/auth', router);
};
