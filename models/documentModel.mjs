import { ObjectId } from 'mongodb';

import database from '../db/database.mjs';

const documentModel = {
    fetchUserDocuments: async function fetchUserDocuments(user) {
        const db = await database.getDb();

        try {
            const filter = {
                $or: [
                    { owner: user.email },
                    { collaborators: user.email }
                ]
            };

            return await db.collectionDocuments.find(filter).toArray();
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    fetchDocumentById: async function fetchDocumentById(user, id) {
        const db = await database.getDb();

        try {
            const filter = {
                $and: [
                    {
                        $or: [
                            { owner: user.email },
                            { collaborators: user.email }
                        ]
                    },
                    { _id: ObjectId.createFromHexString(id) }
                ]
            };

            const result = await db.collectionDocuments.findOne(filter);

            if (result == null) {
                throw new Error("No valid document.");
            }
            return result;
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    createDocument: async function createDocument(user, body) {
        const db = await database.getDb();

        try {
            const doc = {
                title: body.title,
                content: body.content,
                isCode: body.isCode,
                owner: user.email,
                collaborators: [ user.email ]
            };

            await db.collectionDocuments.insertOne(doc);
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    updateDocument: async function updateDocument(user, body) {
        const db = await database.getDb();

        try {
            const filter = {
                $and: [
                    {
                        $or: [
                            { owner: user.email },
                            { collaborators: user.email }
                        ]
                    },
                    { _id: ObjectId.createFromHexString(body._id) }
                ]
            };

            const doc = {
                $set: {
                    title: body.title,
                    content: body.content,
                    isCode: body.isCode
                }
            };

            return await db.collectionDocuments.updateOne(filter, doc);
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    fetchCollaborators: async function fetchCollaborators(id) {
        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
            };

            const document = await db.collectionDocuments.findOne(filter);

            return document.collaborators;
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    addDocumentCollaborator: async function addDocumentCollaborator(documentId, email) {
        const db = await database.getDb();

        try {
            const collaborators = await this.fetchCollaborators(documentId);

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
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    }
};

export default documentModel;
