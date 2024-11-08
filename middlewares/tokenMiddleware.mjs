import * as dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const tokenMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. No token found."});
    }

    jwt.verify(token, secret, function(error, decoded) {
        if (error) {
            return res.status(400).json({ message: "Bad Request. Invalid token."});
        }
        req.user = {};

        req.user.email = decoded.email;

        next();
    });
};

export default tokenMiddleware;
