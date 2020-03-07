/* 
  O feed resolver acessa um objeto do prisma contido no argumento
  context, este prisma object é um prisma client importado da biblioteca
  prisma-client.
  A instância de Prisma client permite acessar a database através
  da API do prisma
*/

async function feed(parent, args, context, info) {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {}

  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy,
  });

  const count = await context.prisma.linksConnection({
    where,
  }).aggregate().count()

  return {
    links,
    count,
  };
};

module.exports = {
  feed,
}