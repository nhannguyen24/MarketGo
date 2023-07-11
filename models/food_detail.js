'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Food_detail.belongsTo(models.Foods, {
        foreignKey: 'food_id',
        as: 'detail_food'
      });
      
      Food_detail.belongsTo(models.Ingredient, {
        foreignKey: 'ingredient_id',
        as: 'detail_ingredient'
      });
    }
  }
  Food_detail.init({
    food_detail_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    food_id: {
      type: DataTypes.UUID
    },
    ingredient_id: {
      type: DataTypes.UUID
    },
    price: DataTypes.DOUBLE,
    quantity: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      validate: {
        isIn: {
          args: [['Active', 'Deactive']],
          msg: 'Invalid value for food_detail.status (Active, Deactive)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Food_detail',
  });
  return Food_detail;
};