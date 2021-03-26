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
            const stream =    fs.createReadStream(beerFileName, {encoding: 'utf8'})
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
    //testé
    getAll: async (request,h) => {
        const result = await Models.Beer.findAll();
        return h.response(result).code(200);
    },
    //testé
    findById: async (request,h) => {
        const id = request.params.id
        return await Models.Beer.findOne({
            where : {
                id: id
            }
        }).then((result) => {
            if (result === null) {
                return h.response({error : "not found"}).code(404);
            }
            return h.response(result).code(200);
        })
        /*if (result.length === 0) {
            return h.response({error : "not found"}).code(404);
        }
      return h.response(result).code(200);
    */},
    //testé
    findByState: async (request,h) => {
        const state = request.params.state;
        return await Models.Beer.findAll({
            where : {
                state: state
            }
        }).then((result) => {
            if (result.length === 0) {
                return h.response({error:"not found"}).code(404)
            } else {
                return h.response(result).code(200)
            }
        })
    },
    //testé
    findByBrewId: async (request,h) => {
        const breweryId = request.params.breweryId;
        return await Models.Beer.findAll({
            where : {breweryId: breweryId}})
            .then((result) => {
                if (result.length === 0) {
                    return h.response({error:"not found"}).code(404)
                }
                return h.response(result).code(200)
            })
    },
    //testé
    deleteById: async (request,h) => {
        const id = request.params.id;
        return await Beer.destroy({where :{id:id}})
            .then((result) => {
                if (result === null) {
                    return h.response({error:"pas de biere trouvé avec cet id"}).code(404)
                } else {
                    return h.response(result).code(202)
                }
        })
    },
    //testé
    add: async (request,h) => {
        try {
            const payload = {
                id: parseInt (request.payload.id),
                name:request.payload.name,
                state:request.payload.state,
                breweryId:parseInt(request.payload.breweryId)
            }
            console.log(payload)

            if (Object.values(payload).includes(undefined) || isNaN(payload.id) || isNaN(payload.breweryId)) {
                return h.response({error:"request error"}).code(404)
            }
            const brewery = await Models.Brewery.findOne({
                where: {id : payload.breweryId}
            }).then(result => {return result})

            if (brewery === null) {
                return h.response({error:"brewery id ne correspond a aucun brewery"}).code(203)
            }

            return await Beer.findOne({where:{id:payload.id}})
                .then((result) => {
                    if (result !== null) {
                        return h.response({error:"Il existe déjà une biere avec cet ID"}).code(404)
                    } else {
                        Beer.create(payload)
                        return h.response(payload).code(201)
                    }
            })
        } catch (e) {
            console.log("catch")
            return h.response({error:"request error"}).code(203)
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
                if (brewery === null){return h.response({error:"brewery n'existe pas"}).code(404)}
            }

            return await Beer.findOne({
                where:{id:payload.id}})
                .then((result) => {
                    if(result !== null){
                        result.set(payload);
                        result.save();
                        return h.response(result).code(202)
                    }
                    return h.response({error:"save didn't work"}).code(404)
                })
        } catch (e) {
            console.log("catch")
            return h.response({error:"request error : "+e}).code(203)
        }
    }
}
