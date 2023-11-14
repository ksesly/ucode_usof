const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../db');


const Comment = sequelize.define(
    'comment', {
        comment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publishDate: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, 
    {
        freezeTableName: true,
        timestamps: false
    }
);


Comment.sync();


module.exports = Comment;

