const {ApolloServer, gql} = require('apollo-server')

const typeDefs = gql`
    type Biere {
        id: Int!
        name: String!
        state: String!
        breweryId: Int
    }
    
    type Brasserie {
        id: Int!
        nameBreweries: String!
        city: String!
    }
    
    # Query
    type Query {
        Beer(id:Int, brasserie:Int): Biere!
        Beers(limit:Int, random:Boolean): [Biere!]! #liste des bières avec limite de taille et aléatoire ou non
        BeersbyBrewery(brasserie:Int!): [Biere!]!
        Brasserie(id:Int!): Brasserie!
        Brewerys(limit:Int, random:Boolean): [Brasserie!]! #liste des bières avec limite de taille et aléatoire ou non

    }
`;

module.exports = typeDefs;