import database from '../db/database.mjs'
import { ObjectId } from 'mongodb';

import documentService from '../services/documentService.mjs';

const documentModel = {
    getAllDataForUser: async function getAllDataForUser(user) {
        const db = await database.getDb();

        try {
            const filter = {
                $or: [
                    { owner: user.email },
                    { collaborators: user.email }
                ]
            }

            return await db.collectionDocuments.find(filter).toArray();
        } catch (error) {
            throw new Error("Database query failed: " + error.message);
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
                collaborators: [ user.email ]
            };

            await db.collectionDocuments.insertOne(doc)

            // const insertedDocumentId = documentService.getLastDocumentId();
            // return { insertedDocumentId: insertedDocumentId };

        } catch (error) {
            throw new Error("Database query failed: " + error.message);
        } finally {
            await db.client.close();
        }
    },

    getOne: async function getOne(user, id) {
        const db = await database.getDb();

        try {
            const filter = {
                $or: [
                    { owner: user.email },
                    { collaborators: user.email }
                ],
                _id: ObjectId.createFromHexString(id)
            }

            const result = await db.collectionDocuments.findOne(filter);

            if (result == null) {
                throw new Error("No valid document.");
            }
            return result

        } catch (error) {
            throw new Error("Database query failed: " + error.message);
        } finally {
            await db.client.close();
        }
    },

    getDocumentCollaborators: async function getDocumentCollaborators(id) {
        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
            }

            const document = await db.collectionDocuments.findOne(filter);

            return document.collaborators;
        } catch (error) {
            throw new Error("Database query failed: " + error.message);
        } finally {
            await db.client.close();
        }
    },

    addCollaborator: async function addUser(documentId, email) {
        const db = await database.getDb();

        try {
            const collaborators = await this.getDocumentCollaborators(documentId);

            const collaborator = collaborators.includes(email) ? email : null;

            if (collaborator == email) {
                throw new Error("Collaborator already added.");
            }

            const filter = {_id: ObjectId.createFromHexString(documentId)};

            const doc = {
                $push: {
                    collaborators: email
                }
            };

            await db.collectionDocuments.updateOne(filter, doc);

        } catch (error) {
            throw new Error("Database query failed: " + error.message);
        } finally {
            await db.client.close();
        }
    },

}






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
