'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Guild_step extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Guild_step.belongsTo(models.Foods, {
        foreignKey: "food_id",
        targetKey: 'food_id',
        as: "step_food",
      });
      Guild_step.hasMany(models.Image, { as: 'step_image', foreignKey: 'step_id'});
    }
  }
  Guild_step.init({
    step_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    implementation_guide: DataTypes.STRING,
    food_id: {
      type: DataTypes.UUID,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      validate: {
        isIn: {
          args: [['Active', 'Deactive']],
          msg: 'Invalid value for step.status (Active, Deactive)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Guild_step',
  });
  return Guild_step;
};