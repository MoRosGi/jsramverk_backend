import express from 'express'
const router = express.Router();

import documents from "../docs.mjs";

router.post("/add", async (req, res) => {
    const result = await documents.addOne(req.body);

    return res.redirect(`/${result.lastID}`);
});

router.post("/update", async (req, res) => {
    const result = await documents.updateOne(req.body);

    return res.redirect(`/`);
});

router.get('/:id', async (req, res) => {
    return res.render(
        "doc",
        { doc: await documents.getOne(req.params.id) }
    );
});

router.get('/', async (req, res) => {
    const docs = await documents.getAll();

    console.log(docs);
    return res.json({
        data: docs
    });
});

export default router;