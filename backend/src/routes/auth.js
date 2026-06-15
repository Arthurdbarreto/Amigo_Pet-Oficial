const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'supersecret_amigopet_2024';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar', error: err.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer login', error: err.message });
  }
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     tags: [Auth]
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'E-mail é obrigatório' });

    const user = await User.findOne({ where: { email } });

    // Não revela se o e-mail existe ou não, por segurança
    if (!user) {
      return res.json({ message: 'Se o e-mail existir, você receberá instruções em instantes.' });
    }

    // Aqui seria gerado um token e enviado um e-mail. Por enquanto, apenas simula.
    return res.json({ message: 'Se o e-mail existir, você receberá instruções em instantes.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao processar recuperação de senha', error: err.message });
  }
});

module.exports = router;
