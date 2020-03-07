// Importar o módulo GraphQLServer para estabelecer um servidor
const { GraphQLServer } = require('graphql-yoga');
// Importando o prisma client para fazer a conexão ao context
const { prisma } = require('../prisma/..src/generated/prisma-client');

const Subscription = require('./resolvers/Subscription')
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Vote = require('./resolvers/Vote');
/* 
  o objeto resolvers é a implementação do schema
  sua estrutura deve ser idêntica a estrutura da definição
  do tipo
*/
const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
}

/* 
  As definições devem ser passadas pra o servidor
  Isso informa ao servidor quais operações são aceitas e como
  elas devem ser resolvidas
  O objeto context agora está conectado a instância do prisma client
  na inicialização do servidor GraphQL
*/
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
});

server.start(() => console.log('Server running on port 4000'));
