"use strict";
const fs = require('fs');
const csv = require('fast-csv');

const Models = require("../model/");
const beerFileName = require('../config/config').beerFileName;
const Beer = require('../model').Beer;

module.exports = {
    populateBeers:  async (request,h) => {
        const promise = new Promise((resolve,reject) => {
            const stream =    fs.createReadStream(beerFileName, {encoding: 'utf8'})
                .pipe(csv.parse({ headers: true, delimiter : ';' }))
                .on('error', error => console.error(error))
                .on('data',
                    async row =>
                        await Beer.create({
                            id: parseInt(row.id),
                            name: String(row.name),
                            state: String(row.Country),
                            breweryId: parseInt(row.brewery_id),

                        }).catch(e => {/*console.log('unable to insert : '+e)*/}))
                .on('end', rowCount => resolve({message : 'parsed done'}));
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
        const result = await Models.Beer.findAll({
            where : {
                id: id
            }
        })
        if (result.length === 0) {
            return h.response({error : "not found"}).code(404);
        }
      return h.response(result).code(200);
    },
    //testé
    findByState: async (request,h) => {
        const state = request.params.state;
        /*Models.Beer.findAll({
            where:{
                state:state
            }
        }).then(result => {
            return h.response(result).code(200)
        }).catch(error => {
            return h.response({error:"not found"}).code(404)
        })*/
        const result = await Models.Beer.findAll({
            where : {
                state: state
            }
        })
        if (result.length === 0) {
            return h.response({error:"not found"}).code(404)
        }
        console.log(result)
        return h.response(result).code(200)
    },
    //testé
    findByBrewId: async (request,h) => {
        const breweryId = request.params.breweryId;
        const result = await Models.Beer.findAll({
            where : {
                breweryId: breweryId
            }
        })
        if (result.length === 0) {
            return h.response({error:"not found"}).code(404)
        }
        return h.response(result).code(200)
    },
    //testé
    deleteById: async (request,h) => {
        const id = request.params.id;
        const result = await Models.Beer.findAll({
            where:{
                id:id
            }
        }).then((result) => {
            return Models.Beer.destroy({
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
    //testé
    add: async (request,h) => {
        try {
            const payload = {
                id: parseInt (request.payload.id),
                name:request.payload.name,
                state:request.payload.state,
                breweryId:parseInt(request.payload.breweryId)
            };
            console.log(payload)

            if (Object.values(payload).includes(undefined) || isNaN(payload.id) || isNaN(payload.breweryId)) {
                return h.response({error:"request error"}).code(404)
            }
            const brewery = await Models.Brewery.findAll({
                where: {
                    id : payload.breweryId
                }
            }).then(result => {return result})

            if (brewery.length === 0) {
                return h.response({error:"brewery id ne correspond a aucun brewery"}).code(203)
            }
            console.log("apres 124")
            const beerExist = await Beer.findAll({
                where: {
                    id : payload.id
                }
            }).then(result => {return result})

            if (beerExist.length === 0) {
                await Beer.create(payload);
                return h.response(payload).code(201)
            } else {
                return h.response({error:"Il existe déjà une biere avec cet ID"}).code(404)
            }

        } catch (e) {
            console.log("catch")
            return h.response({error:"request error","":e}).code(203)
        }
    }
}
