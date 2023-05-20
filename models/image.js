'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Ingredient, {
        foreignKey: "ingredient_id",
        targetKey: 'ingredient_id',
        as: "image_ingredient",
      });
      Image.belongsTo(models.Food, {
        foreignKey: "food_id",
        targetKey: 'food_id',
        as: "image_food",
      });
    }
  }
  Image.init({
    image_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    image: DataTypes.STRING,
    ingredient_id: {
      type: DataTypes.UUID,
    },
    food_id: {
      type: DataTypes.UUID,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      validate: {
        isIn: {
          args: [['Active', 'Deactive']],
          msg: 'Invalid value for image.status (Active, Deactive)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};