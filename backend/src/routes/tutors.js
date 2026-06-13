const express = require('express');
const { Tutor } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /tutors:
 *   get:
 *     summary: Listar todos os tutores
 *     tags: [Tutores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Lista de tutores }
 *   post:
 *     summary: Criar novo tutor
 *     tags: [Tutores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               contato: { type: string }
 *               endereco: { type: string }
 *               telefone: { type: string }
 *     responses:
 *       201: { description: Tutor criado }
 */
router.get('/', auth, async (req, res) => {
  try {
    const tutors = await Tutor.findAll();
    res.json(tutors);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar tutores', error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const tutor = await Tutor.create(req.body);
    res.status(201
).json(tutor);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar tutor', error: err.message });
  }
});

/**
 * @swagger
 * /tutors/{id}:
 *   get:
 *     summary: Obter tutor por ID
 *     tags: [Tutores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tutor encontrado }
 *   put:
 *     summary: Atualizar tutor
 *     tags: [Tutores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               contato: { type: string }
 *               endereco: { type: string }
 *               telefone: { type: string }
 *     responses:
 *       200: { description: Tutor atualizado }
 *   delete:
 *     summary: Deletar tutor
 *     tags: [Tutores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tutor deletado }
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const tutor = await Tutor.findByPk(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor não encontrado' });
    res.json(tutor);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar tutor', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const tutor = await Tutor.findByPk(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor não encontrado' });
    await tutor.update(req.body);
    res.json(tutor);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar tutor', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const tutor = await Tutor.findByPk(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor não encontrado' });
    await tutor.destroy();
    res.json({ message: 'Tutor deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar tutor', error: err.message });
  }
});

module.exports = router;
