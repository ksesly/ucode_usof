const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../db');

const User = sequelize.define(
    'user', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        profilePicture: {
            type: DataTypes.BLOB,
            allowNull: true
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user'
        },
    }, 
    {
        freezeTableName: true,
        timestamps: false
    }
);
User.sync();

module.exports = User;






// module.exports = User;

// User.sync({ alter: true })
//     .then(() => {
        
//         // const user = User.build({ login: 'Ksuwka', password: '123', WittCodeRocks: true});
//         // console.log(user.login);
//         // console.log(user.password);
//         // we can manipulate befor saving 
//         // return user.save();

//         return User.create({
//             login: 'Ksuwka',
//             password: 'tutut'
//         });
//     })
//     .then((data) => {
//         console.log('Table and model synced successfully');
//         console.log('User added to database');
//         // console.log(data.toJSON());
//         // data.login = 'ne-ksuwka';

//         //update the exect row 
//         // return data.save({ fields: ['login'] });

//         // also we can use decrement and increment (data.decrement({ age: 2}) - will decrement age-2)
//     })
//     .then((data) => {
//         console.log('User updated');
//         console.log(data.toJSON());
//     })
//     .catch((err) => {
//         console.log('Fail to sync', err);
//     });