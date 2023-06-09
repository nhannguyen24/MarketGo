'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Order_details', {
      order_detail_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      order_id: {
        type: Sequelize.UUID,
        references: {
          model: 'orders',
          key: 'order_id'
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
    await queryInterface.dropTable('Order_details');
  }
};