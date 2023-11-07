// server.js
const express = require('express');
const db = require('./models/dbModel.js');
const adminRouter = require('./routes/adminRoute.js');

const host = 'localhost';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('Sync db!');
    })
    .catch((err) => {
        console.log('Fail to sync db: ' + err);
    });

require('./routes/userRoutes')(app);

app.use('/admin', adminRouter); 

app.listen(PORT, () => {
    console.log(`Server start on http://${host}:${PORT}`);
});
