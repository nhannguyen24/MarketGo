'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Order, {
        foreignKey: "order_id",
        targetKey: 'order_id',
        as: "transaction_order",
      });
    }
  }
  Transaction.init({
    transaction_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    price: DataTypes.DOUBLE,
    order_id: {
      type: DataTypes.UUID
    },
    status: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  Transaction.beforeCreate((transaction, options) => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);
    transaction.createdAt = currentDate;
    transaction.updatedAt = currentDate;
  });
  return Transaction;
};