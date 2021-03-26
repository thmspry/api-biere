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

// Graphql
const {ApolloServer} = require('apollo-server-hapi');
const typeDefs = require('../graphql/typeDefs')
const resolvers = require('../graphql/resolvers')

const servApollo = new ApolloServer({
    typeDefs,
    resolvers,
    introspection:true,
    playground:true,
    context : ({req}) => {
        const token = req.headers.authorization
    }
});


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
    await server.register([
        {
            plugin: AuthJwt
        },
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
        ])

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

    await authControleur.clearAll();
    const injectOptionsUsers = {
        method: 'GET',
        url: '/api/v1/generate/1/admin',
    }
    await server.inject(injectOptionsUsers);

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
    try {
        await servApollo.applyMiddleware({
            app:server
        })
        await servApollo.installSubscriptionHandlers(server.listener)
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
        return server;
    } catch (e){
        console.log(`Error while starting server : ${e.message}`)
        return null
    }

};


process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});


module.exports.clearUsers = async () => {
    await authControleur.clearAll();
    const injectOptions = {
        method: 'GET',
        url: '/api/v1/generate/1/admin',
    }
    await server.inject(injectOptions);
}


