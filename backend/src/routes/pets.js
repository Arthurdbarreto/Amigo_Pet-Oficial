const express = require('express');
const { Pet } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Listar todos os pets
 *     tags: [Pets]
 
*     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Lista de pets }
 *   post:
 *     summary: Criar novo pet
 *     tags: [Pets]
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
 *               especie: { type: string }
 *               raca: { type: string }
 *               sexo: { type: string, enum: ['M', 'F'] }
 *               tutorId: { type: integer }
 *     responses:
 *       201: { description: Pet criado }
 */
router.get('/', auth, async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar pets', error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar pet', error: err.message });
  }
});

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Obter pet por ID
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Pet encontrado }
 *   put:
 *     summary: Atualizar pet
 *     tags: [Pets]
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
 *               especie: { type: string }
 *               raca: { type: string }
 *               sexo: { type: string, enum: ['M', 'F'] }
 *               tutorId: { type: integer }
 *     responses:
 *       200: { description: Pet atualizado }
 *   delete:
 *     summary: Deletar pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Pet deletado }
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet não encontrado' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar pet', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet não encontrado' });
    await pet.update(req.body
);
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar pet', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet não encontrado' });
    await pet.destroy();
    res.json({ message: 'Pet deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar pet', error: err.message });
  }
});

module.exports = router;
