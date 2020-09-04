const models = require('../models');
const { getIdParam } = require('./helper');
const { QueryTypes } = require('sequelize');
const httpResponseFormatter = require('../formatters/httpResponse');

async function getAll(req, res) {
    const categories = await models.categories.findAll();
    httpResponseFormatter.formatOkResponse(res, categories);
}

async function getById(req, res) {
    const id = getIdParam(req);
    try {
        const category = await models.categories.findByPk(id);
        if (category) {
            httpResponseFormatter.formatOkResponse(res, category);
        } else {
            httpResponseFormatter.formatOkResponse(res, { message: 'This category doesn\'t exist.' });
        }
    } catch (err) {
        httpResponseFormatter.formatOkResponse(res, { message: err.message });
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
        httpResponseFormatter.formatOkResponse(res, categories);
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
        httpResponseFormatter.formatOkResponse(res, categories);
    } catch (err) {
        httpResponseFormatter.formatOkResponse(res, { message: err.message });
    }
}

async function calculateMoneyIncome(req, res) {
    if(req.session.userId) {
        try {
            // get income categories
            const categories = await models.categories.findAll({
                where: {
                    type: "income"
                }
            });
            const id = getIdParam(req);
            const allAccounts = await models.accounts.findAll({
                where: {
                    userId: id
                }
            });
             const inComeDetail = [];

            for(let i = 0; i < categories.length; i++) {
                const totalMoney = await models.sequelize.query(`
                SELECT SUM(amount) as total
                FROM 
                    transactions a, 
                    categories b
                WHERE b.id = ${categories[i].id}
                    AND a."userId" = ${id}
                    AND a."categoryId" = b.id
                `, { type: QueryTypes.SELECT });

                if(totalMoney[0].total) inComeDetail.push({
                    categoryId: categories[i].id,
                    total: (totalMoney[0].total/100).toFixed(2)
                })
            }
            httpResponseFormatter.formatOkResponse(res, inComeDetail);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: err.message });
        }
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
    }
}

async function calculateMoneyExpense(req, res) {
    if(req.session.userId) {
        try {
            // get income categories
            const categories = await models.categories.findAll({
                where: {
                    type: "expense"
                }
            });
            const id = getIdParam(req);
            const allAccounts = await models.accounts.findAll({
                where: {
                    userId: id
                }
            });
             const expenseDetail = [];

            for(let i = 0; i < categories.length; i++) {
                const totalMoney = await models.sequelize.query(`
                SELECT SUM(amount) as total
                FROM 
                    transactions a, 
                    categories b
                WHERE b.id = ${categories[i].id}
                    AND a."userId" = ${id}
                    AND a."categoryId" = b.id
                `, { type: QueryTypes.SELECT });

                if(totalMoney[0].total) expenseDetail.push({
                    categoryId: categories[i].id,
                    total: (totalMoney[0].total/100).toFixed(2)
                })
            }
            httpResponseFormatter.formatOkResponse(res, expenseDetail);
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
    getByIncome,
    getByExpense,
    calculateMoneyIncome,
    calculateMoneyExpense
};