import express from 'express';
const router = express.Router();

import authModel from "../models/authModel.mjs";

router.post('/register', async (req, res, next) => {
    try {
        const result = await authModel.register(req.body.email, req.body.password);

        res.status(201).json({
            data: {
                success: result.success,
                token: result.token,
                msg: "User registered successfully"
            }
        });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async(req, res, next) => {
    try {
        const result = await authModel.login(req.body.email, req.body.password);

        res.status(201).json({
            data: {
                success: result.success,
                token: result.token,
                msg: "Login successful"
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
