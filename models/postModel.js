const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Post = sequelize.define(
	'post',
	{
		post_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		author: {
			type: DataTypes.STRING,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: 'active',
		},
		content: {
			type: DataTypes.TEXT,
		},
		categoryName: {
			type: DataTypes.JSON,
			
		},
	},
	{
		freezeTableName: true,
	}
);

Post.sync();

module.exports = Post;
