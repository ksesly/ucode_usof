const { sequelize, Sequelize } = require("../models/dbModel");


module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'user', {
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            login: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            fullName: {
                type:Sequelize.STRING
            }
        }, 
        {
            freezeTableName: true,
            timestamps: false
        }
    );
    User.sync();
    return User;
}

// const User = sequelize.create(
//     'user', {
//         user_id: {
//             type: Sequelize.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         login: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },
//         password: {
//             type: Sequelize.STRING
//         },
//         email: {
//             type: Sequelize.STRING
//         },
//         fullName: {
//             type:Sequelize.STRING
//         }
//     }, 
//     {
//         freezeTableName: true,
//         timestamps: false
//     }
// );





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