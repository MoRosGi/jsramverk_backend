import express from 'express'
const router = express.Router();

import documentModel from "../models/documentModel.mjs";

router.get('/', async (req, res, next) => {
    try {
        const result = await documentModel.getAll();
        res.json({
            data: result
        });
    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const result = await documentModel.getOne(req.params.id);
        res.json({
            data: result
        });
    } catch (error) {
        next(error)
    }
});

router.post("/", async (req, res, next) => {
    try {
        await documentModel.addOne(req.body);
        res.status(201).json({ 
            data: {
                msg: "Got a POST request, sending back 201 Created"
            } 
        });
    } catch (error) {
        next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        await documentModel.updateOne(req.body);
        res.status(201).json({ 
            data: {
                msg: "Got a POST request, sending back 201 Updated"
            } 
        });
    } catch (error) {
        next(error);
    }
});

export default router;
