const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../db');


const Post = sequelize.define(
    'post', {
        post_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        author: {
            type: DataTypes.STRING,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publishDate: {
            type: DataTypes.DATE,
            
        },
        status: {
            type: DataTypes.STRING,
            
        },
        content: {
            type: DataTypes.TEXT,
            
        },
        categories: {
            type: DataTypes.STRING,
            
        }
    }, 
    {
        freezeTableName: true,
        timestamps: false
    }
);


Post.sync();


module.exports = Post;

