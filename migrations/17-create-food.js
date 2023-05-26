'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Foods', {
      food_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      food_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING
      },
      quantitative: {
        type: Sequelize.STRING
      },
      ingredient_description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      implementation_guide: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      cate_detail_id: {
        type: Sequelize.UUID,
        references: {
          model: 'category_details',
          key: 'cate_detail_id'
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: ["Active", "Deactive"],
        defaultValue: 'Active',
      },
      createdAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Foods');
  }
};