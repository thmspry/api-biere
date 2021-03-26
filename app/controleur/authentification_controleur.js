"use strict";
const fs = require('fs');
const {myKey} = require("../config/config");
const AuthJwt = require('hapi-auth-jwt2');
const jwt = require('jsonwebtoken');
const User = require('../model').User;


module.exports = {
    register:  async (request,h) => {
        const promise = new Promise((resolve,reject) => {
            const id = request.params.id;
            const name = request.params.name;
            User.findAll({
                    where : {
                        id : id,
                    }
                }).then((result) => {
                    if(result.length === 0) {
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
                        User.create({
                            id: id,
                            name: name
                        })
                        resolve({key : key});
                    } else {
                        resolve({error : 'user ID already exists'})
                    }
                })
        })
        return h.response(await promise).code(200);
    },
    validAuth: async function (id) {
        await User.findAll({
            where : {
                id: id
            }
        }).then((result) => {
            return result.length === 0;
        })
    }
}