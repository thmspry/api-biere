const {ApolloServer, gql} = require('apollo-server')

/**
 * Ici on définit les types utilisés par GraphiQl dans son interface
 * @type {DocumentNode}
 */
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
    
    # Query : liste des queries qui permettront à l'utilisateur d'obtenir des données
    # 
    type Query {
        Beer(id:Int): Biere! #renvoie une bière ayant l'id donné
        Beers(limit:Int, random:Boolean): [Biere!]! #liste des bières avec limite de taille (pas obligatoire) et la liste retourné peut être alétoire ou non
        BeersbyBrewery(brasserie:Int!): [Biere!]! #renvoie toutes les bières appartenant à la brasserie donné
        Brasserie(id:Int!): Brasserie! #renvoie la brasserie ayant l'id donnée
        Brewerys(limit:Int, random:Boolean): [Brasserie!]! #liste des bières avec limite de taille et aléatoire ou non
    }
    
`;

module.exports = typeDefs;