const mailer = require('nodemailer');

const transporter = mailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.emailUser,
		pass: process.env.emailPassword,
		// clientId: process.env.CLIENT_ID,
		// clientSecret: process.env.CLIENT_SECRET,
		// refreshToken: process.env.REFRESH_TOKEN,
	},
});

module.exports = transporter;
