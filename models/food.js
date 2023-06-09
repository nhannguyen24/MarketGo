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
      Food.hasMany(models.Guild_step, { as: 'food_step', foreignKey: 'food_id'});

      Food.belongsToMany(models.Ingredient, {
        through: 'Food_detail',
        foreignKey: 'food_id',
        otherKey: 'ingredient_id',
        as: "food_detail",
      });
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
    price: DataTypes.DOUBLE,
    calories: DataTypes.INTEGER,
    proteins: DataTypes.DOUBLE,
    fats: DataTypes.DOUBLE,
    carbohydrates: DataTypes.DOUBLE,
    fibers: DataTypes.DOUBLE,
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
  Food.beforeCreate((food, options) => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);
    food.createdAt = currentDate;
    food.updatedAt = currentDate;
  });
  return Food;
};