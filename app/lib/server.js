'use strict';
const Hapi = require('@hapi/hapi');

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');

const AuthJwt = require('hapi-auth-jwt2');
const jwt = require('jsonwebtoken');

const Models = require("../model/");
const authControleur = require("../controleur/authentification_controleur");


const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});
const swaggerOptions = {
    info: {
        title: 'Breweries API Documentation',
        version: '0.0.1'
    },
    debug: true
};

const validate = async function (decoded, request, h) {
    if (await authControleur.validAuth(decoded.id)) {
        return {isValid: false};
    } else {
        return {isValid: true};
    }
};

const config = async () => {
    await server.register([{
        plugin: AuthJwt
    },Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }])

    server.auth.strategy('jwt', 'jwt',
        {
            key: require('../config/config').myKey,
            validate
        });

    server.auth.default('jwt');

    server.log('info', 'Auth strategy created: github')
    server.log('info', 'Plugin registered: authentication with strategy github')

};
server.route(require('./route'));

module.exports.init = async () => {

    await server.initialize();
    return server;
};

module.exports.start = async () => {
    console.log('-- Synchronization --');
    await Models.sequelize.sync({ force: false });

    await config();

    /*
    const injectOptions = {
        method: 'GET',
        url: '/api/v1/brasserie/populate',
    }
    await server.inject(injectOptions);

     const injectOptionsBeers = {
        method: 'GET',
        url: '/api/v1/biere/populate',
    }
    await server.inject(injectOptionsBeers);
    console.log('-- Populate done --');
    */
    await server.start();

    console.log(`Server running at: ${server.info.uri}`);
    return server;
};


process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

