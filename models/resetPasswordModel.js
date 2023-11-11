const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');

const RP = sequelize.define(
	'resetPassword',
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		freezeTableName: true
	}
);
RP.sync();

module.exports = RP;
