const jwt = require('jsonwebtoken');
const SECRET_KEY = 'super-secret'; // mesma chave usada para gerar o token

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido.' });

    req.user = user; // anexar usuário ao request
    next();
  });
}

module.exports = autenticarToken;
