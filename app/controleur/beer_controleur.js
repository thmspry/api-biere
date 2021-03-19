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
    getAll: async (request,h) => {
        const result = await Models.Beer.findAll();
        return h.response(result).code(200);
    },
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
        return h.response(result).code(200)
    },
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
    deleteById: async (request,h) => {
        const id = request.params.id;
        Models.Beer.findAll({
            where:{
                id:id
            }
        }).then((result) => {
            return Models.Beer.destroy({
                where:{
                    id:id
                }
            })
        }).then(result => {return h.response(result).code(200)})
        .catch(error => {
            return h.response({error:"destroy failed"}).code(404)
        })
    }
}
