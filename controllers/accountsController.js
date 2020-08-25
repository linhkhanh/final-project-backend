const models = require('../models');
const { getIdParam } = require('./helper');
const httpResponseFormatter = require('../formatters/httpResponse');

async function getAll(req, res) {
    if (req.session.userId) {
        const accounts = await models.accounts.findAll();
        httpResponseFormatter.formatOkResponse(res, accounts);
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
    }
}

async function getById(req, res) {
    if (req.session.userId) {
        const id = getIdParam(req);
        const account = await models.accounts.findByPk(id);
        if (account) {
            httpResponseFormatter.formatOkResponse(res, account);
        } else {
            httpResponseFormatter.formatOkResponse(res, { message: 'This account doesn\'t exist.' });
        }
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
    }
}

async function create(req, res) {
    if (!req.session.userId) {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
    } else {
        try {
            req.body.userId = req.session.userId;
            await models.accounts.create(req.body);
            httpResponseFormatter.formatOkResponse(res, { message: 'A new account is created.' });
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: err.message });
        }

    }
}

async function update(req, res) {
    if (req.session.userId) {
        const id = getIdParam(req);
        try {
            await models.accounts.update(req.body, {
                where: {
                    id: id
                }
            });
            httpResponseFormatter.formatOkResponse(res, { message: 'Update successfully.' });
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: err.message });
        }
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
    }

}

async function remove(req, res) {
    if (req.session.userId) {
        const id = getIdParam(req);
        try {
            await models.accounts.destroy({
                where: {
                    id: id
                }
            });
            httpResponseFormatter.formatOkResponse(res, { message: 'Delete successfully.' });
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: err.message });
        }
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
    }

}

async function getAllAccounts(req, res) {
	if (req.session.userId) {
		try {
			const id = getIdParam(req);
			const accounts = await models.accounts.findAll({
				where: {
					userId: id
				}
			});
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
    create,
    update,
    remove,
    getAllAccounts
};