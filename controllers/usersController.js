const models = require('../models');
const httpResponseFormatter = require('../formatters/httpResponse');
const { getIdParam, hashPassword } = require('./helper');

async function getAll (req, res) {
    const users = await models.users.findAll();
    httpResponseFormatter.formatOkResponse(res, users);
}

async function getById (req, res) {
    const id = getIdParam(req);
    const user = await models.users.findByPk(id);
    if (user) {
        httpResponseFormatter.formatOkResponse(res, user);
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'This user doesn\'t exist.' });
    }
}

async function getByEmail (req, res) {
    const user = await models.users.findOne({ where: { email: req.body.email } });
    if (user) {
        httpResponseFormatter.formatOkResponse(res, user);
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'This user doen\'t exist.' });
    }
}

async function create (req, res) {
    if (req.body.id) {
        httpResponseFormatter.formatOkResponse(res, { message: 'ID should not be provided, since it is determined automatically by the database.' });
    } else {
        try {
            req.body.password = hashPassword(req.body.password);
            await models.users.create(req.body);
            httpResponseFormatter.formatOkResponse(res, { message: 'A new user is created.' });
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { err: 'This email is used already. Please choose another one.' });
        }
		
    }
}

async function update (req, res) {
    const id = getIdParam(req);
    if (id) {
		req.body.password = hashPassword(req.body.password);
        await models.users.update(req.body, {
            where: {
                id: id
            }
        });
        httpResponseFormatter.formatOkResponse(res, { message: 'Update successfully.' });
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'This user doesn\'t exist' });
    }
}

async function remove (req, res) {
    const id = getIdParam(req);
    await models.users.destroy({
        where: {
            id: id
        }
    });
    httpResponseFormatter.formatOkResponse(res, { message: 'Delete successfully.' });
}

async function getAllAccounts (req, res) {
	const id = getIdParam(req);
	const accounts = await models.accounts.findAll({
		where: {
			userId: id
		}
	});
	console.log(accounts);
	if(accounts) {
		httpResponseFormatter.formatOkResponse(res, accounts);
	} else {
		httpResponseFormatter.formatOkResponse(res, {
			message: "You don't have any account"
		});
	}
}

async function getAllTransactions (req, res) {
	const id = getIdParam(req);
	const transactions = await models.transactions.findAll({
		where: {
			userId: id
		}
	});
	console.log(transactions);
	if(transactions) {
		httpResponseFormatter.formatOkResponse(res, transactions);
	} else {
		httpResponseFormatter.formatOkResponse(res, {
			message: "You don't have any transaction"
		});
	}
}

module.exports = {
    getAll,
    getById,
    getByEmail,
    create,
    update,
	remove,
	getAllAccounts,
	getAllTransactions
};