'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ingredient.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: 'user_id',
        as: "ingredient_user",
      });
      Ingredient.belongsTo(models.Category_detail, {
        foreignKey: "cate_detail_id",
        targetKey: 'cate_detail_id',
        as: "ingredient_cate_detail",
      });
      Ingredient.belongsTo(models.Promotion, {
        foreignKey: "promotion_id",
        targetKey: 'promotion_id',
        as: "ingredient_promotion",
      });
      Ingredient.hasMany(models.Feedback, { as: 'ingredient_feedback', foreignKey: 'promotion_id'});
      Ingredient.belongsToMany(models.Order, {
        through: 'Order_detail',
        foreignKey: 'ingredient_id',
        otherKey: 'order_id',
        as: "ingredient_order_detail",
      });
    }
  }
  Ingredient.init({
    ingredient_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ingredient_name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    quantitative: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    user_id: {
      type: DataTypes.UUID,
    },
    promotion_id: {
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
          msg: 'Invalid value for ingredient.status (Active, Deactive)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Ingredient',
  });
  return Ingredient;
};