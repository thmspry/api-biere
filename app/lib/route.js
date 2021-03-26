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
            auth: false,
            description: 'Obtenir la liste de toutes les brasseries',
            notes: 'Renvoie un tableau de brasseries',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête',
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
                            'description': 'Bonne requête : objet Brasserie'
                        },
                        '404': {
                            'description': 'Not found : Pas de brasserie avec cet ID'
                        }
                    },

                }
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
                            'description': 'Bonne requête : objet Brasserie'
                        },
                        '404': {
                            'description': 'Not found : Aucune brasserie n est de cette ville'
                        }
                    },

                }
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
                            'description': 'Bonne requête : La brasserie est ajoutée'
                        },
                        '404': {
                            'description': 'Erreurs diverses'
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
        path: '/api/v1/brasserie/{id}',
        options: {
            description: 'Supprime une brasserie suivant sont ID',
            notes: 'L ID est donné dans l URL, renvoie la brasserie supprimée si pas de problème',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Bonne requête : La brasserie est supprimée'
                        },
                        '404': {
                            'description': 'Erreurs diverses'
                        }
                    },

                }
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
                            'description': 'Bonne requête : La brasserie est modifiée'
                        },
                        '404': {
                            'description': 'Erreurs diverses'
                        }
                    },

                }
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
                            'description': 'Bonne requête : objet Biere'
                        },
                        '404': {
                            'description': 'Not found : Pas de biere avec cet ID'
                        }
                    },

                }
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
                            'description': 'Bonne requête : objet Biere'
                        },
                        '404': {
                            'description': 'Not found : Pas de biere provenant de cet état (state)'
                        }
                    },

                }
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
                            'description': 'Bonne requête : objet Biere'
                        },
                        '404': {
                            'description': 'Not found : Pas de biere provenant de cette brasserie (brewery)'
                        }
                    },

                }
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
                            'description': 'Bonne requête : la biere est supprimée + objet Biere '
                        },
                        '403': {
                            'description': 'Erreur : JWT non valide'
                        },
                        '404': {
                            'description': 'Not found : Pas de biere avec de id'
                        }
                    },

                }
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
                            'description': 'Bonne requête : la biere est ajoutée + objet Biere '
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
                        '200': {
                            'description': 'Bonne requête : la biere est ajoutée + objet Biere '
                        },
                        '403': {
                            'description': 'Erreurs diverses'
                        },
                        '404': {
                            'description': 'Not found : pas de bière trouvée'
                        }
                    },
                }
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
        options: {
            description: 'Remplis la base de données de bieres',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Base de données remplie',
                        },
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

            tags: ['api','register','get'],
            handler: authControleur.register
        },
    },

];
module.exports = routes;
