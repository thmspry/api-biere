const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');

const schemaBrewery = Joi.object({
    id: Joi.number(),
    nameBreweries: Joi.string(),
    city : Joi.string()
});

const schemaBreweries =  Joi.array().items(schemaBrewery);

const schemaBeer = Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    state : Joi.string(),
    breweryId : Joi.number()
});

const schemaBeers =  Joi.array().items(schemaBrewery);

const brewerieControleur = require("../controleur/brewerie_controleur");
const beerControleur = require("../controleur/beer_controleur");
const authControleur = require("../controleur/authentification_controleur");
const routes = [

    // -------- Routes relatives aux BRASSERIES --------

    { // Récupère toutes les brasseries existantes | Testé ✅
        method: 'GET',
        path: '/api/v1/brasserie',
        options: {
            auth: false,
            description: 'Obtenir la liste de toutes les brasseries',
            notes: 'Renvoie un tableau de brasseries',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête',
                            schema:  schemaBreweries.default([{id: 165, nameBreweries: 'Brasserie Bnifontaine', city: 'Bnifontaine'},
                                {id: 177, nameBreweries: 'Brasserie De Saint Sylvestre', city: 'St-Sylvestre-Cappel'}])
                        },
                        '404': {
                            'description': 'tableau vide aucune brasserie',
                        }
                    },

                }
            },
            tags: ['api','get','all','brasseries','brewerie'],
            handler:  brewerieControleur.getAll
        },
    },
    {   // Remplis la base de données de brasseries | Testé ✅
        method: 'GET',
        path: '/api/v1/brasserie/populate',
        options: {
            description: 'Remplis la base de données de brasseries',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Base de données remplie',
                        },
                        '401': {
                            'description': 'Erreurs authentification',
                        },
                    },

                }
            },

            tags: ['api','get','populate','brasseries','brewerie'],
            handler: brewerieControleur.populateBreweries
        }
    },

    { // Recherche une brewery par ID | Testé ✅
        method: 'GET',
        path: '/api/v1/brasserie/id/{id}',
        options: {
            auth: false,
            description: 'Recherche d une brasserie par ID',
            notes: 'L ID est donné dans l URI',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête : objet Brasserie',
                            schema : schemaBrewery.default({id: 165, nameBreweries: 'Brasserie Bnifontaine', city: 'Bnifontaine'})
                        },
                        '404': {
                            'description': 'Not found : Pas de brasserie avec cet ID'
                        }
                    },

                },
            },
            validate: {
                params: Joi.object({
                    id: Joi.number()
                        .required()
                        .description("L'ID de la brasserie")})
            },
            tags: ['api', 'get', 'recherche', 'id','brasseries','brewerie'],
            handler: brewerieControleur.findById
        },


    },


    {  // Rechercher un/des brewery(s) par city  | Testé ✅
        method: 'GET',
        path: '/api/v1/brasserie/city/{city}',
        options: {
            auth: false,
            description: 'Recherche d une brasserie par ville',
            notes: 'La ville est donné dans l URI',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête : objet Brasserie',
                            schema:  schemaBreweries.default([{id: 165, nameBreweries: 'Brasserie Bnifontaine', city: 'Bnifontaine'},
                                {id: 177, nameBreweries: 'Brasserie De Saint Sylvestre', city: 'St-Sylvestre-Cappel'}])
                        },
                        '404': {
                            'description': 'Not found : Aucune brasserie n est de cette ville'
                        }
                    },

                }
            },
            validate: {
                params: Joi.object({
                    city: Joi.string()
                        .required()
                        .description("Une ville")})
            },
            tags: ['api', 'get', 'recherche', 'city','brasseries','brewerie'],
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
                        '201': {
                            'description': 'Bonne requête : La brasserie est ajoutée',
                            schema : schemaBrewery.default({id: 165, nameBreweries: 'Brasserie Bnifontaine', city: 'Bnifontaine'})
                        },
                        '404': {
                            'description': 'Erreur format du payload'
                        },
                        '403': {
                            'description': 'Id dejà existant'
                        },
                        '401': {
                            'description': 'Erreurs authentification'
                        },
                    },

                }
            },
            tags: ['api', 'post', 'add','brasseries','brewerie'],
            handler: brewerieControleur.add
        },

    },

    {  // Supprime un brasserie par ID | Testé ✅
        method: 'DELETE',
        path: '/api/v1/brasserie/delete/{id}',
        options: {
            description: 'Supprime une brasserie suivant sont ID',
            notes: 'L ID est donné dans l URL, renvoie la brasserie supprimée si pas de problème',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête : La brasserie est supprimée',
                            schema : schemaBrewery.default({id: 165, nameBreweries: 'Brasserie Bnifontaine', city: 'Bnifontaine'})
                        },
                        '404': {
                            'description': 'Erreurs diverses'
                        }
                    },

                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.number()
                        .required()
                        .description("L'ID de la brasserie")})
            },
            tags: ['api', 'get', 'delete', 'id','brasseries','brewerie'],
            handler: brewerieControleur.deleteById
        },

    },
    {  // Modifie une brasserie (tous les attributs de la brasserie
        method: 'PUT',
        path: '/api/v1/brasserie/{id}',
        options: {
            description: 'Modifie une brasserie',
            notes: 'Modifie une brasserie suivant sont ID',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Bonne requête : La brasserie est modifiée',
                            schema : schemaBrewery.default({id: 165, nameBreweries: 'Brasserie Bnifontaine', city: 'Bnifontaine'})
                        },
                        '404': {
                            'description': 'Erreurs format JSon du payload ou ID déjà pris si sa valeur est changé ou bien id d une brasserie non existant'
                        }
                    },

                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.number()
                        .required()
                        .description("L'ID de la brasserie")})
            },
            tags: ['api', 'get', 'edit','modify', 'id','brasseries','brewerie'],
            handler: brewerieControleur.editById
        },

    },


    // -------- Routes relatives aux BIERES --------

    {
        method: 'GET',
        path: '/api/v1/biere/id/{id}',
        options: {
            auth: false,
            description: 'Recherche d une biere par ID',
            notes: 'L ID est donné dans l URI',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête : objet Biere',
                            schema:  schemaBeer.default({id: 165, name: 'La beer', state: 'Germany', breweryId :3})
                        },
                        '404': {
                            'description': 'Not found : Pas de biere avec cet ID'
                        }
                    },

                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.number()
                        .required()
                        .description("L'ID de la bière")})
            },
            tags: ['api', 'get', 'recherche', 'id','biere','beer'],
            handler: beerControleur.findById
        }

    },
    {
        method: 'GET',
        path: '/api/v1/biere/state/{state}',
        options: {
            auth: false,
            description: 'Recherche d une brasserie par état (state)',
            notes: 'Létat (state) est donné dans l URI',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête : objet Biere',
                            schema:  schemaBeers.default([{id: 165, name: 'La beer', state: 'Germany', breweryId :3},
                                {id: 170, name: 'La beer', state: 'Germany', breweryId :3}])
                        },
                        '404': {
                            'description': 'Not found : Pas de biere provenant de cet état (state)'
                        }
                    },

                }
            },
            validate: {
                params: Joi.object({
                    state: Joi.string()
                        .required()
                        .description("Le pays d'origine de la biere")})
            },
            tags: ['api', 'get', 'biere', 'beer','recherche', 'state'],
            handler: beerControleur.findByState
        }
    },
    {
        method: 'GET',
        path: '/api/v1/biere/breweryId/{breweryId}',
        options: {
            auth: false,
            description: 'Recherche d une biere par brasserie (brewery)',
            notes: 'L ID de la brasserie (breweryId) est donné dans l URI',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête : objet Biere',
                            schema:  schemaBeers.default([{id: 165, name: 'La beer', state: 'Germany', breweryId :3},
                                {id: 165, name: 'La beer CREAMY DE LUXE', state: 'Germany', breweryId :3}])
                        },
                        '404': {
                            'description': 'Not found : Pas de biere provenant de cette brasserie (brewery)'
                        }
                    },

                }
            },
            validate: {
                params: Joi.object({
                    breweryId: Joi.number()
                        .required()
                        .description("L'ID de la brasserie relative à la bière")})
            },
            tags: ['api', 'get', 'biere', 'beer','recherche', 'breweryId'],
            handler: beerControleur.findByBrewId
        }
    },
    {
        method: 'DELETE',
        path: '/api/v1/biere/delete/{id}',
        options: {
            description: 'Supprime une biere suivant sont ID',
            notes: 'L ID de la biere est donné dans l URI',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête : la biere est supprimée + objet Biere ',
                            schema:  schemaBeer.default({id: 165, name: 'La beer', state: 'Germany', breweryId :3})
                        },
                        '401': {
                            'description': 'Erreurs authentification'
                        },
                        '404': {
                            'description': 'Not found : Pas de biere avec de id'
                        }
                    },

                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.number()
                        .required()
                        .description("L'ID de la bière")})
            },
            tags: ['api', 'delete', 'biere', 'beer','suppression', 'id'],
            handler: beerControleur.deleteById
        }
    },
    {
        method: 'POST',
        path: '/api/v1/biere',
        options: {
            description: 'Ajoute d une biere',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Bonne requête : la biere est ajoutée + objet Biere ',
                            schema:  schemaBeer.default({id: 165, name: 'La beer', state: 'Germany', breweryId :3})
                        },
                        '403': {
                            'description': 'Erreurs diverses'
                        }
                    },
                }
            },
            tags: ['api', 'post', 'biere', 'beer','ajout'],
            handler: beerControleur.add
        }
    },
    {
        method: 'PATCH',
        path: '/api/v1/biere/{id}',
        options: {
            description: 'Modifie une biere',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '202': {
                            'description': 'Bonne requête : la biere est modifiée + objet Biere ',
                            schema:  schemaBeer.default({id: 165, name: 'La beer', state: 'Germany', breweryId :3})
                        },
                        '400': {
                            'description': 'Erreurs diverses'
                        },
                        '401': {
                            'description': 'Erreurs authentification'
                        },
                        '404': {
                            'description': 'Not found : pas de bière trouvée'
                        }
                    },
                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.number()
                        .required()
                        .description("L'ID de la bière")})
            },
            tags: ['api', 'patch', 'biere', 'beer','update','edit','modifier'],
            handler: beerControleur.update
        }
    },
    {
        method: 'GET',
        path: '/api/v1/biere',
        options: {
            auth: false,
            description: 'Obtenir la liste des bières',
            notes: 'Renvoie un tableau de bières ',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête',
                            schema:  schemaBeers.default([{id: 165, name: 'La beer', state: 'Germany', breweryId :3},
                                {id: 170, name: 'La beer DE LUXE', state: 'Germany', breweryId :3}])
                        },
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
        options: {
            description: 'Remplis la base de données de bieres',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Base de données remplie',
                        },
                        '401': {
                            'description': 'Erreurs authentification',
                        }
                    },

                }
            },

            tags: ['api','populate','get'],
            handler: beerControleur.populateBeers
        }
    },

    // ------- Routes relative à l'authentification

    {
        method: 'GET',
        path: '/api/v1/generate/{id}/{name}',
        options: {
            auth: false,
            description: 'Génère une key',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Succès : clé',
                        },
                    },

                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.number()
                        .required()
                        .description("Un ID d'authentification"),
                    name: Joi.string()
                        .required()
                        .description('Un nom d\'authentification')
                })
            },
            tags: ['api','register','get'],
            handler: authControleur.register
        },
    },


    // ------- Route par défaut -------
    {
        method: "*",
        path: '/{any*}',
        handler: (request, h) => {
            return h.response({error: "Page Not FOUND !"}).code(404)
        }
    },
];
module.exports = routes;
