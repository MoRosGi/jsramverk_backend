import express from 'express'
const router = express.Router();

import inviteModel from "../models/inviteModel.mjs";

router.post("/", async (req, res, next) => {
    try {
        const result = await inviteModel.invite(req.user, req.body);
        res.status(201).json({ 
            data: {
                msg: "Got a POST request, sending back 201 Created",
                data: result
            }
        });
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const result = await inviteModel.acceptInvite(req.user, req.params.id);
        res.status(200).json({ 
            data: {
                data: result
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
