const {ApolloServer, gql} = require('apollo-server')
const Models = require("../model/");
const brewerieControleur = require("../controleur/brewerie_controleur");
const beerControleur = require("../controleur/beer_controleur");
const authControleur = require("../controleur/authentification_controleur");
const {Sequelize} = require("sequelize");

/**
 * Queries qui vont récupérer les données dans la base de donnée et qui sont relié au type Query du gql
 * @type {{Query: {Brewerys(*, *): *, Beers(*, *): *, Brasserie(*, *): *, BeersbyBrewery(*, *): *, Beer(*, *): *}}}
 */
const resolvers = {
    Query:{
        Beer(parent, args) {
            return Models.Beer.findOne({where:{id:args.id}})
        },
        Beers(parent, args) {
            let options = {}
            if (args.limit !== undefined){ options.limit = args.limit}
            if (args.random){ options.order = Sequelize.literal('RANDOM()')}
            return Models.Beer.findAll(options)
        },
        BeersbyBrewery(parent, args){
          return Models.Beer.findAll({where:{breweryId:args.brasserie}})
        },
        Brasserie(parent, args){
            return Models.Brewery.findOne({where:{id:args.id}})
        },
        Brewerys(parent, args){
            let options = {}
            if (args.limit !== undefined){ options.limit = args.limit}
            if (args.random){ options.order = Sequelize.literal('RANDOM()')}
            return Models.Brewery.findAll(options)
        }
    }
}

module.exports = resolvers;