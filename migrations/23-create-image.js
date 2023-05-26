'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      image_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      image: {
        type: Sequelize.STRING(1000),
      },
      ingredient_id: {
        type: Sequelize.UUID,
        references: {
          model: 'ingredients',
          key: 'ingredient_id'
        }
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
    await queryInterface.dropTable('Images');
  }
};