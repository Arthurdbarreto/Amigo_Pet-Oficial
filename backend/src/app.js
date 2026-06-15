const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const tutorRoutes = require('./routes/tutors');
const petRoutes = require('./routes/pets');
const serviceRoutes = require('./routes/services');
const productRoutes = require('./routes/products');
const appointmentRoutes = require('./routes/appointments');

const { sequelize } = require('./models');
const passport = require('./config/passport');

const app = express();

const SECRET = process.env.JWT_SECRET || 'supersecret_amigopet_2024';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8000';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Rotas de API
app.use('/auth', authRoutes);
app.use('/tutors', tutorRoutes);
app.use('/pets', petRoutes);
app.use('/services', serviceRoutes);
app.use('/products', productRoutes);
app.use('/appointments', appointmentRoutes);

// Rotas Google OAuth
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '8h' });
    const redirectUrl = `${FRONTEND_URL}/login.html?googleToken=${token}`;
    res.redirect(redirectUrl);
  }
);

app.get('/auth/google/failure', (req, res) => {
  res.status(401).json({ message: 'Falha na autenticação com Google' });
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

module.exports = app;
