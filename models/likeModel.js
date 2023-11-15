const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../db');

const Like = sequelize.define(
    'like', {
        like_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, 
    {
        freezeTableName: true
    }
);

Like.sync();


module.exports = Like;

