/* 
  No resolver postedBy, primeiro se recupera Link usando o prisma client
  e então chama postedBy nele.
*/

function postedBy(parent, args, context) {
  return context.prisma.link({ id: parent.id }).postedBy()
}

function votes(parent, args, context) {
  return context.prisma.link({ id: parent.id }).votes()
}

module.exports = {
  postedBy,
  votes,
}