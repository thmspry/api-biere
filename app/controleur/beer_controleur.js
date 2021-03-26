"use strict";
const fs = require('fs');
const csv = require('fast-csv');

const Models = require("../model/");
const beerFileName = require('../config/config').beerFileName;
const Beer = require('../model').Beer;
const Brewery = require('../model').Brewery;

module.exports = {
    populateBeers:  async (request,h) => {
        const promise = new Promise((resolve,reject) => {
            const stream = fs.createReadStream(beerFileName, {encoding: 'utf8'})
                .pipe(csv.parse({ headers: true, delimiter : ';' }))
                .on('error', error => console.error(error))
                .on('data',
                    async row => {
                            const id = parseInt(row.id);
                            const name = String(row.name);
                            const country = String(row.Country);
                            const brewery_id = parseInt(row.brewery_id);
                            if(!isNaN(id) && !isNaN(brewery_id)) {
                                await Beer.findAll({
                                    where: {
                                        id: id
                                    }
                                }).then((result) => {
                                    if (result.length === 0) {
                                        Brewery.findAll({
                                            where: {
                                                id : brewery_id
                                            }
                                        }).then((result) => {
                                            if (result.length !== 0) {
                                                Beer.create({
                                                    id: id,
                                                    name: name,
                                                    state: country,
                                                    breweryId: brewery_id,
                                                }).catch(e => {
                                                    console.log('unable to insert : '+e+ ' id = ' + id);
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                .on('end', rowCount => resolve({message : 'parsed done : ' + rowCount + ' rows parsed'}));
        });
        return h.response(await promise).code(200);
    },

    getAll: async (request,h) => { // Récuperer toutes les bieres
        const result = await Models.Beer.findAll();
        if (result.length === 0) { // Si pas de biere
            return h.response(result).code(404);
        } else {
            return h.response(result).code(200);
        }
    },

    findById: async (request,h) => { // Cherche une biere par son id
        const id = request.params.id
        return await Models.Beer.findOne({ // On cherche la biere en question
            where : {
                id: id
            }
        }).then((result) => {
            if (result === null) {
                return h.response({error : "not found"}).code(404);
            }
            return h.response(result).code(200);
        })
    },

    findByState: async (request,h) => { // Cherche une biere par son state
        const state = request.params.state;
        return await Models.Beer.findAll({ // On cherche la biere en question
            where : {
                state: state
            }
        }).then((result) => {
            if (result.length === 0) {
                return h.response({error : "not found"}).code(404)
            } else {
                return h.response(result).code(200)
            }
        })
    },

    findByBrewId: async (request,h) => { // Cherche une biere par l'id d'une brasserie
        const breweryId = request.params.breweryId;
        return await Models.Beer.findAll({ // On cherche les biere correspondante
            where : {breweryId: breweryId}})
            .then((result) => {
                if (result.length === 0) {
                    return h.response({error: 'not found'}).code(404)
                }
                return h.response(result).code(200)
            })
    },

    deleteById: async (request,h) => { //  Supprime la bierre
        const id = request.params.id;
        return await Beer.destroy({where :{id:id}})
            .then((result) => { // On cherche la biere en question
                if (result === 0) {
                    return h.response({error:"pas de biere trouvé avec cet id"}).code(404)
                } else {
                    return h.response({message:"Biere d'id n°"+ id + " supprimée"}).code(200)
                }
        })
    },

    add: async (request,h) => {
        try {
            const payload = {
                id: parseInt (request.payload.id),
                name:request.payload.name,
                state:request.payload.state,
                breweryId:parseInt(request.payload.breweryId)
            }

            // Si une des données envoyée est incorrect au format
            if (Object.values(payload).includes(undefined) || isNaN(payload.id) || isNaN(payload.breweryId)) {
                return h.response({error:"JSON invalide"}).code(400)
            }
            // Verifie si la brasserie existe bien
            const brewery = await Models.Brewery.findOne({
                where: {id : payload.breweryId}
            }).then(result => {return result})

            if (brewery === null) {
                return h.response({error:"brewery id ne correspond a aucun brewery"}).code(400)
            }

            return await Beer.findOne({where:{id:payload.id}}) // Verifie si l'id existe déjà
                .then((result) => {
                    if (result !== null) {
                        return h.response({error:"Il existe déjà une biere avec cet ID"}).code(403)
                    } else {
                        Beer.create(payload)
                        return h.response(payload).code(201)
                    }
            })
        } catch (e) {
            return h.response({e}).code(500)
        }
    },
    update: async (request,h) => {
        try {
            const payload = {
                id: parseInt (request.payload.id),
                name:request.payload.name,
                state:request.payload.state,
                breweryId:parseInt(request.payload.breweryId)
            };
            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined || (isNaN(payload[key] && (key === "breweryId" || key === "id")))){
                    delete payload[key]
                }
            })
            if (payload.breweryId !== undefined) {
                const brewery = await Models.Brewery.findOne({
                    where: {id : payload.breweryId}
                }).then((result) => {return result})
                if (brewery === null){
                    return h.response({error:"brewery id ne correspond a aucun brewery"}).code(400)}
            }

            return await Beer.findOne({
                where:{id:request.params.id}})
                .then((result) => {
                    if(result !== null){
                        result.set(payload);
                        result.save();
                        return h.response(result).code(202)
                    }
                    return h.response({error:"l'id de la biere est introuvable"}).code(404)
                })
        } catch (e) {
            return h.response(e).code(500)
        }
    }
}
