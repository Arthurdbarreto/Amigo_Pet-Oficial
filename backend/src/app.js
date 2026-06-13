const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const cors = require('cors');
app.use(cors());


const User = require('./user')(sequelize);
const Tutor = require('./tutor')(sequelize);
const Pet = require('./pet')(sequelize);
const Service = require('./service')(sequelize);
const Product = require('./product')(sequelize);
const Appointment = require('./appointment')(sequ
});

module.exports = app;
