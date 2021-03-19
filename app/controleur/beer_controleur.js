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
                            id: row.id,
                            name: row.name,
                            state: row.Country,
                            breweryId: row.brewery_id,

                        }).catch(e => {console.log('unable to insert : '+e)}))
                .on('end', rowCount => resolve({message : 'parsed done'}));
        });
        return h.response(await promise).code(200);
    },
    getAll: async (request,h) => {
        const result = await Models.Beer.findAll();
        return h.response(result).code(200);
    }
}
