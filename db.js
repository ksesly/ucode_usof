// const sequelize = require('sequelize');

// module.exports = new sequelize('ucode-usof', 'root', 'root', {
//     host: 'localhost',
//     post: 3000,
//     dialect: 'mysql',
//     // define: {
//     //     freezeTableName: true 
//     // }
// });


module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root",
    DB: "ucode-usof",
    dialect: "mysql",
    // pool: {
    //   max: 5,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000
    // }
  };

// async function my() {
//     try {
//         await sequelizeSchema.authenticate();
//         console.group('you`re successful boiiiiiiiiii');
//     } catch (error) {
//         console.log('you`re not connect :O\n', error);
//     }
   
// }

// my();

//  connection;