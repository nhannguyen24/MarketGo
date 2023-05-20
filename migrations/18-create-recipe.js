'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recipes', {
      recipe_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      ingredient_description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      implementation_guide: {
        type: Sequelize.STRING,
        allowNull: false
      },
      food_id: {
        type: Sequelize.UUID,
        references: {
          model: 'foods',
          key: 'food_id'
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
    await queryInterface.dropTable('Recipes');
  }
};