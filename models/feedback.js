'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Feedback.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: 'user_id',
        as: "feedback_user",
      });
      Feedback.belongsTo(models.Foods, {
        foreignKey: "food_id",
        targetKey: 'food_id',
        as: "feedback_food",
      });
      Feedback.belongsTo(models.Ingredient, {
        foreignKey: "ingredient_id",
        targetKey: 'ingredient_id',
        as: "feedback_ingredient",
      });
    }
  }
  Feedback.init({
    feedback_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: DataTypes.STRING,
    user_id: {
      type: DataTypes.UUID
    },
    food_id: {
      type: DataTypes.UUID
    },
    ingredient_id: {
      type: DataTypes.UUID
    },
    refresh_token: DataTypes.STRING,
    accessChangePassword: DataTypes.BOOLEAN,
    status: {
      type: DataTypes.ENUM,
      values: ["Active", "Deactive"],
      validate: {
        isIn: {
          args: [["Active", "Deactive"]],
          msg: 'Invalid value for feedback.status (Active, Deactive)'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Feedback',
  });
  return Feedback;
};