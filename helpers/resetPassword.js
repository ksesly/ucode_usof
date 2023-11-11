const mailer = require('nodemailer');

const transporter = mailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: process.env.USER,
		pass: process.env.PASS,
		clientId: process.env.CLIENTID,
		clientSecret: process.env.CLIENTSECRET,
		refreshToken: process.env.REFRESH_TOKEN,
	},
});

module.exports = transporter;
