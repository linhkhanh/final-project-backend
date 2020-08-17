function applyExtraSetup (db) {
    const { users, transactions, accounts, categories } = db;

    console.log(users);
  
    users.hasMany(accounts);
    accounts.belongsTo(users);

    users.hasMany(transactions);
    transactions.belongsTo(users);
    
    categories.hasMany(transactions);
    transactions.belongsTo(categories);

    accounts.hasMany(transactions);
    transactions.belongsTo(accounts);
}

module.exports = { applyExtraSetup };