const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../db');


const Category = sequelize.define(
    'category', {
        category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        }
    }, 
    {
        freezeTableName: true,
        timestamps: false
    }
);


Category.sync();


module.exports = Category;

