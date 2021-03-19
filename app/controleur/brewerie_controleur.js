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
                    async row =>
                        await Brewery.create({
                            id: row.id,
                            nameBreweries: row.breweries,
                            city: row.city

                        }).catch(e => {console.log('unable to insert : '+e)}))
                .on('end', rowCount => resolve({message : 'parsed done'}));
        });
        return h.response(await promise).code(200);
    },
    getAll: async (request,h) => {
        const result = await Models.Brewery.findAll();
        return h.response(result).code(200);
    },
    add: async (request,h) => {
        let body = request.payload;
        /*let exist = Models.Brewery.findAll({
            where: {
                id: body.id
            }
        });
        console.log(exist);*/
        //if (exist === {}) {
        const result = await Models.Brewery.create({ id: body.id, nameBreweries: body.nameBreweries, city: body.city });
        return h.response(result).code(200);
        //} else {
            //return h.response({error: "Brewery id already exist : ", exist}).code(203);
        //}

    }
}
