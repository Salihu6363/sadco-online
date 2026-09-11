const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'piece'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { 
  timestamps: true,
  indexes: []
});

module.exports = Product;
