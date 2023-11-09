module.exports = (app) => {
	const users = require('../controllers/authController');

	var router = require('express').Router();
	router.post('/register', users.register);
	router.post('/login', users.login);
	router.post('/logout', users.logout);
	// router.post('/password-reset', );
	// router.post('/password-reset/:confirm_token', );

	app.use('/api/auth', router);
};
