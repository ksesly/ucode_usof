module.exports = (app) => {
	const posts = require('../controllers/favoriteController');
	const preveliges = require('../helpers/protected');

	var router = require('express').Router();

	router.use(preveliges.protectedRoute);
    router.post('/:post_id', posts.addToFavorites);
	router.get('/', posts.getAllFavorites);

	router.delete('/:post_id', posts.deleteFromFavorites);
	

	app.use('/api/favorites', router);
};
