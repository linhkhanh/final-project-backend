const bcrypt = require('bcrypt');
const SALT_ROUND = 10;
const models = require('../models');
// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
function getIdParam (req) {
    const id = req.params.id;
    if (/^\d+$/.test(id)) {
        return Number.parseInt(id, 10);
    }
    throw new TypeError(`Invalid ':id' param: "${id}"`);
}

function hashPassword (password){
    const hashed_password = bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUND));
    return hashed_password;
}

async function getAllTransactionByUserId (id) {
    const transactions = await models.transactions.findAll({
		where: {
			userId: id
		}
    });
    return transactions;
}
module.exports = { getIdParam, hashPassword, getAllTransactionByUserId };