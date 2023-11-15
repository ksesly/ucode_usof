module.exports = (app) => {
	const comments = require('../controllers/commentController');
	const preveliges = require('../helpers/protected');

	var router = require('express').Router();

	router.use(preveliges.protectedRoute);
	router.get('/:comment_id', comments.getComment); 
	router.get('/:comment_id/like', comments.getLikeUnderComment); 
    router.post('/:comment_id/like', comments.createLikeUnderComment);
    router.patch('/:comment_id', comments.updateComment); 
	router.delete('/:comment_id', comments.deleteComment); 
	router.delete('/:comment_id/like', comments.deleteLikeUnderComment);


	app.use('/api/comments', router);
};