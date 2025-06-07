const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Client = require('../models/Client');

const ACCESS_SECRET = 'super-secret';
const REFRESH_SECRET = 'super-refresh';


let refreshTokens = [];

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
      const client = await Client.findOne({ where: { email } });

      if (!client || !(await bcrypt.compare(password, client.password))) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      // tokens
      const payload = { id: client.id, email: client.email };
      const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '45m' });
      const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

      refreshTokens.push(refreshToken);

      const decodedAccess = jwt.decode(accessToken);
      const decodedRefresh = jwt.decode(refreshToken);

      return res.json({
        accessToken,
        refreshToken,
        accessTokenInfo: {
          issuedAt: decodedAccess.iat,
          expiresAt: new Date(decodedRefresh.exp * 1000).toISOString()
        },
        refreshTokenInfo: {
          issuedAt: decodedRefresh.iat,
          expiresAt: new Date(decodedRefresh.exp * 1000).toISOString()
        }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro interno no servidor.', details: error.message });
    }
  },

  refreshToken: (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: 'Refresh token ausente.' });

    if (!refreshTokens.includes(token)) {
      return res.status(403).json({ error: 'Refresh token inválido ou expirado.' });
    }

    jwt.verify(token, REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Token inválido.' });

      const newAccessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: '45m' });
      res.json({ accessToken: newAccessToken });
    });
  },
  register: async (req, res) => {
    const { name, email, password, phone, address, document } = req.body;

    try {
      const existing = await Client.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'Email já está em uso.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newClient = await Client.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        document,
        status: true,
      });

      const payload = { id: newClient.id, email: newClient.email };
      const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '45m' });
      const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

      refreshTokens.push(refreshToken);


      const decodedAccess = jwt.decode(accessToken);
      const decodedRefresh = jwt.decode(refreshToken);

      return res.status(201).json({
        accessToken,
        refreshToken,
        clientId: newClient.id,
        accessTokenInfo: {
          issuedAt: new Date(decodedAccess.iat * 1000).toISOString(),
          expiresAt: new Date(decodedAccess.iat * 1000).toISOString(),
        },
        refreshTokenInfo: {
          issuedAt: decodedRefresh.iat,
          expiresAt: decodedRefresh.exp,
        }
      });


    } catch (error) {
      console.error('Erro ao registrar:', error);
      return res.status(500).json({ error: 'Erro ao registrar.', details: error.message });
    }
  },
  logout: (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.status(200).json({ message: 'Logout realizado com sucesso.' });
  }
};

module.exports = authController;
