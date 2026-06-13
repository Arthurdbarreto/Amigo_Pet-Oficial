const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AmigoPet API',
      version: '1.0.0',
      description: 'API para gerenciamento de petshop'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    './src/routes/auth.js',
    './src/routes/tutors.js',
    './src/routes/pets.js',
    './src/routes/services.js',
    './src/routes/products.js',
    './src/routes/appointments.js'
  ]
};

module.exports = swaggerJsdoc(options);
