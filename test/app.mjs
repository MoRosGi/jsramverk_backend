/* global it describe */
import { config } from '../config.mjs'
config.nodeEnv = 'test';

import {use} from 'chai';
import chaiHttp from 'chai-http/index.js';
import server from '../app.mjs';

const chai = use(chaiHttp);
chai.should();

describe('app', () => {
    describe('GET /documents', () => {
        it('Should return status 200', (done) => {
            chai.request.execute(server)
                .get("/documents/")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });
});


