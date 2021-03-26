'use strict';

const Lab = require('@hapi/lab');
const {expect} = require('@hapi/code');
const {afterEach, beforeEach, describe, it} = exports.lab = Lab.script();
const {init} = require('../lib/server');

const beerTest = {"id":12345,"name":"testName","state":"stateTest","breweryId":1}


describe('POST /', () => {
    let server;
    beforeEach(async () => {
        server = await init();
    });
    afterEach(async () => {
        await server.stop();
    });

    it('ajout ok payload', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/biere',
                payload: `${beerTest}`
            });
        expect(res.statusCode).to.equal(201)
        expect(res.result).to.equal(beerTest)
    }) //json invalide
    it('ajout ko beer already exist', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/biere',
                payload: '{"id":2,"name":"test","state":"testState","breweryId":1}'
            });
        expect(res.statusCode).to.equal(403)
        expect(res.result).to.equal({error:"Il existe déjà une biere avec cet ID"})
    })
    it('ajout ko json invalide', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/biere',
                payload: '{"id":"oui","name":"test","state":"testState","breweryId":1}'
            });
        expect(res.statusCode).to.equal(400)
        expect(res.result).to.equal({error:"JSON invalide"})

    }) //beer id exists
    it('ajout ko breweryId ne correspond à aucun brewery', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/biere',
                payload: '{"id":"123342213","name":"test","state":"testState","breweryId":1234525342}'
            });
        expect(res.statusCode).to.equal(403)
        expect(res.result).to.equal({error:"brewery id ne correspond a aucun brewery"})
    })
})

describe('GET ', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('getall', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/api/v1/biere',
        });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);

    })
    it('get by id ok', async () => {
        const res = await server
            .inject({
            method: 'get',
            url: '/api/v1/biere/id/12345',
        });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Object);
        expect(res.result).to.equal(beerTest)
    })
    it('get by id ko', async () => {
        const res = await server
            .inject({
            method: 'get',
            url: '/api/v1/biere/id/3333333333',
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({"error":"not found"})
    })
    it('get by state ok', async () => {
        const res = await server
            .inject({
            method: 'get',
            url: `/api/v1/biere/state/stateTest`,
        });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);
        expect(res.result).to.equal([beerTest])
    })
    it('get by state ko', async () => {
        const res = await server
            .inject({
            method: 'post',
            url: `/api/v1/biere/state/dsfqsdfdgsdc`,
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error : "not found"})
    })
    it('get by brewery ok', async () => {
        const res = await server
            .inject({
            method: 'post',
            url: `/api/v1/biere/breweryId/1`,
        });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);
    })
    it('get by brewery ko', async () => {
        const res = await server
            .inject({
            method: 'post',
            url: `/api/v1/biere/breweryId/3123`,
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error : "not found"})
    })
});

describe('PATCH /', () => {
    let server;
    beforeEach(async () => {
        server = await init();
    });
    afterEach(async () => {
        await server.stop();
    });

    it('update ok du nom de la biere id=3', async () => {
        const res = await server
            .inject({
                method: 'patch',
                url: `/api/v1/biere/${beerTest.id}`,
                payload: `"{"name":"test2","state":"testState","breweryId":1}`
        });
        beerTest.name = "test2"
        expect(res.statusCode).to.equal(202)
        expect(res.result).to.equal(beerTest)
    })
    it('update ko du brewery invalide', async () => {
        const res = await server
            .inject({
                method: 'patch',
                url: `/api/v1/biere/${beerTest.id}`,
                payload: `"{"breweryId":1233423543421}`
        });
        expect(res.statusCode).to.equal(400)
        expect(res.result).to.equal({error:"brewery id ne correspond a aucun brewery"})
    })
    it('update ko id biere introuvable', async () => {
        const res = await server.inject({
            method: 'patch',
            url: '/api/v1/biere/231452433',
            payload: `{"name":"test2","state":"testState","breweryId":1}`
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error:"l'id de la biere est introuvable"})
    })
})

describe('DELETE /', () => {
    let server;
    beforeEach(async () => {
        server = await init();
    });
    afterEach(async () => {
        await server.stop();
    });

    it('Suppression ok id 2', async () => {
        const res = await server.inject({
            method: 'delete',
            url: `/api/v1/biere/delete/${beerTest.id}`,
        });
        expect(res.result).to.equal(beerTest)
        expect(res.statusCode).to.equal(200)
    })
    it('Suppression ko id 3', async () => {
        const res = await server.inject({
            method: 'delete',
            url: `/api/v1/biere/delete/${beerTest.id}`,
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error:"pas de biere trouvé avec cet id"})
    })
})
