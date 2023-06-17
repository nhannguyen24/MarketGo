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
      Order.belongsTo(models.City, {
        foreignKey: "city_id",
        targetKey: 'city_id',
        as: "order_city",
      });
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
    city_id: {
      type: DataTypes.UUID
    },
    total_price: DataTypes.DOUBLE,
    order_date: DataTypes.DATE,
    address: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      validate: {
        isIn: {
          args: [['Active', 'Deactive']],
          msg: 'Invalid value for order.status (Active, Deactive)'
        }
      }
    },
    delivery_status: {
      type: DataTypes.ENUM,
      values: ['On-Going', 'Cancel', 'Delivered'],
      validate: {
        isIn: {
          args: [['On-Going', 'Cancel', 'Delivered']],
          msg: 'Invalid value for order.status (On-Going, Cancel, Delivered)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
  });

  Order.beforeCreate((order, options) => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);
    order.createdAt = currentDate;
    order.updatedAt = currentDate;
  });
  return Order;
};