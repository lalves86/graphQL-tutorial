const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { APP_SECRET, getUserId } = require('../utils');

async function signup(parent, args, context, info) {
  /* Usando bcrypt para gerar o hash da senha */
  const password = await bcrypt.hash(args.password, 10);
  /* Usa o prisma client para armazenar o novo usuário no banco de dados */
  const user = await context.prisma.createUser({ ...args, password });
  /* Geração do token jwt através do pacote jsonwebtoken */
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  /* Usando o prisma client para para recuperar um usuário da base de dados
     através do email
  */
  const user = await context.prisma.user({ email: args.email })

  if (!user) {
    throw new Error('No such user found')
  }
  /* Compara a senha passada no login com o hash armazenado no banco de dados */
  const valid = await bcrypt.compare(args.password, user.password)

  if (!valid) {
    throw new Error('Invalid password')
  }
  /* Se o login estiver correto, retorna o token do usuário */
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token, 
    user,
  }
}

/* Rota para que usuários autenticados possam publicar postagens */
/* 
  o post resolver chama uma função no prisma client anexada ao context
  o método createLink passando como argumentos os dados que os resolvers
  recebem através do parâmetro args
*/
function post(parent, args, context, info) {
  const userId = getUserId(context);

  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  });
}

async function vote(parent, args, context, info) {
  const userId = getUserId(context)

  const voteExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId},
  });

  if (voteExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  })
}

module.exports = {
  signup,
  login,
  post,
  vote,
}