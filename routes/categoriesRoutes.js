module.exports = (app) => {
	const categories = require('../controllers/categoriesController');
	const preveliges = require('../helpers/protected');

	var router = require('express').Router();

	router.use(preveliges.protectedRoute);
	router.get('/', categories.getAllCategories); 
	router.get('/:category_id', categories.getCategory); 
	router.get('/:category_id/posts', categories.getCategoryPosts); 
    router.post('/', categories.createCategory);
    router.patch('/:category_id', categories.updateCategory); 
	router.delete('/:category_id', categories.deleteCategory); 

	app.use('/api/categories', router);
};