import * as dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const socketMiddleware = (socket, next) => {
    const token = socket.handshake.query.token;

    if (!token) {
        const err = new Error("Unauthorized. No token found.");
        return next(err);
    }

    jwt.verify(token, secret, function (error, decoded) {
        if (error) {
            const err = new Error("Bad Request. Invalid token.");
            return next(err);
        }
        socket.user = decoded;

        next();
    });
};

export default socketMiddleware;
