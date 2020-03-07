const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-awesome';

/* 
  Funcção chamada em rotas que exigem autenticação
  Recupera o Authorization header da requisição,
  que contém o token do argumento context.
  Verifica o token e recupera o id do usuário a partir dele.
*/
function getUserId(context) {
  const Authorization = context.request.get('Authorization')

  if(Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);

    return userId;
  }

  throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  getUserId,
}