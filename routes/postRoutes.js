
module.exports = (app) => {
	const posts = require('../controllers/postController');
	const preveliges = require('../helpers/protected');

	var router = require('express').Router();

	//public 
	router.get('/', ); //get all posts
	router.get('/:post_id',); // get one post
	router.get('/:post_id/comments',); // get all comments

	// for users
	router.use(preveliges.protectedRoute);
	router.post('/:post_id/comments', ); // create a new comment. [content] required
	router.get('/:post_id/categories', ); // get all categories associated with the specific post
	router.get('/:post_id/like', ); // get all likes under the post
	router.post('/', posts.createPost); // create a new post [title, content, categoris]
	router.post('/:post_id/like', ); // create a new like under the post
	router.patch('/:post_id', ); // update the specified post (only for creators of the post)
	router.delete('/:post_id', ); // delete a post
	router.delete('/:post_id/like', ); // delete a like under the post

	app.use('/api/posts', router);
};
