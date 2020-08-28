const models = require('../models');
const httpResponseFormatter = require('../formatters/httpResponse');
const { getIdParam, hashPassword, getAllTransactionsByUserId } = require('./helper');

async function getAll (req, res) {
    if (req.session.userId) {
        const users = await models.users.findAll();
        httpResponseFormatter.formatOkResponse(res, users);
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
    }
}

async function getById (req, res) {
    const id = getIdParam(req);
    if (req.session.userId) {
        try {
            const user = await models.users.findByPk(id);
            httpResponseFormatter.formatOkResponse(res, user);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: err.message });
        }

    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
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
    if (req.session.userId) {
        const id = getIdParam(req);
        if (req.session.userId === id) {
            req.body.password = hashPassword(req.body.password);
            await models.users.update(req.body, {
                where: {
                    id: id
                }
            });
            httpResponseFormatter.formatOkResponse(res, { message: 'Update successfully.' });
        } else {
            httpResponseFormatter.formatOkResponse(res, { message: 'You can not do this action' });
        }
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
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
    if (req.session.userId) {
        try {
            const id = getIdParam(req);
            const accounts = await models.accounts.findAll({
                where: {
                    userId: id
                }
            });
            console.log(accounts);
            httpResponseFormatter.formatOkResponse(res, accounts);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: err.message });
        }

    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
    }
}



module.exports = {
    getAll,
    getById,
    getByEmail,
    create,
    update,
    remove,
    getAllAccounts
};