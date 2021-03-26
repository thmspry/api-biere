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
const authControleur = require("../controleur/authentification_controleur");
const routes = [

    // -------- Routes relatives aux BRASSERIES --------

    { // Récupère toutes les brasseries existantes | Testé ✅
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
    {   // Remplis la base de données de brasseries | Testé ✅
        method: 'GET',
        path: '/api/v1/brasserie/populate',
        handler: brewerieControleur.populateBreweries
    },


    { // Recherche une brewery par ID | Testé ✅
        method: 'GET',
        path: '/api/v1/brasserie/id/{id}',
        options: {
            description: 'Recherche d une brasserie par ID',
            notes: 'L ID est donné dans l URL',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête'
                        },
                        '404': {
                            'description': 'Pas de brasserie'
                        }
                    },

                }
            },
            tags: ['api', 'get', 'recherche', 'id'],
            handler: brewerieControleur.findById
        },

    },


    {  // Rechercher un/des brewery(s) par city  | Testé ✅
        method: 'GET',
        path: '/api/v1/brasserie/city/{city}',
        options: {
            description: 'Recherche d une brasserie par ville',
            notes: 'La ville est donné dans l URL',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête'
                        },
                        '404': {
                            'description': 'Pas de brasserie'
                        }
                    },

                }
            },
            tags: ['api', 'get', 'recherche', 'city'],
            handler: brewerieControleur.findByCity
        },

    },


    { // Ajout d'une brasserie | Testé ✅
        method: 'POST',
        path: '/api/v1/brasserie',
        options: {
            description: 'Ajoute une brasserie',
            notes: 'L objet Brasserie doit être dans l entête de la requête',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête'
                        },
                        '404': {
                            'description': 'Erreur'
                        }
                    },

                }
            },
            tags: ['api', 'post', 'add'],
            handler: brewerieControleur.add
        },

    },

    {  // Supprime un brasserie par ID | Testé ✅
        method: 'GET',
        path: '/api/v1/brasserie/delete/{id}',
        options: {
            description: 'Supprime une brasserie suivant sont ID',
            notes: 'L ID est donné dans l URL, renvoie la brasserie supprimée si pas de problème',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête'
                        },
                        '404': {
                            'description': 'Pas de brasserie correspondante'
                        }
                    },

                }
            },
            tags: ['api', 'get', 'delete', 'id'],
            handler: brewerieControleur.deleteById
        },

    },

    {  // Modifie une brasserie
        method: 'POST',
        path: '/api/v1/brasserie/edit/{id}',
        options: {
            description: 'Modifie une brasserie',
            notes: 'Modifie une brasserie suivant sont ID',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête'
                        },
                        '404': {
                            'description': 'Pas de brasserie correspondante'
                        }
                    },

                }
            },
            tags: ['api', 'get', 'edit', 'id'],
            handler: brewerieControleur.editById
        },

    },


    // -------- Routes relatives aux BIERES --------

    {
        method: 'GET',
        path: '/api/v1/biere/id/{id}',
        handler: beerControleur.findById
    },
    {
        method: 'GET',
        path: '/api/v1/biere/state/{state}',
        handler : beerControleur.findByState
    },
    {
        method: 'GET',
        path: '/api/v1/biere/breweryId/{breweryId}',
        handler: beerControleur.findByBrewId
    },
    {
        method: 'GET',
        path: '/api/v1/biere/delete/{id}',
        handler: beerControleur.deleteById
    },
    {
        method: 'POST',
        path: '/api/v1/biere',
        handler: beerControleur.add
    },
    {
        method: 'PATCH',
        path: '/api/v1/biere',
        handler: beerControleur.update
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
        config: { auth: 'jwt' },
        handler: beerControleur.populateBeers
    },

    // ------- Routes relative à l'authentification

    {
        method: 'GET',
        path: '/api/v1/generate/{id}/{name}',
        handler: authControleur.register
    },
];
module.exports = routes;
