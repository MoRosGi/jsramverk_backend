import * as dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const tokenService = {
    generateToken: function generateToken(email) {
        return jwt.sign(email, secret, { expiresIn: '1h'});
    }
};

export default tokenService;
