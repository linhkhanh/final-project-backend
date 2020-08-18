'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('accounts', ['name', 'userId'], {
      unique: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('accounts', ['name', 'userId'])
  }
};
