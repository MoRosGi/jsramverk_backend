import * as dotenv from 'dotenv';
import request from 'supertest';
import server from '../app.mjs';
import database from '../db/database.mjs';

dotenv.config();

process.env.NODE_ENV = 'test';

jest.setTimeout(60000);

describe('documentRoutes', () => {
    let lastInsertedId;
    let db;
    let dbClient;

    beforeAll(async () => {
        db = await database.getDb();
        dbClient = db.client;
    
        await db.collection.deleteMany({});
    });

    afterAll(async () => {
        if (dbClient) {
            await db.collection.deleteMany({});
            await dbClient.close();
        }
        await server.close();
    });

    describe('POST /documents', () => {
        it('Should return status 201', async () => {
            const document = {
                title: "A Title",
                content: "A Content"
            }

            const res = await request(server).post("/documents/").send(document);
            expect(res.status).toBe(201);
        });
    });

    describe('GET /documents', () => {
        it('Should return status 200', async () => {
            const res = await request(server).get("/documents/");
            expect(res.status).toBe(200);
            lastInsertedId = res.body.data[0]._id;
        }, 15000);

        it('Should have a length of 1', async () => {
            const res = await request(server).get("/documents/");
            expect(res.body.data.length).toBe(1);
        }, 15000);
    });

    describe('GET /documents/:id', () => {
        it('Should return status 200', async () => {
            const res = await request(server).get(`/documents/${lastInsertedId}`);
            expect(res.status).toBe(200);
        }, 15000);

        it('Should be equal to title', async () => {
            const res = await request(server).get(`/documents/${lastInsertedId}`);
            expect(res.body.data.title).toBe("A Title");
        }, 15000);
    });

    describe('PUT /documents/:id', () => {
        it('Should return status 200', async () => {
            const documentModified = {
                _id: `${lastInsertedId}`,
                title: "A modified title",
                content: "A modified content"
            }

            const res = await request(server).put(`/documents/${lastInsertedId}`).send(documentModified);
            expect(res.status).toBe(200);
        }, 15000);

        it('Should be equal to modified title', async() => {
            const res = await request(server).get(`/documents/${lastInsertedId}`);
            expect(res.body.data.title).toBe("A modified title");
        }, 16000);
    });

    describe('DELETE /documents/:id', () => {
        it('Should return status 200', async () => {
            const res = await request(server).delete(`/documents/${lastInsertedId}`);
            expect(res.status).toBe(200);
        }, 15000);

        it('Should be null', async () => {
            const res = await request(server).get(`/documents/${lastInsertedId}`);
            expect(res.body.data).toBeNull();

        }, 15000);
    });
});
