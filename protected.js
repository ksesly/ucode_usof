exports.protectedRoute = (req, res) => {
    // Verify the token in the request
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Invalid token' });
        }

        // Access user data from the decoded token
        const { user, password } = decoded;

        // You can perform any necessary actions here

        res.send({ message: 'Protected route accessed', user });
    });
};