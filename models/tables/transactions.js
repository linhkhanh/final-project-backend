const { DataTypes } = require('sequelize');
// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('transactions', {
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
		paid_at: {
			allowNull: false,
			type: DataTypes.DATE
        },
        account_id: {
            allowNull: false,
			type: DataTypes.INTEGER
        },
        category_id: {
            allowNull: false,
			type: DataTypes.INTEGER
        },
        user_id: {
            allowNull: false,
			type: DataTypes.INTEGER
        }
	});
};