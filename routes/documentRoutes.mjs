import express from 'express'
const router = express.Router();

import documentModel from "../models/documentModel.mjs";

router.get('/', async (req, res, next) => {
    try {
        const result = await documentModel.getAllDataForUser(req.user);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error)
    }
});

router.post("/", async (req, res, next) => {
    try {
        await documentModel.addOne(req.user, req.body);
        res.status(201).json({ 
            data: {
                msg: "Got a POST request, sending back 201 Created"
            }
        });
    } catch (error) {
        next(error);
    }
});

// router.get("/test", async (req, res, next) => {
//     try {
//         res.status(201).json({ 
//             data: {
//                 data: req.user
//             }
//         });
//     } catch (error) {
//         next(error);
//     }
// });






// router.get('/', async (req, res, next) => {
//     try {
//         const result = await documentModel.getAll();
//         res.status(200).json({
//             data: result
//         });
//     } catch (error) {
//         next(error)
//     }
// });

// router.get('/:id', async (req, res, next) => {
//     try {
//         const result = await documentModel.getOne(req.params.id);
//         res.status(200).json({
//             data: result
//         });
//     } catch (error) {
//         next(error)
//     }
// });

// router.post("/", async (req, res, next) => {
//     try {
//         await documentModel.addOne(req.body);
//         res.status(201).json({ 
//             data: {
//                 msg: "Got a POST request, sending back 201 Created"
//             }
//         });
//     } catch (error) {
//         next(error);
//     }
// });

// router.put("/:id", async (req, res, next) => {
//     try {
//         await documentModel.updateOne(req.body);
//         res.status(200).json({ 
//             data: {
//                 msg: "Got a PUT request, sending back 200 Updated"
//             }
//         });
//     } catch (error) {
//         next(error);
//     }
// });

// router.delete("/:id", async (req, res, next) => {
//     try {
//         await documentModel.deleteOne(req.params.id);
//         res.status(200).json({ 
//             data: {
//                 msg: "Got a DELETE request, sending back 200 Deleted"
//             }
//         });
//     } catch (error) {
//         next(error);
//     }
// });

export default router;
