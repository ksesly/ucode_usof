const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');

const Like = require('./likeModel');
const Comment = require('./commentModel');

const User = sequelize.define(
	'user',
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		login: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		fullName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: /^[a-zA-Z\s]+$/,
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		profilePicture: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		rating: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'user',
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
);

User.beforeSave(async (User) => {
	if (User.changed('password')) {
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(User.password, saltRounds);
		User.password = hashedPassword;
	}
});


const Post = require('./postModel');


// User.hasMany(Comment, { foreignKey: 'author_id' });
// User.hasMany(Like, { foreignKey: 'author_id' });

// // If you also want to associate User with Post through PostCategory, you can do:
// User.belongsToMany(Post, { through: 'PostCategory' });
// Post.belongsToMany(User, { through: 'PostCategory' });

User.sync();

module.exports = User;
