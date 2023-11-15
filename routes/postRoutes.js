
module.exports = (app) => {
	const posts = require('../controllers/postController');
	const preveliges = require('../helpers/protected');

	var router = require('express').Router();

	//public 
	router.get('/', posts.getAllPosts); 
	router.get('/:post_id', posts.getOnePost); 
	router.get('/:post_id/comments', posts.getAllComments);

	// for users
	router.use(preveliges.protectedRoute);
	router.post('/:post_id/comments', posts.createComment);
	router.get('/:post_id/categories', ); // get all categories associated with the specific post
	router.get('/:post_id/like', posts.getLikesUnderPost); // get all likes under the post
	router.post('/', posts.createPost); 
	router.post('/:post_id/like', posts.createLike); 
	router.patch('/:post_id', posts.updatePost); 
	router.delete('/:post_id', posts.deletePost); 
	router.delete('/:post_id/like', posts.deliteLikeUnderPost); 

	app.use('/api/posts', router);
};
