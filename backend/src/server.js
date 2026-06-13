const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database sincronizado!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Erro ao sincronizar banco:', err);
  }
})();
