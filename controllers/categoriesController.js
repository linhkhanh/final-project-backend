const models = require('../models');
const { getIdParam } = require('./helper');
const httpResponseFormatter = require('../formatters/httpResponse');

async function getAll(req, res) {
    const categories = await models.categories.findAll();
    httpResponseFormatter.formatOkResponse(res, categories);
}

async function getById(req, res) {
    const id = getIdParam(req);
    const categories = await models.categories.findByPk(id);
    if (categories) {
        httpResponseFormatter.formatOkResponse(res, user);
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'This category doesn\'t exist.' });
    }
}

async function create(req, res) {
    if (req.body.id) {
        httpResponseFormatter.formatOkResponse(res, { message: 'ID should not be provided, since it is determined automatically by the database.' });
    } else {
        try {
            await models.categories.create(req.body);
            httpResponseFormatter.formatOkResponse(res, { message: 'A new category is created.' });
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, err.message);
        }

    }
}

async function update(req, res) {
    const id = getIdParam(req);

    if (id) {
        await models.categories.update(req.body, {
            where: {
                id: id
            }
        });
        httpResponseFormatter.formatOkResponse(res, { message: 'Update successfully.' });
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'This categories doesn\'t esixt' });
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    await models.categories.destroy({
        where: {
            id: id
        }
    });
    httpResponseFormatter.formatOkResponse(res, { message: 'Delete successfully.' });
}

async function getByIncome(req, res) {
    try {
        const categories = await models.categories.findAll({
            where: {
                type: "income"
            }
        });
    } catch (err) {
        httpResponseFormatter.formatOkResponse(res, { message: err.message });
    }
}

async function getByExpense(req, res) {
    try {
        const categories = await models.categories.findAll({
            where: {
                type: "expense"
            }
        });
    } catch (err) {
        httpResponseFormatter.formatOkResponse(res, { message: err.message });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getByIncome,
    getByExpense
};