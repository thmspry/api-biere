'use strict';

const Lab = require('@hapi/lab');
const {expect} = require('@hapi/code');
const {afterEach, beforeEach, before, describe, it} = exports.lab = Lab.script();
const {init, clearUsers} = require('../lib/server');

const beerTest = {"id":12345,"name":"testName","state":"stateTest","breweryId":1}
const breweryTest = {"id":5,"nameBreweries":"Abbaye de Leffe","city":"Dinant"}


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
                payload: '{"id":12345,"name":"testName","state":"stateTest","breweryId":1}'
            });
        console.log(res.result);
        expect(res.statusCode).to.equal(201)
        expect(res.result).to.equal(beerTest)
    })
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

    // ---------------- BRASSERIE ----------------

    it('ajout ok payload Br', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/brasserie',
                payload: '{"id":123456,"nameBreweries":"testName","city":"cityTest"}'
            });
        expect(res.statusCode).to.equal(201)
        expect(res.result).to.equal(beerTest)
    })
    it('ajout ko breweries already exist', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/brasserie',
                payload: '{"id":2,"nameBreweries":"testName","city":"cityTest"}'
            });
        expect(res.statusCode).to.equal(403)
        expect(res.result).to.equal({error:"Il existe déjà une biere avec cet ID"})
    })
    it('ajout ko json invalide Br', async () => {
        const res = await server
            .inject({
                method: 'post',
                url: '/api/v1/brasserie',
                payload: '{"id":"jesuisunsstring","nameBreweries":"testName","city":"cityTest"}'
            });
        expect(res.statusCode).to.equal(400)
        expect(res.result).to.equal({error:"JSON invalide"})

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
        expect(res.result.dataValues).to.equal(beerTest)
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
        expect(res.result[0].dataValues).to.equal(beerTest)
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
    it('get by brewery ok', async () => {
        const res = await server
            .inject({
            method: 'get',
            url: `/api/v1/biere/breweryId/1`,
        });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);
    })
    it('get by brewery ko', async () => {
        const res = await server
            .inject({
            method: 'get',
            url: `/api/v1/biere/breweryId/3123`,
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

    it('getall Br', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/api/v1/brasserie',
        });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);
    })

    it('get by id ok Br', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: '/api/v1/brasserie/id/5',
            });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Object);
        expect(res.result.dataValues).to.equal(breweryTest)
    })

    it('get by id ko Br', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: '/api/v1/brasserie/id/99999444844484842',
            });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({"error":"not found"})
    })

    it('get by city ok Br', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: `/api/v1/brasserie/state/Dinant`,
            });
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.be.instanceof(Array);
        expect(res.result[0].dataValues).to.equal(breweryTest)
    })
    it('get by city ko Br', async () => {
        const res = await server
            .inject({
                method: 'get',
                url: `/api/v1/brasserie/state/pftpktptptk`,
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
                payload: '{"name":"test2","state":"stateTest","breweryId":1}'
        });
        beerTest.name = "test2"
        expect(res.statusCode).to.equal(202)
        expect(res.result.dataValues).to.equal(beerTest)
    })
    it('update ko du brewery invalide', async () => {
        const res = await server
            .inject({
                method: 'patch',
                url: `/api/v1/biere/${beerTest.id}`,
                payload: `{"breweryId":1233423543421}`
        });
        expect(res.statusCode).to.equal(400)
        expect(res.result).to.equal({error:"brewery id ne correspond a aucun brewery"})
    })
    it('update ko id biere introuvable', async () => {
        const res = await server.inject({
            method: 'patch',
            url: '/api/v1/biere/231452433',
            payload: '{"name":"test2","state":"testState","breweryId":1}'
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

    it('Suppression ok id 12345', async () => {
        const res = await server.inject({
            method: 'delete',
            url: `/api/v1/biere/delete/${beerTest.id}`,
        });
        expect(res.result).to.equal({message:"Biere d'id n°12345 suppriméee"})
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


    // ---------------- BRASSERIE ----------------

    it('Suppression ok id 5 Br', async () => {
        const res = await server.inject({
            method: 'delete',
            url: `/api/v1/biere/delete/${breweryTest.id}`,
        });
        expect(res.result).to.equal(breweryTest)
        expect(res.statusCode).to.equal(200)
    })
    it('Suppression ko id 9999999999', async () => {
        const res = await server.inject({
            method: 'delete',
            url: `/api/v1/biere/delete/9999999999`,
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error:"pas de brasserie trouvé avec cet id"})
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

    it('update ok du nom de la brasseries id=5', async () => {
        const res = await server
            .inject({
                method: 'put',
                url: `/api/v1/brasserie/${breweryTest.id}`,
                payload: '{"id": 2222222222,"nameBreweries":"testName","city":"cityTest"}'
            });
        beerTest.name = "test2"
        expect(res.statusCode).to.equal(200)
        expect(res.result.dataValues).to.equal({"id": 2222222222,"nameBreweries":"testName","city":"cityTest"})
    })
    it('update ko id brasseries existe deja', async () => {
        const res = await server.inject({
            method: 'put',
            url: `/api/v1/brasserie/${breweryTest.id}`,
            payload: '{"id":6,"nameBreweries":"testName","city":"cityTest"}'
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error: "La brasserie a modifier n'existe pas"})
    })

    it('update ko id brasseries a modif introuvable', async () => {
        const res = await server.inject({
            method: 'put',
            url: '/api/v1/brasserie/2314524373',
            payload: '{"name":"test2","state":"testState","breweryId":1}'
        });
        expect(res.statusCode).to.equal(404)
        expect(res.result).to.equal({error: "La brasserie a modifier n'existe pas"})
    })
})
