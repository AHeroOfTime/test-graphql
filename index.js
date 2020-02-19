const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

// gql`` parses you string into an AST
const typeDefs = gql`
  scalar Date

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
    releaseDate: Date
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

  input DevInput {
    id: ID
    name: String
  }

  input GameInput {
    id: ID
    title: String
    releaseDate: Date
    genre: String
    status: Status
    dev: [DevInput]
  }

  type Mutation {
    addGame(game: GameInput): [Game]
  }
`;

const devs = [
  {
    id: 'shigeru',
    name: 'Shigeru Miyamoto',
  },
  {
    id: 'makoto',
    name: 'Makoto Kanoh',
  },
];

const games = [
  {
    id: 'assdqwdas',
    title: 'Super Mario World',
    releaseDate: new Date('11-21-1990'),
    dev: [
      {
        id: 'shigeru',
      },
    ],
  },
  {
    id: 'assdqwdfw',
    title: 'Super Metroid',
    releaseDate: new Date('03-19-1994'),
    genre: 'Action / Side Scrolling',
    dev: [
      {
        id: 'makoto',
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
  Game: {
    dev: (obj, arg, context) => {
      // db call
      const devIds = obj.dev.map(dev => dev.id);
      const filteredDevs = devs.filter(dev => {
        return devIds.includes(dev.id);
      });
      return filteredDevs;
    },
  },
  Mutation: {
    addGame: (obj, { game }, { userId }) => {
      if (userId) {
        // mutation / db stuff
        const newGamesList = [
          ...games,
          // new game data
          game,
        ];
        // return data as expected in schema
        return newGamesList;
      }
      return games;
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: "It's a date",
    parseValue(value) {
      // value from the client
      return new Date(value);
    },
    serialize(value) {
      //  the value sent to the client
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    const fakeUser = {
      userId: 'helloImAUser',
    };
    return {
      ...fakeUser,
    };
  },
});

server
  .listen({
    port: process.env.PORT || 4000,
  })
  .then(({ url }) => {
    console.log(`Server started at ${url}`);
  });
