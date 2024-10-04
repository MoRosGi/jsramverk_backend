/* global it describe before after*/
import * as dotenv from 'dotenv';
dotenv.config();

process.env.NODE_ENV = 'test';

import {expect, use} from 'chai';
import chaiHttp from 'chai-http/index.js';

import server from '../app.mjs';
import database from '../db/database.mjs';

const chai = use(chaiHttp);
chai.should();

describe('documentRoutes', () => {
    let lastInsertedId;

    before(async () => {
        const db = await database.getDb();
        const data = await db.collection.find().toArray();

        if (data.length > 0) {
        await db.collection.deleteMany({});
        }

        await db.client.close();
    });

    after(async () => {
        const db = await database.getDb();
        const data = await db.collection.find().toArray();

        if (data.length > 0) {
            await db.collection.deleteMany({});
        }


        await db.client.close();
    });

    describe('POST /documents', () => {
        it('Should return status 201', async function () {

            const document = {
                title: "A Title",
                content: "A Content"
            }
    
            const res = await chai.request.execute(server).post("/documents/").send(document);
            res.should.have.status(201);
        });
    });

    describe('GET /documents', () => {
        it('Should return status 200', async function () {
            const res = await chai.request.execute(server).get("/documents/");
            res.should.have.status(200);

            lastInsertedId = res.body.data[0]._id;
        });

        it('Should have a length of 1', async function () {
            this.timeout(5000);

            const res = await chai.request.execute(server).get("/documents/");
            res.body.data.should.have.lengthOf(1);
        });
    });

    describe('GET /documents/:id', () => {
        it('Should return status 200', async function () {
            const res = await chai.request.execute(server).get(`/documents/${lastInsertedId}`);
            res.should.have.status(200);
        });

        it('Should be equal to title', async function () {
            this.timeout(5000);

            const res = await chai.request.execute(server).get(`/documents/${lastInsertedId}`);
            res.body.data.title.should.equal("A Title");
        });
    });

    describe('PUT /documents/:id', () => {
        it('Should return status 200', async function () {
            const documentModified = {
                _id: `${lastInsertedId}`,
                title: "A modified title",
                content: "A modified content"
            }

            const res = await chai.request.execute(server).put(`/documents/${lastInsertedId}`).send(documentModified);
            res.should.have.status(200);
        });

        it('Should be equal to modified title', async function() {
            this.timeout(5000);

            const res = await chai.request.execute(server).get(`/documents/${lastInsertedId}`);
            res.body.data.title.should.equal("A modified title");
        });
    });

    describe('DELETE /documents/:id', () => {
        it('Should return status 200', async function () {
            const res = await chai.request.execute(server).delete(`/documents/${lastInsertedId}`);
            res.should.have.status(200);
        });

        it('Should be null', async function () {
            const res = await chai.request.execute(server).get(`/documents/${lastInsertedId}`);
            expect(res.body.data).to.be.null;

        });
    });
});
