const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tutorId: { type: DataTypes.INTEGER, allowNull: false },
    petId: { type: DataTypes.INTEGER, allowNull: false },
    serviceId: { type: DataTypes.INTEGER, allowNull: false },
    datetime: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM('Agendado','Confirmado','Concluído','Cancelado'),
      allowNull: false,
      defaultValue: 'Agendado'
    }
  }, { timestamps: true });
};

