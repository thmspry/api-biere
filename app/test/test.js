'use strict';

const Lab = require('@hapi/lab');
const {expect} = require('@hapi/code');
const {afterEach, beforeEach, before, describe, it} = exports.lab = Lab.script();
const {init, clearUsers} = require('../lib/server');

const breweryTest = {"id":123456,"nameBreweries":"testName","city":"cityTest"}
const beerTest = {"id":12345,"name":"testName","state":"stateTest","breweryId":123456}


describe('POST /', () => {
    let server;
    beforeEach(async () => {
        server = await init();
    });
    afterEach(async () => {
        await server.stop();
    });

    // ---------------- BRASSERIE ----------------

    it('ajout Brasserie payload ok', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/brasserie',
                payload: '{"id":123456,"nameBreweries":"testName","city":"cityTest"}'
            });
        expect(res.statusCode).to.equal(201)
        expect(res.result).to.equal({"id":123456,"nameBreweries":"testName","city":"cityTest"})
    })
    it('ajout Brasserie payload ko already exist', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/brasserie',
                payload: '{"id":123456,"nameBreweries":"testName","city":"cityTest"}'
            });
        expect(res.statusCode).to.equal(403)
        expect(res.result).to.equal({error:"Il existe déjà une brasserie avec cet ID"})
    })
    it('ajout Brasserie ko json invalide', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/brasserie',
                payload: '{"id":"jesuisunsstring","nameBreweries":"testName","city":"cityTest"}'
            });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error:"request error : id is Not a Number"})
    })
    it('ajout Brasserie ko json invalide 2', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/brasserie',
                payload: ''
            });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error: "request error : undefinded payload"})
    })

    // ---------------- BIERE ----------------

    it('ajout Biere ok payload', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/biere',
                payload: '{"id":12345,"name":"testName","state":"stateTest","breweryId":123456}'
            });
        expect(res.statusCode).to.equal(201)
        expect(res.result).to.equal({"id":12345,"name":"testName","state":"stateTest","breweryId":123456})
    })
    it('ajout Biere ko beer already exist', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/biere',
                payload: '{"id":12345,"name":"test","state":"testState","breweryId":123456}'
            });
        expect(res.statusCode).to.equal(403)
        expect(res.result).to.equal({error:"Il existe déjà une biere avec cet ID"})
    })
    it('ajout ko json invalide', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/biere',
                payload: '{"id":"oui","name":"test","state":"testState","breweryId":123456}'
            });
        expect(res.statusCode).to.equal(400)
        expect(res.result).to.equal({error:"JSON invalide"})
    })

    it('ajout ko breweryId ne correspond à aucun brewery', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/biere',
                payload: '{"id":"123342213","name":"test","state":"testState","breweryId":1234525342}'
            });
        expect(res.statusCode).to.equal(400)
        expect(res.result).to.equal({error:"brewery id ne correspond a aucun brewery"})
    })
})


