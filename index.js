const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  enum Status {
    PLAYED
    INTERESTED
    UNINTERESTED
    UNKNOWN
  }

  type Dev {
    id: ID
    name: String
  }

  type Game {
    id: ID
    title: String
    releaseDate: String
    genre: String
    status: Status
    dev: [Dev]
    # fake: Float
    # fake2: Boolean
  }

  type Query {
    games: [Game]
  }
`;

const games = [
  {
    title: 'Super Mario World',
    releaseDate: '11-21-1990',
    genre: 'Action / Platformer',
  },
  {
    title: 'Super Metroid',
    releaseDate: '03-19-1994',
    genre: 'Action / Side Scrolling',
  },
];

const resolvers = {
  Query: {
    games: () => {
      return games;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});
