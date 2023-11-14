const Sequelize = require('sequelize');
const sequelize = new Sequelize(
	process.env.DB,
	process.env.USER,
	process.env.PASSWORD,
	{
		host: process.env.HOST,
		dialect: process.env.dialect,
	}
);

sequelize
	.sync(/*{ alter: true }*/)
	.then(() => {
		console.log('Sync db!');
	})
	.catch((err) => {
		console.log('Fail to sync db: ' + err);
	});

module.exports = sequelize;
