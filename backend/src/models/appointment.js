const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Tutors', key: 'id' }
    },
    petId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Pets', key: 'id' }
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Services', key: 'id' }
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Agendado', 'Confirmado', 'Concluído', 'Cancelado'),
      defaultValue: 'Agendado'
    }
  }, { timestamps: true });
};
