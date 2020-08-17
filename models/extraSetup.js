function applyExtraSetup(sequelize) {
    const { users, transactions, accounts, categories } = sequelize.models;
    
    users.hasMany(accounts);
    accounts.belongsTo(users);

	users.hasMany(transactions);
    transactions.belongsTo(users);
    
    transactions.hasOne(categories);
    transactions.hasOne(accounts);
}

module.exports = { applyExtraSetup };