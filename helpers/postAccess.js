const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.protectedRoute = (req, res, next) => {
	if (!req.headers.authorization)
		next();
	
};