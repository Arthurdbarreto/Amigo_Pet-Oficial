const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Tutor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    contato: { type: DataTypes.STRING, allowNull: false },
    endereco: { type: DataTypes.STRING, allowNull: false },
    telefone: { type: DataTypes.STRING, allowNull: false }
  }, { timestamps: true });
};
