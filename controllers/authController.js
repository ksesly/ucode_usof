const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


exports.register = (req, res) => {
    
    if (!req.body.login || !req.body.password || !req.body.email || !req.body.fullName) {
        res.status(400).send({
            message: 'Content cannot be empty!'
        });
        return;
    }
    const user = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email,
        fullName: req.body.fullName,
    };

    

    

    User.create(user)
        .then((data) => {
            const token = jwt.sign({ login: user.login }, process.env.secretKey, { expiresIn: process.env.expiresTime });
            // разобраться с data
            res.send({
                message: 'Registration successful',
                token: token
            });
            // res.send(data);
            // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        })
        .catch((err) => {
            // console.log(user);
            res.status(500).send({
                message: 
                err.massage || 'Some errors while creation the User!!!!' 
            });
        });
    
    
}

// exports.login = (req, res) => {

// }

// exports.logout = (req, res) => {
    
// }

// exports.resetPassword = (req, res) => {
    
// }

// exports.confirmPassword = (req, res) => {

// }
