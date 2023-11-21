const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Category = require('./categoryModel');

const Comment = sequelize.define(
	'comment',
	{
		comment_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		author: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		parent_comment_id: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true,
	}
);

Comment.sync();

module.exports = Comment;
