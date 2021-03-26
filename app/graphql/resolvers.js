const {ApolloServer, gql} = require('apollo-server')
const Models = require("../model/");
const brewerieControleur = require("../controleur/brewerie_controleur");
const beerControleur = require("../controleur/beer_controleur");
const authControleur = require("../controleur/authentification_controleur");


const resolvers = {
    Query:{
        Beer(parent, args) {
            return Models.Beer.findOne({where:{id:args.id}})
        },
        Beers() {
            return Models.Beer.findAll()
        },
        BeersbyBrewery(parent, args){
          return Models.Beer.findAll({where:{breweryId:args.brasserie}})
        },
        Brasserie(parent, args){
            return Models.Brewery.findOne({where:{id:args.id}})
        }
    }
}

module.exports = resolvers;