describe('GET ', () => {
    let server;

    before(async () => {
        await clearUsers();
    })

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('Get all Bieres', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/api/v1/biere',
        });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);

    })
    it('get Biere by id ok', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: '/api/v1/biere/id/12345',
            });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Object);
        expect(res.result.dataValues).to.equal({"id":12345,"name":"testName","state":"stateTest","breweryId":123456})
    })
    it('get Biere by id ko', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: '/api/v1/biere/id/3333333333',
            });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({"error":"not found"})
    })
    it('get Biere by state ok', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: `/api/v1/biere/state/stateTest`,
            });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);
        expect(res.result[0].dataValues).to.equal({"id":12345,"name":"testName","state":"stateTest","breweryId":123456})
    })
    it('get by state ko', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: `/api/v1/biere/state/dsfqsdfdgsdc`,
            });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error : "not found"})
    })
    it('get Biere by breweryID ok', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: `/api/v1/biere/breweryId/123456`,
            });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);
    })
    it('get Biere by breweryID ko', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: `/api/v1/biere/breweryId/31233543`,
            });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error : "not found"})
    })
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

    // ---------------- BRASSERIE ----------------

    it('getall Brasserie', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/api/v1/brasserie',
        });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);
    })

    it('get Brasserie by id ok', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: '/api/v1/brasserie/id/123456',
            });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Object);
        expect(res.result.dataValues).to.equal({"id":123456,"nameBreweries":"testName","city":"cityTest"})
    })

    it('get Brasserie by id ko', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: '/api/v1/brasserie/id/99999444844484842',
            });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({"error":"not found"})
    })

    it('get Brasserie by city ok', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: `/api/v1/brasserie/city/cityTest`,
            });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);
        expect(res.result[0].dataValues).to.equal({"id":123456,"nameBreweries":"testName","city":"cityTest"})
    })
    it('get Brasserie by city ko', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: `/api/v1/brasserie/city/pftpktptptk`,
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

    it('update ok du nom de la biere id=12345', async () => {
        const res = await server
            .inject({
                method: 'patch',
                url: `/api/v1/biere/12345`,
                payload: '{"name":"testName2","state":"stateTest","breweryId":123456}'
        });
        expect(res.statusCode).to.equal(202)
        expect(res.result.dataValues).to.equal({"id":12345,"name":"testName2","state":"stateTest","breweryId":123456})
    })
    it('update ko du breweryID de la biere id=12345 invalide', async () => {
        const res = await server
            .inject({
                method: 'patch',
                url: `/api/v1/biere/12345`,
                payload: `{"breweryId":1233423543421}`
        });
        expect(res.statusCode).to.equal(400)
        expect(res.result).to.equal({error:"brewery id ne correspond a aucun brewery"})
    })
    it('update ko id biere introuvable', async () => {
        const res = await server.inject({
            method: 'patch',
            url: '/api/v1/biere/231452433',
            payload: '{"name":"test2","state":"testState","breweryId":123456}'
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error:"l'id de la biere est introuvable"})
    })
})

describe('PUT /', () => {
    let server;
    beforeEach(async () => {
        server = await init();
    });
    afterEach(async () => {
        await server.stop();
    });

    it('update ok du nom de la brasserie id=123456', async () => {
        const res = await server
            .inject({
                method: 'put',
                url: `/api/v1/brasserie/123456`,
                payload: '{"id": 123456,"nameBreweries":"testName2","city":"cityTest"}'
            });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.equal({"id": 123456,"nameBreweries":"testName2","city":"cityTest"})
    })
    it('update ko du nom de la brasserie id=123456', async () => {
        const res = await server.inject({
            method: 'put',
            url: `/api/v1/brasserie/1234563578`,
            payload: '{"id":123456,"nameBreweries":"testName","city":"cityTest"}'
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error: "La brasserie a modifier n'existe pas"})
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

    it('Suppression ok id 12345', async () => {
        const res = await server.inject({
            method: 'delete',
            url: `/api/v1/biere/delete/12345`,
        });
        expect(res.result).to.equal({message:"Biere d'id n°12345 supprimée"})
        expect(res.statusCode).to.equal(200)
    })
    it('Suppression ko id 1236546552', async () => {
        const res = await server.inject({
            method: 'delete',
            url: `/api/v1/biere/delete/1236546552`,
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error:"pas de biere trouvé avec cet id"})
    })

    // ---------------- BRASSERIE ----------------

    it('Suppression ok id 123456 Br', async () => {
        const res = await server.inject({
            method: 'delete',
            url: `/api/v1/brasserie/delete/123456`,
        });
        expect(res.result).to.equal({message:"Brasserie d'id n°123456 supprimée"})
        expect(res.statusCode).to.equal(200)
    })
    it('Suppression ko id 9999999999', async () => {
        const res = await server.inject({
            method: 'delete',
            url: `/api/v1/brasserie/delete/9999999999`,
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error:"pas de brasserie trouvé avec cet id"})
    })
})
