import express from 'express'
const router = express.Router();

import authModel from "../models/authModel.mjs";

router.post('/login', async(req, res, next) => {
    try {
        const result = await authModel.login(req.body.email, req.body.password);

        res.status(201).json({
        success: result.success,
        token: result.token,
        message: "Login successful"
    });
    } catch (error) {
        next(error);
    }
});

export default router;