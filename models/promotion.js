'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promotion.hasMany(models.Ingredient, { as: 'promotion_ingredient', foreignKey: 'promotion_id'});
    }
  }
  Promotion.init({
    promotion_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    promotion_name: DataTypes.STRING,
    description: DataTypes.STRING,
    discount: DataTypes.DECIMAL,
    Start_time: DataTypes.DATE,
    End_time: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      validate: {
        isIn: {
          args: [['Active', 'Deactive']],
          msg: 'Invalid value for promotion.status (Active, Deactive)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Promotion',
  });
  return Promotion;
};