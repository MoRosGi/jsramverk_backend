import database from '../db/database.mjs'


// delete
const documentService = {
    getLastDocumentId: async function getLastDocumentId() {
        const db = await database.getDb();

        const filter = { sort: { _id: -1 } };

        const lastDocument = await db.collectionDocuments.findOne({}, filter);

        return lastDocument._id;
    }
}

export default documentService;