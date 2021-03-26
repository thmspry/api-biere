'use strict';

const Lab = require('@hapi/lab');
const {expect} = require('@hapi/code');
const {afterEach, beforeEach, describe, it} = exports.lab = Lab.script();
const {init} = require('../lib/server');

describe('GET ', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('/api/v1/brasserie/responds with model', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/api/v1/brasserie'
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.be.instanceof(Array);
    });

    it('Generate avec un id non utilisé', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/api/v1/generate/2/test'
        });
        expect(res.statusCode).to.equal(200);
    });

    it('Generate avec un id utilisé', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/api/v1/generate/1/test'
        });
        expect(res.statusCode).to.equal(400);
        expect(res.result).to.equal({ error: 'user ID already exists' });
    });

});