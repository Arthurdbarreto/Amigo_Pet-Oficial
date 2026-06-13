const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth');
const tutorRoutes = require('./routes/tutors');
const petRoutes = require('./routes/pets');
const serviceRoutes = require('./routes/services');
const productRoutes = require('./routes/products');
const appointmentRoutes = require('./routes/appointments');

const { sequelize } = require('./models');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// (opcional) servir frontend se quiser, mas para Render+Netlify não é obrigatório
// app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/tutors', tutorRoutes);
app.use('/pets', petRoutes);
app.use('/services', serviceRoutes);
app.use('/products', productRoutes);
app.use('/appointments', appointmentRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

module.exports = app;
