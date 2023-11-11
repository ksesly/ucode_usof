const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const adminRouter = require('./helpers/admin');

const host = 'localhost';
const PORT = process.env.PORT || 3000;
const app = express();

app.use('/admin', adminRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes/userRoutes')(app);
require('./routes/authRoutes')(app);

app.use(bodyParser.json());

app.listen(PORT, () => {
	console.log(`Server start on http://${host}:${PORT}`);
});
