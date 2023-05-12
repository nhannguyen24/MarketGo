'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order_detail.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'detail_order'
      });
      
      Order_detail.belongsTo(models.Ingredient, {
        foreignKey: 'ingredient_id',
        as: 'order_detail_ingredient'
      });
      
    }
  }
  Order_detail.init({
    order_detail_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID
    },
    ingredient_id: {
      type: DataTypes.UUID
    },
    price: DataTypes.DOUBLE,
    quantity: DataTypes.INTEGER,
    order_date: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      validate: {
        isIn: {
          args: [['Active', 'Deactive']],
          msg: 'Invalid value for order_detail.status (Active, Deactive)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Order_detail',
  });
  return Order_detail;
};