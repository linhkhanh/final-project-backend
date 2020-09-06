const models = require('../models');
const { QueryTypes } = require('sequelize');
const { getIdParam, getAllTransactions } = require('./helper');
const httpResponseFormatter = require('../formatters/httpResponse');
const { Op } = require("sequelize");

async function getAll(req, res) {
    if (req.session.userId) {
        const transactions = await models.transactions.findAll();
        httpResponseFormatter.formatOkResponse(res, transactions);
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
    }
}

async function getById(req, res) {
    if (req.session.userId) {
        const id = getIdParam(req);
        try {
            const transaction = await models.transactions.findByPk(id);
            httpResponseFormatter.formatOkResponse(res, transaction);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: 'This one doesn\'t exist.' });
        }
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
    }
}

async function create(req, res) {
    if (!req.session.userId) {
        httpResponseFormatter.formatOkResponse(res, { message: " Your need to login." });
    } else {
        try {
            req.body.userId = req.session.userId
            await models.transactions.create(req.body);
            httpResponseFormatter.formatOkResponse(res, { message: 'A new transaction is created.' });
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: err.message });
        }
    }
}

async function update(req, res) {
    if (req.session.userId) {
        const id = getIdParam(req);
        try {
            await models.transactions.update(req.body, {
                where: {
                    id: id
                }
            });
            httpResponseFormatter.formatOkResponse(res, { message: 'Update successfully.' });
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: "You don't have this transaction" });
        }
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
    }

}

async function remove(req, res) {
    if (req.session.userId) {
        try {
            const id = getIdParam(req);
            await models.transactions.destroy({
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

async function getAllTransactionsByCatID(req, res) {
    if (req.session.userId) {
        try {
            const id = getIdParam(req);

            const transactions = await models.transactions.findAll({
                where: {
                    userId: req.session.userId,
                    categoryId: id
                }
            })
           
            transactions.sort((item1, item2) => item2.paidAt - item1.paidAt); 
            
            httpResponseFormatter.formatOkResponse(res, transactions);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                message: err.message
            });
        }
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
    }
}

async function getAllTransactionsByUserId(req, res) {
    if (req.session.userId) {
        try {
            const id = getIdParam(req);
            const transactions = await models.transactions.findAll({
                where: {
                    userId: id
                }
            });
            transactions.sort((item1, item2) => item1.paidAt - item2.paidAt)
            httpResponseFormatter.formatOkResponse(res, transactions);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                message: err.message
            });
        }
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
    }

}

async function getAllTransactionsByAccountId(req, res) {
    if (req.session.userId) {

        try {
            const id = getIdParam(req);
            const transactions = await models.transactions.findAll({
                where: {
                    accountId: id
                }
            });
            transactions.sort((item1, item2) => item1.paidAt - item2.paidAt)
            httpResponseFormatter.formatOkResponse(res, transactions);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                message: err.message
            });
        }
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
    }
}

async function calculateBalance(req, res) {
    if (req.session.userId) {
        const id = getIdParam(req);
        const totalIncome= await models.sequelize.query(`
        SELECT SUM(amount) as total_income
            FROM 
                transactions a, 
                categories b
            WHERE b.type = 'income' 
                AND a."userId" = ${id}
                AND a."categoryId" = b.id
        `, { type: QueryTypes.SELECT });

        const totalExpense= await models.sequelize.query(`
        SELECT SUM(amount) as total_expense
        FROM 
            transactions a, 
            categories b
        WHERE b.type = 'expense' 
            AND a."userId" = ${id}
            AND a."categoryId" = b.id
        `, { type: QueryTypes.SELECT });

        if(!totalIncome[0].total_income) totalIncome[0].total_income = 0;
        if(!totalExpense[0].total_expense) totalExpense[0].total_expense = 0;
        const balance = totalIncome[0].total_income - totalExpense[0].total_expense;

        httpResponseFormatter.formatOkResponse(res, {
            totalIncome: totalIncome[0].total_income,
            totalExpense: totalExpense[0].total_expense, 
            balance: balance
        });
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
    }
}

