'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Store.belongsTo(models.City, {
        foreignKey: "city_id",
        targetKey: 'city_id',
        as: "store_city",
      });
      Store.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: 'user_id',
        as: "store_user",
      });
      Store.hasMany(models.Ingredient, { as: 'store_ingredient', foreignKey: 'store_id'});
    }
  }
  Store.init({
    store_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    store_name: DataTypes.STRING,
    address: DataTypes.STRING,
    city_id: {
      type: DataTypes.UUID
    },
    user_id: {
      type: DataTypes.UUID
    },
    status: {
      type: DataTypes.ENUM,
      values: ["Active", "Deactive"],
      validate: {
        isIn: {
          args: [["Active", "Deactive"]],
          msg: 'Invalid value for store.status (Active, Deactive)'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};