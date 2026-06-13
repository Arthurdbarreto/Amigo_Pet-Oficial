const express = require('express');
const { Service } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Listar todos os serviços
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Lista de serviços }
 *   post:
 *     summary: Criar novo serviço
 *     tags: [Serviços]
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
 *               descricao: { type: string }
 *               preco: { type: number }
 *     responses:
 *       201: { description: Serviço criado }
 */
router.get('/', auth, async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar serviços', error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar serviço', error: err.message });
  }
});

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Obter serviço por ID
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Serviço encontrado }
 *   put:
 *     summary: Atualizar serviço
 *     tags: [Serviços]
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
 *               descricao: { type: string }
 *               preco: { type: number }
 *     responses:
 *       200: { description: Serviço atualizado }
 *   delete:
 *     summary: Deletar servi
ço
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Serviço deletado }
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Serviço não encontrado' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar serviço', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Serviço não encontrado' });
    await service.update(req.body);
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar serviço', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Serviço não encontrado' });
    await service.destroy();
    res.json({ message: 'Serviço deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar serviço', error: err.message });
  }
});

module.exports = router;
