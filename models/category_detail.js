'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category_detail.belongsTo(models.Category, {
        foreignKey: "cate_id",
        targetKey: 'cate_id',
        as: "detail_cate",
      });
    }
  }
  Category_detail.init({
    cate_detail_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cate_detail_name: DataTypes.STRING,
    cate_id: {
      type: DataTypes.UUID
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      validate: {
        isIn: {
          args: [['Active', 'Deactive']],
          msg: 'Invalid value for category_detail.status (Active, Deactive)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category_detail',
  });
  Category_detail.beforeCreate((cate_detail, options) => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);
    cate_detail.createdAt = currentDate;
    cate_detail.updatedAt = currentDate;
  });
  return Category_detail;
};