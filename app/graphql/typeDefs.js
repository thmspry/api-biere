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
    
    type Query {
        Beer(id:Int!): Biere
        Beers: [Biere]
        BeersbyBrewery(brasserie:Int!): [Biere]
        Brasserie(id:Int!): Brasserie
    }
`;

module.exports = typeDefs;