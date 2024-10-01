import database from '../db/database.mjs'
import { ObjectId } from 'mongodb';

const documentModel = {
    getAll: async function getAll() {
        const db = await database.getDb();

        try {
            return await db.collection.find().toArray();
        } catch (e) {
            throw new Error("Database query failed: " + e.message);
        } finally {
            await db.client.close();
        }
    },

    getOne: async function getOne(id) {
        const db = await database.getDb();

        try {
            const filter = {_id: ObjectId.createFromHexString(id)};
            return await db.collection.findOne(filter);
        } catch (e) {
            throw new Error("Database query failed: " + e.message);
        } finally {
            await db.client.close();
        }
    },

    addOne: async function addOne(body) {
        const db = await database.getDb();

        try {
            const doc = {
                title: body.title,
                content: body.content,
            };
            return await db.collection.insertOne(doc)
        } catch (e) {
            throw new Error("Database query failed: " + e.message);
        } finally {
            await db.client.close();
        }
    },

    updateOne: async function updateOne(body) {
        const db = await database.getDb();

        try {
            const filter = {_id: ObjectId.createFromHexString(body["_id"])};
            const doc = {
                $set: {
                    title: body.title,
                    content: body.content,
                }
            };
            return await db.collection.updateOne(filter, doc);
        } catch (e) {
            throw new Error("Database query failed: " + e.message);
        } finally {
            await db.client.close();
        }
    },
};

export default documentModel;
