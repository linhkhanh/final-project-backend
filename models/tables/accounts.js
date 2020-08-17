const { DataTypes } = require('sequelize');
// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('accounts', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
			type: DataTypes.STRING
        },
        user_id: {
            allowNull: false,
			type: DataTypes.INTEGER
        }
	});
};