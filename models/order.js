'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: 'user_id',
        as: "order_user",
      });
      Order.belongsToMany(models.Ingredient, {
        through: 'Order_detail',
        foreignKey: 'order_id',
        otherKey: 'ingredient_id',
        as: "order_detail",
      });
      Order.hasMany(models.Transaction, { as: 'order_transaction', foreignKey: 'order_id'});
    }
  }
  Order.init({
    order_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID
    },
    total_price: DataTypes.DOUBLE,
    order_date: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      validate: {
        isIn: {
          args: [['Active', 'Deactive']],
          msg: 'Invalid value for order.status (Active, Deactive)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};