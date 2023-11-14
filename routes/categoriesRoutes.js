module.exports = (app) => {
	const categories = require('../controllers/categoriesController');
	const preveliges = require('../helpers/protected');

	var router = require('express').Router();

	router.use(preveliges.protectedRoute);
	router.get('/', ); // get all categories
	router.get('/:category_id', ); // get specified category data
	router.get('/:category_id/posts', ); // get posts of this categories
    router.post('/', ) //create a new category [title]
    router.patch('/:category_id', ); //update specified category
	router.delete('/:category_id', ); // delete a category


	app.use('/api/categories', router);
};