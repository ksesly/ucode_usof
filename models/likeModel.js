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
        publishDate: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categories: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, 
    {
        freezeTableName: true,
        timestamps: false
    }
);


Like.sync();


module.exports = Like;

