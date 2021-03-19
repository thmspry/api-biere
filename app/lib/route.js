const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');

const schemaBrewery = Joi.object({
    id: Joi.number(),
    nameBreweries: Joi.string(),
    city : Joi.string()
});

const schemaBreweries =  Joi.array().items(schemaBrewery);

const brewerieControleur = require("../controleur/brewerie_controleur");
const beerControleur = require("../controleur/beer_controleur");
const routes = [
    {
        method: 'GET',
        path: '/api/v1/brasserie',
        options: {
            description: 'Obtenir la liste des brasseries',
            notes: 'Renvoie un tableau de brasseries ',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête',
                            schema : schemaBreweries.default([{id: 165, nameBreweries: 'Brasserie Bnifontaine', city: 'Bnifontaine'},
                                {id: 177, nameBreweries: 'Brasserie De Saint Sylvestre', city: 'St-Sylvestre-Cappel'}])

                        }
                    },

                }
            },

            tags: ['api'],
            handler:  brewerieControleur.getAll


        },
    },
    {
        method: 'GET',
        path: '/api/v1/brasserie/populate',
        handler: brewerieControleur.populateBreweries
    },
    {
        method: 'GET',
        path: '/api/v1/biere/byId/{id}',
        handler: beerControleur.findById
    },
    {
        method: 'GET',
        path: '/api/v1/biere/byState/{state}',
        handler : beerControleur.findByState
    },
    {
        method: 'GET',
        path: '/api/v1/biere/byBrewId/{breweryId}',
        handler: beerControleur.findByBrewId
    },
    {
        method: 'GET',
        path: '/api/v1/biere/delete/{id}',
        handler: beerControleur.deleteById
    },
        path: '/api/v1/brasserie/populate',
        handler: brewerieControleur.populateBreweries
    },
    {
        method: 'GET',
        path: '/api/v1/biere',
        options: {
            description: 'Obtenir la liste des bières',
            notes: 'Renvoie un tableau de bières ',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête',
                            schema : schemaBreweries.default([{id: 165, nameBreweries: 'Brasserie Bnifontaine', city: 'Bnifontaine'},
                                {id: 177, nameBreweries: 'Brasserie De Saint Sylvestre', city: 'St-Sylvestre-Cappel'}])

                        }
                    },

                }
            },
            tags: ['api'],
            handler:  beerControleur.getAll
        },

    },
    {
        method: 'GET',
        path: '/api/v1/biere/populate',
        handler: beerControleur.populateBeers
    }
];
module.exports = routes;