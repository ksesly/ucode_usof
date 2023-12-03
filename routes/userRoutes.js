module.exports = (app) => {
	const users = require('../controllers/userController');
	const preveliges = require('../helpers/protected');

	var router = require('express').Router();

	
	
	router.use(preveliges.protectedRoute);
	router.get('/', users.findAll);
	router.get('/currentUser', users.findCurrentUser);
	router.get('/:user_id', users.findOne);
	router.get('/:user_id/posts', users.getAllPostsByUserId);
	router.patch('/avatar', users.updateAvatar);
    router.patch('/:user_id', users.update);
	router.delete('/:user_id', users.delete);

	// only for admin
	router.use( preveliges.adminRoute);
	router.post('/', users.create);

	app.use('/api/users', router);
};
