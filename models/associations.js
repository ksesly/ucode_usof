const User = require('./userModel');
const Post = require('./postModel');
const Category = require('./categoryModel');
const Comment = require('./commentModel');
const Like = require('./likeModel');
const postCategory = require('./postCategory');
const RP = require('./resetPasswordModel');
const Favorite = require('./favoriteModel');

User.hasMany(Post, { foreignKey: 'author_id' });
Post.belongsTo(User, { foreignKey: 'author_id' });

User.hasMany(Comment, { foreignKey: 'author_id' });
Comment.belongsTo(User, { foreignKey: 'author_id' });

User.hasMany(Like, { foreignKey: 'author_id' });
Like.belongsTo(User, { foreignKey: 'author_id' });

Post.belongsToMany(Category, {
	through: {
		model: postCategory,
		uniqueKey: 'post_category_id',
	},
	foreignKey: 'post_id',
	otherKey: 'category_id',
});

Category.belongsToMany(Post, {
	through: {
		model: postCategory,
		uniqueKey: 'post_category_id',
	},
	foreignKey: 'category_id',
	otherKey: 'post_id',
});

User.belongsToMany(Post, {
	through: {
		model: Favorite,
		uniqueKey: 'post_favorite_id',
	},
	foreignKey: 'user_id',
	otherKey: 'post_id',
});

Post.belongsToMany(User, {
	through: {
		model: Favorite,
		uniqueKey: 'post_favorite_id',
	},
	foreignKey: 'post_id',
	otherKey: 'user_id',
});

Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

Post.hasMany(Like, { foreignKey: 'post_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });

Comment.hasMany(Like, { foreignKey: 'comment_id' });
Like.belongsTo(Comment, { foreignKey: 'comment_id' });

// module.exports = {
// 	User,
// 	Post,
// 	Comment,
// 	Like,
// 	Category,
// 	postCategory,
// 	RP
// };
