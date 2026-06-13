const express = require('express');
const { Service } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

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

