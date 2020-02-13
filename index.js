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
  }
`;

const games = [
  {
    title: 'Super Mario World',
    releaseDate: '11-21-1990',
  },
  {
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
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});
