module.exports = (app) => {
    const users = require('../controllers/authController.js');

    var router = require('express').Router();
    router.post('/register', users.register);
    // router.post('/login', );
    // router.post('/logout', );
    // router.post('/password-reset', );
    // router.post('/password-reset/:confirm_token', );

    
    app.use('/api/auth', router);
}

