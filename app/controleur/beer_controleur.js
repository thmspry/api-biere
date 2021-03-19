"use strict";
const fs = require('fs');
const csv = require('fast-csv');

const Models = require("../model/");
const Beer = require('../model').Beer;

module.exports = {
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
    }
}
