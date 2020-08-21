const  models  = require('../models');
const { getIdParam } = require('./helper');
const httpResponseFormatter = require('../formatters/httpResponse');

async function getAll (req, res) {
    const accounts = await models.accounts.findAll();
    httpResponseFormatter.formatOkResponse(res, accounts);
}

async function getById (req, res) {
    const id = getIdParam(req);
    const account = await models.accounts.findByPk(id);
    if (account) {
        httpResponseFormatter.formatOkResponse(res, account);
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'This account doesn\'t exist.' });
    }
}

async function create (req, res) {
    if (req.body.id) {
        httpResponseFormatter.formatOkResponse(res, { message: 'ID should not be provided, since it is determined automatically by the database.' });
    } else {
        req.body.userId = req.session.userId;
        await models.accounts.create(req.body);
        httpResponseFormatter.formatOkResponse(res, { message: 'A new account is created.' });
    }
}

async function update (req, res) {
    const id = getIdParam(req);
    
    if (id) {
        await models.accounts.update(req.body, {
            where: {
                id: id
            }
        });
        httpResponseFormatter.formatOkResponse(res, { message: 'Update successfully.' });
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'This account doen\'t exist.' });
    }
}

async function remove (req, res) {
    const id = getIdParam(req);
    await models.accounts.destroy({
        where: {
            id: id
        }
    });
    httpResponseFormatter.formatOkResponse(res, { message: 'Delete successfully.' });
}

async function getAllTransactions (req, res) {
    const id = getIdParam(req);
    const transactions = await models.transactions.findAll({
        where: {
            accountId: id
        }
    });
    if(transactions) {
        httpResponseFormatter.formatOkResponse(res, transactions);
    } else {
        httpResponseFormatter.formatOkResponse(res, {
            message: "You don't have any transaction."
        });
    }
}
module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getAllTransactions
};