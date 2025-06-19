/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Gerenciamento de login e tokens JWT
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica o usuário e retorna tokens JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@exemplo.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Tokens JWT gerados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Gera um novo token de acesso a partir do refresh token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Refresh token válido
 *     responses:
 *       200:
 *         description: Novo token de acesso gerado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Token ausente
 *       403:
 *         description: Token inválido ou expirado
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Invalida o refresh token e realiza logout
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Refresh token a ser invalidado
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/register', authController.register);

module.exports = router;
