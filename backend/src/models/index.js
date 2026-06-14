const sequelize = require('../config/db');

const User = require('./user')(sequelize);
const Tutor = require('./tutor')(sequelize);
const Pet = require('./pet')(sequelize);
const Service = require('./service')(sequelize);
const Product = require('./product')(sequelize);
const Appointment = require('./appointment')(sequelize);

// Associations
Tutor.hasMany(Pet, { foreignKey: 'tutorId', onDelete: 'CASCADE' });
Pet.belongsTo(Tutor, { foreignKey: 'tutorId' });

Tutor.hasMany(Appointment, { foreignKey: 'tutorId', onDelete: 'CASCADE' });
Pet.hasMany(Appointment, { foreignKey: 'petId', onDelete: 'CASCADE' });
Service.hasMany(Appointment, { foreignKey: 'serviceId', onDelete: 'CASCADE' });

Appointment.belongsTo(Tutor, { foreignKey: 'tutorId' });
Appointment.belongsTo(Pet, { foreignKey: 'petId' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = {
  sequelize,
  User,
  Tutor,
  Pet,
  Service,
  Product,
  Appointment
};
