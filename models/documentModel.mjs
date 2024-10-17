import database from '../db/database.mjs'
import { ObjectId } from 'mongodb';

import documentService from '../services/documentService.mjs';

const documentModel = {
    getAllDataForUser: async function getAllDataForUser(user) {
        const db = await database.getDb();

        try {
            return await db.collectionDocuments.find().toArray();
        } catch (e) {
            throw new Error("Database query failed: " + e.message);
        } finally {
            await db.client.close();
        }
    },

    addOne: async function addOne(user, body) {
        const db = await database.getDb();

        try {
            const doc = {
                title: body.title,
                content: body.content,
                owner: user.email,
                users: [ user.email ]
            };

            await db.collectionDocuments.insertOne(doc)

            // const insertedDocumentId = documentService.getLastDocumentId();
            // return { insertedDocumentId: insertedDocumentId };

        } catch (e) {
            throw new Error("Database query failed: " + e.message);
        } finally {
            await db.client.close();
        }
    },
}
    // addUserToDocument: async function addUserToDocument(user, id)







// const documentModel = {
//     getAll: async function getAll() {
//         const db = await database.getDb();

//         try {
//             return await db.collectionDocuments.find().toArray();
//         } catch (e) {
//             throw new Error("Database query failed: " + e.message);
//         } finally {
//             await db.client.close();
//         }
//     },

//     getOne: async function getOne(id) {
//         const db = await database.getDb();

//         try {
//             const filter = {_id: ObjectId.createFromHexString(id)};
//             return await db.collectionDocuments.findOne(filter);
//         } catch (e) {
//             throw new Error("Database query failed: " + e.message);
//         } finally {
//             await db.client.close();
//         }
//     },

//     addOne: async function addOne(body) {
//         const db = await database.getDb();

//         try {
//             const doc = {
//                 title: body.title,
//                 content: body.content,
//             };
//             return await db.collectionDocuments.insertOne(doc)
//         } catch (e) {
//             throw new Error("Database query failed: " + e.message);
//         } finally {
//             await db.client.close();
//         }
//     },

//     updateOne: async function updateOne(body) {
//         const db = await database.getDb();

//         try {
//             const filter = {_id: ObjectId.createFromHexString(body["_id"])};
//             const doc = {
//                 $set: {
//                     title: body.title,
//                     content: body.content,
//                 }
//             };
//             return await db.collectionDocuments.updateOne(filter, doc);
//         } catch (e) {
//             throw new Error("Database query failed: " + e.message);
//         } finally {
//             await db.client.close();
//         }
//     },

//     deleteOne: async function deleteOne(id) {
//         const db = await database.getDb();

//         try {
//             const filter = {_id: ObjectId.createFromHexString(id)};
//             return await db.collectionDocuments.deleteOne(filter);
//         } catch (e) {
//             throw new Error("Database query failed: " + e.message);
//         } finally {
//             await db.client.close();
//         }
//     },
// };

export default documentModel;
