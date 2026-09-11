const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  items: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  totalQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, { 
  timestamps: true,
  indexes: []
});

module.exports = Cart;
