const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user')(sequelize);
const Tutor = require('./tutor')(sequelize);
const Pet = require('./pet')(sequelize);
const Service = require('./service')(sequelize);
const Product = require('./product')(sequelize);
const Appointment = require('./appointment')(sequ
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, { timestamps: true });
};
