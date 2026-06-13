const express = require('express');
const { Appointment, Tutor, Pet, Service } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Listar todos os agendamentos
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Lista de agendamentos }
 *   post:
 *     summary: Criar novo agendamento
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 
*         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutorId: { type: integer }
 *               petId: { type: integer }
 *               serviceId: { type: integer }
 *               datetime: { type: string, format: date-time }
 *               status: { type: string, enum: ['Agendado', 'Confirmado', 'Concluído', 'Cancelado'] }
 *     responses:
 *       201: { description: Agendamento criado }
 */
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Tutor, attributes: ['id', 'nome'] },
        { model: Pet, attributes: ['id', 'nome'] },
        { model: Service, attributes: ['id', 'nome'] }
      ]
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos', error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar agendamento', error: err.message });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Obter agendamento por ID
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Agendamento encontrado }
 *   put:
 *     summary: Atualizar agendamento
 *     tags: [Agendamentos]
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
 *               tutorId: { type: integer }
 *               petId: { type: integer }
 *               serviceId: { type: integer }
 *               datetime: { type: string, format: date-time }
 *               status: { type: string, enum: ['Agendado', 'Confirmado', 'Concluído', 'Cancelado'] }
 *     responses:
 *       200: { description: Agendamento atualizado }
 *   delete:
 *     summary: Deletar agendamento
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Agendamento deletado }
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Tutor, attributes: ['id', 'nome'] },
        { model: Pet, attributes: ['id', 'nome'] },
        { model: Service, attributes: ['id', 'nome'] }
      ]
    });
    if (!appointment) return res.status(404).json({ message: 'Agendamento não encontrado' });
    res.json(appointment);
  } catch
 (err) {
    res.status(500).json({ message: 'Erro ao buscar agendamento', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Agendamento não encontrado' });
    await appointment.update(req.body);
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar agendamento', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Agendamento não encontrado' });
    await appointment.destroy();
    res.json({ message: 'Agendamento deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar agendamento', error: err.message });
  }
});

module.exports = router;
