/* global it describe before after*/
import { config } from '../config.mjs'
config.nodeEnv = 'test';

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
        it('Should return status 201', (done) => {

            const document = {
                title: "A title",
                content: "A content"
            }
    
            chai.request.execute(server)
            .post("/documents/")
            .send(document)
            .end( (err, res) => {
                res.should.have.status(201);
                done();
            });
        });
    });

    describe('GET /documents', () => {
        it('Should return status 200', (done) => {
            chai.request.execute(server)
            .get("/documents/")
            .end((err, res) => {
                res.should.have.status(200);

                lastInsertedId = res.body.data[0]._id;
                done();
            });
        });

        it('Should have a length of 1', (done) => {
            chai.request.execute(server)
            .get("/documents/")
            .end((err, res) => {
                res.body.data.should.have.lengthOf(1);
                done();
            });
        });
    });

    describe('GET /documents/:id', () => {
        it('Should return status 200', (done) => {
            chai.request.execute(server)
            .get(`/documents/${lastInsertedId}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it('Should be equal to title', (done) => {
            chai.request.execute(server)
            .get(`/documents/${lastInsertedId}`)
            .end((err, res) => {
                res.body.data.title.should.equal("A title");
                done();
            });
        });
    });

    describe('PUT /documents/:id', () => {
        it('Should return status 200', (done) => {

            const documentModified = {
                _id: `${lastInsertedId}`,
                title: "A modified title",
                content: "A modified content"
            }

            chai.request.execute(server)
            .put(`/documents/${lastInsertedId}`)
            .send(documentModified)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it('Should be equal to modified title', (done) => {
            chai.request.execute(server)
            .get(`/documents/${lastInsertedId}`)
            .end((err, res) => {
                res.body.data.title.should.equal("A modified title");
                done();
            });
        });
    });

    describe('DELETE /documents/:id', () => {
        it('Should return status 200', (done) => {
            chai.request.execute(server)
            .delete(`/documents/${lastInsertedId}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it('Should be null', (done) => {
            chai.request.execute(server)
            .get(`/documents/${lastInsertedId}`)
            .end((err, res) => {
                expect(res.body.data).to.be.null;
                done();
            });
        });
    });
});
