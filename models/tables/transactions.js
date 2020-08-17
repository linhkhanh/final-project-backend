const { DataTypes } = require('sequelize');
// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
    return sequelize.define('transactions', {
        // The following specification of the 'id' attribute could be omitted
        // since it is the default.
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        amount: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        description: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        paidAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        accountId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        categoryId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });
};