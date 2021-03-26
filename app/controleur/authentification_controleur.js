"use strict";
const fs = require('fs');
const {myKey} = require("../config/config");
const AuthJwt = require('hapi-auth-jwt2');
const jwt = require('jsonwebtoken');


module.exports = {
    register:  async (request,h) => {
        const id = request.params.id;
        const name = request.params.name;
        const payload = {
            id: id,
            name: name
        }
        const options = {
            algorithm: 'HS256',
            expiresIn: '1h'
        }

        let key = jwt.sign(payload, myKey, options)
        console.log("Création clé d'authentification pour l'utilisateur : " + id + " " + name + " = " + key)
        return h.response(key).code(200);
    }
}