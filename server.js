const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
};

const host = 'localhost';
const PORT = process.env.PORT || 3050;
const app = express();

require('./models/associations');
const adminRouter = require('./helpers/admin');
app.use('/admin', adminRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsOptions);

require('./routes/userRoutes')(app);
require('./routes/authRoutes')(app);
require('./routes/postRoutes')(app);
require('./routes/categoriesRoutes')(app);
require('./routes/commentRoutes')(app);
require('./routes/favoriteRoutes')(app);

app.use(bodyParser.json());

app.listen(PORT, () => {
	console.log(`Server start on http://${host}:${PORT}`);

});