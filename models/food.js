'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Food.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: 'user_id',
        as: "food_user",
      });
      Food.belongsTo(models.Category_detail, {
        foreignKey: "cate_detail_id",
        targetKey: 'cate_detail_id',
        as: "food_cate_detail",
      });
      Food.hasMany(models.Feedback, { as: 'food_feedback', foreignKey: 'food_id'});
      Food.hasMany(models.Image, { as: 'food_image', foreignKey: 'food_id'});
    }
  }
  Food.init({
    food_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    food_name: DataTypes.STRING,
    description: DataTypes.STRING,
    quantitative: DataTypes.STRING,
    ingredient_description: DataTypes.STRING,
    implementation_guide: DataTypes.STRING,
    user_id: {
      type: DataTypes.UUID,
    },
    cate_detail_id: {
      type: DataTypes.UUID,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      validate: {
        isIn: {
          args: [['Active', 'Deactive']],
          msg: 'Invalid value for food.status (Active, Deactive)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Foods',
  });
  return Food;
};