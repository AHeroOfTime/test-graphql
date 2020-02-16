const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  enum Status {
    PLAYED
    INTERESTED
    UNINTERESTED
    UNKNOWN
  }

  type Dev {
    id: ID!
    name: String!
  }

  type Game {
    id: ID!
    title: String!
    releaseDate: String
    genre: String
    status: Status
    dev: [Dev] # Valid null, [], [...some data], X not valid [...some data w/o name or id]
    # dev: [Dev]! Valid [], [...some data]
    # dev: [Dev!]! Valid [...some data]
    # fake: Float
    # fake2: Boolean
  }

  type Query {
    games: [Game]
    game(id: ID): Game
  }
`;

const games = [
  {
    id: 'assdqwdas',
    title: 'Super Mario World',
    releaseDate: '11-21-1990',
  },
  {
    id: 'assdqwdfw',
    title: 'Super Metroid',
    releaseDate: '03-19-1994',
    genre: 'Action / Side Scrolling',
    dev: [
      {
        id: 'asdawdawd',
        name: 'Shigeru Miyamoto',
      },
    ],
  },
];

const resolvers = {
  Query: {
    games: () => {
      return games;
    },
    game: (obj, { id }, context, info) => {
      const foundGame = games.find(game => {
        return game.id === id;
      });
      return foundGame;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen({
    port: process.env.PORT || 4000,
  })
  .then(({ url }) => {
    console.log(`Server started at ${url}`);
  });
