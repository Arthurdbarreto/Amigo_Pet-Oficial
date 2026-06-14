const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Pet', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    especie: { type: DataTypes.STRING, allowNull: false },
    raca: { type: DataTypes.STRING },
    sexo: { type: DataTypes.ENUM('M','F'), allowNull: false },
    tutorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Tutors', key: 'id' } }
  }, { timestamps: true });
};
