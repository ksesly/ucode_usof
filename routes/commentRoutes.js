module.exports = (app) => {
	const comments = require('../controllers/commentController');
	const preveliges = require('../helpers/protected');

	var router = require('express').Router();

	router.use(preveliges.protectedRoute);
	router.get('/:comment_id', ); // get specified comment data
	router.get('/:comment_id/like', ); // get all likes under the comment
    router.post('/:comment_id/like', ) //create a new like under the comment
    router.patch('/:comment_id', ); //update specified comment data
	router.delete('/:comment_id', ); // delete a comment
	router.delete('/:comment_id/like', ); // delete a like under the comment


	app.use('/api/comments', router);
};