async function eachAccount (req, res) {
    if(req.session.userId) {
        const id = getIdParam(req);
        const allAccounts = await models.accounts.findAll({
            where: {
                userId: id
            }
        });
        const accountDetail = [];
        for(let i = 0; i < allAccounts.length; i++) {
            const totalIncome = await models.sequelize.query(`
            SELECT SUM(amount) as total_income
            FROM 
                transactions a, 
                categories b,
                accounts c
            WHERE b.type = 'income'
                AND c.id = ${allAccounts[i].id}
                AND a."categoryId" = b.id
                AND a."accountId" = c.id;
            `, { type: QueryTypes.SELECT });

            const totalExpense = await models.sequelize.query(`
            SELECT SUM(amount) as total_expense
            FROM 
                transactions a, 
                categories b,
                accounts c
            WHERE b.type = 'expense' 
                AND c.id = ${allAccounts[i].id}
                AND a."categoryId" = b.id
                AND a."accountId" = c.id;
            `, { type: QueryTypes.SELECT });
            if(!totalIncome[0].total_income) totalIncome[0].total_income = 0;
            if(!totalExpense[0].total_expense) totalExpense[0].total_expense = 0;

            const balance = totalIncome[0].total_income - totalExpense[0].total_expense;
            accountDetail.push({
                accountId: allAccounts[i].id,
                balance: balance
            })
        }
        console.log("detail", accountDetail);

        httpResponseFormatter.formatOkResponse(res, accountDetail);
       
    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
    }
}

async function calculateTransactionsIncome (req, res) {
    if(req.session.userId) {
        const id = getIdParam(req);
       
        try {
            const transactionsIncome = await models.sequelize.query(`
            select sum(amount) as transactions_income, DATE("paidAt") 
            from 
                transactions a,
                categories b
            where a."userId" = ${id}
                and b."type" = 'income'
                and a."categoryId" = b.id
            group by DATE("paidAt")
            `, { type: QueryTypes.SELECT });

            const data = {};
            for(let i = 0; i < transactionsIncome.length; i++) {
                data[transactionsIncome[i].date] = (+transactionsIncome[i].transactions_income/100).toFixed(2);
            }

            httpResponseFormatter.formatOkResponse(res, data );
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: err.message });
        }

    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
    }
}

async function calculateTransactionsExpense (req, res) {
    if(req.session.userId) {
        const id = getIdParam(req);
       
        try {
            const transactionsExpense = await models.sequelize.query(`
            select sum(amount) as transactions_expense, DATE("paidAt") 
            from 
                transactions a,
                categories b
            where a."userId" = ${id}
                and b."type" = 'expense'
                and a."categoryId" = b.id
            group by DATE("paidAt")
            `, { type: QueryTypes.SELECT });

            const data = {};
            for(let i = 0; i < transactionsExpense.length; i++) {
                data[transactionsExpense[i].date] = (+transactionsExpense[i].transactions_expense/100).toFixed(2);
            }

            httpResponseFormatter.formatOkResponse(res, data );
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, { message: err.message });
        }

    } else {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
    }
}

async function filterTransactions (req, res) {
    if(req.session.userId) {
        try {
            const filteredTransactions = await models.transactions.findAll({
                where: {
                    userId: req.session.userId,
                    paidAt: {
                        [Op.gte]: req.body.startDate,
                        [Op.lte]: req.body.endDate
                    }
                }
            })
            httpResponseFormatter.formatOkResponse(res, filteredTransactions );
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                message: err.message
            } );
        }
    } {
        httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
    }
}

async function getStatisticByAccountId (req, res) {
    if(req.session.userId) {
        try {
            const id = getIdParam(req);
            const totalIncome = await models.sequelize.query(`
            SELECT SUM(amount) as total_income
            FROM 
                transactions a, 
                categories b,
                accounts c
            WHERE b.type = 'income'
                AND c.id = ${id}
                AND a."categoryId" = b.id
                AND a."accountId" = c.id;
            `, { type: QueryTypes.SELECT });

            const totalExpense = await models.sequelize.query(`
            SELECT SUM(amount) as total_expense
            FROM 
                transactions a, 
                categories b,
                accounts c
            WHERE b.type = 'expense' 
                AND c.id = ${id}
                AND a."categoryId" = b.id
                AND a."accountId" = c.id;
            `, { type: QueryTypes.SELECT });

            if(!totalIncome[0].total_income) totalIncome[0].total_income = 0;
            if(!totalExpense[0].total_expense) totalExpense[0].total_expense = 0;

            const balance = totalIncome[0].total_income - totalExpense[0].total_expense;

            httpResponseFormatter.formatOkResponse(res, {
                credit: totalExpense[0].total_expense,
                debit: totalIncome[0].total_income,
                balance: balance
            } );

        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                message: err.message
            } );
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
    getAllTransactionsByCatID,
    getAllTransactionsByUserId,
    getAllTransactionsByAccountId,
    calculateBalance,
    eachAccount,
    calculateTransactionsIncome,
    calculateTransactionsExpense,
    filterTransactions,
    getStatisticByAccountId 
};