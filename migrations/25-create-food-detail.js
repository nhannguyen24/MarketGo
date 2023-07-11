'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Food_details', {
      food_detail_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      food_id: {
        type: Sequelize.UUID,
        references: {
          model: 'foods',
          key: 'food_id'
        }
      },
      ingredient_id: {
        type: Sequelize.UUID,
        references: {
          model: 'ingredients',
          key: 'ingredient_id'
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Active', 'Deactive'],
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
    await queryInterface.dropTable('Food_details');
  }
};