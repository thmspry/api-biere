"use strict";
const fs = require('fs');
const csv = require('fast-csv');

const Models = require("../model/");
const { Op } = require("sequelize");
const brewerieFileName = require('../config/config').brewerieFileName;
const Brewery = require('../model').Brewery;

module.exports = {
    populateBreweries:  async (request,h) => {
        const promise = new Promise((resolve,reject) => {
            const stream = fs.createReadStream(brewerieFileName, {encoding: 'utf8'})
                .pipe(csv.parse({ headers: true, delimiter : ';' }))
                .on('error', error => console.error(error))
                .on('data',
                    async row => {
                        const id = parseInt(row.id);
                        const nameBreweries = String(row.breweries);
                        const city = String(row.city);
                        if(!isNaN(id)) {
                            await Brewery.findAll({
                                where: {
                                    id: id
                                }
                            }).then((result) => {
                                if (result.length === 0) {
                                     Brewery.create({
                                        id: id,
                                        nameBreweries: nameBreweries,
                                        city: city
                                    }).catch(e => {
                                         console.log('unable to insert : '+e)
                                     })
                                }
                            })
                        }
                    })
                .on('end', rowCount => resolve({message : 'parsed done : ' + rowCount + ' rows parsed'}));
        });
        return h.response(await promise).code(200);
    },
    getAll: async (request,h) => {
        const result = await Models.Brewery.findAll();
        if (result.length === 0) {
            return h.response(result).code(404);
        } else {
            return h.response(result).code(200);
        }
    },
    add: async (request,h) => {
        try {
            const payload = {
                id: parseInt (request.payload.id),
                nameBreweries:request.payload.nameBreweries,
                city:request.payload.city,
            };

            if (Object.values(payload).includes(undefined)) {
                return h.response({error:"request error : undefinded value"}).code(404)
            }
            if (isNaN(payload.id)) {
                return h.response({error:"request error : id is Not a Number"}).code(404)
            }
            const brasserieExist = await Brewery.findAll({
                where: {
                    id : payload.id
                }
            }).then(result => {return result})

            if (brasserieExist.length === 0) {
                await Brewery.create(payload);
                return h.response(payload).code(201)
            } else {
                return h.response({error:"Il existe déjà une brasserie avec cet ID"}).code(404)
            }

        } catch (e) {
            console.log("catch")
            return h.response({error:"request error","":e}).code(203)
        }
    },

    findById : async (request,h) => { // Testé ✅
        const id = request.params.id
        const result = await Models.Brewery.findAll({
            where : {
                id: id
            }
        })
        if (result.length === 0) {
            return h.response({error : "not found"}).code(404);
        }
        return h.response(result).code(200);
    },

    findByCity : async (request,h) => { // Testé ✅
        const city = request.params.city
        const result = await Models.Brewery.findAll({
            where : {
                city: city
            }
        })
        if (result.length === 0) {
            return h.response({error : "not found"}).code(404);
        }
        return h.response(result).code(200);
    },

    deleteById: async (request,h) => {
        const id = request.params.id;
        const result = await Models.Brewery.findAll({
            where:{
                id:id
            }
        }).then((result) => {
            return Models.Brewery.destroy({
                where:{id:id}
            }).then(() => {
                return result
            })
        })

        if (result.length === 0) {
            return h.response({error:"not found"}).code(404);
        } else {
            return h.response(result).code(200)}
    },


    editById: async (request,h) => {
        try {
            const id = request.params.id;
            const payload = {
                id: parseInt (request.payload.id),
                nameBreweries:request.payload.nameBreweries,
                city:request.payload.city,
            };

            if (Object.values(payload).includes(undefined)) {
                return h.response({error:"request error : undefinded value"}).code(404)
            }
            if (isNaN(payload.id)) {
                return h.response({error:"request error : id is Not a Number"}).code(404)
            }
            const brasserieExist = await Brewery.findAll({
                where: {
                    id : payload.id
                }
            }).then(result => {return result})

            if (brasserieExist.length === 0) {
                await Brewery.update(payload, {
                    where: {
                        id: id
                    }
                });
                return h.response(payload).code(201)
            } else {
                return h.response({error:"Il existe déjà une brasserie avec cet ID"}).code(404)
            }

        } catch (e) {
            console.log("catch")
            return h.response({error:"request error","":e}).code(203)
        }
    },
}
