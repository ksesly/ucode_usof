module.exports = (app) => {
    const users = require('../controllers/userController.js');

    var router = require('express').Router();

    router.get('/', users.findAll);
    router.get('/:user_id', users.findOne);

    router.patch('/:user_id', users.update);
    // router.patch('/avatar', users.updateAvatar);

    router.delete('/:user_id', users.delete);
    // router.delete('/', users.deleteAll);
    
    app.use('/api/users', router);
}

