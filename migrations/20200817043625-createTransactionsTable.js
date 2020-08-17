'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      paid_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      account_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });

  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.dropTable('transactions');
   
  }
};
