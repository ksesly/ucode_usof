module.exports = (app) => {
	const users = require('../controllers/userController');

	const preveliges = require('../helpers/protected');

	var router = require('express').Router();

	router.get('/', users.findAll);
	router.get('/:user_id', users.findOne);
	
	router.patch('/avatar', users.updateAvatar);
    router.patch('/:user_id', users.update);
	

	router.delete('/:user_id', users.delete);

	router.use(preveliges.protectedRoute, preveliges.adminRoute);

	// only for admin
	router.post('/', users.create);

	
	app.use('/api/users', router);
};
