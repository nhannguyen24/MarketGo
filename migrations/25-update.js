module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Foods', 'price', {
        type: Sequelize.DOUBLE,
      }),
      queryInterface.addColumn('Foods', 'calories', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('Foods', 'proteins', {
        type: Sequelize.DOUBLE,
      }),
      queryInterface.addColumn('Foods', 'fats', {
        type: Sequelize.DOUBLE,
      }),
      queryInterface.addColumn('Foods', 'carbohydrates', {
        type: Sequelize.DOUBLE,
      }),
      queryInterface.addColumn('Foods', 'fibers', {
        type: Sequelize.DOUBLE,
      })
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Foods', 'price'),
      queryInterface.removeColumn('Foods', 'calories'),
      queryInterface.removeColumn('Foods', 'proteins'),
      queryInterface.removeColumn('Foods', 'fats'),
      queryInterface.removeColumn('Foods', 'carbohydrates'),
      queryInterface.removeColumn('Foods', 'fibers')
    ]);
  }
};